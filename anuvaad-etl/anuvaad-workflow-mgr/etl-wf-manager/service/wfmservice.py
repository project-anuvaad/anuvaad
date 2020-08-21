import logging
import time

from utilities.wfmutils import WFMUtils
from kafkawrapper.wfmproducer import Producer
from repository.wfmrepository import WFMRepository
from validator.wfmvalidator import WFMValidator
from configs.wfmconfig import anu_etl_wfm_core_topic
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_exception


log = logging.getLogger('file')
producer = Producer()
wfmrepo = WFMRepository()
wfmutils = WFMUtils()
validator = WFMValidator()


class WFMService:
    def __init__(self):
        pass

    # Method to register the job.
    # Generates job ID, creates entry to the DB, passes the request to further processing
    # Returns client-readable job status.
    def register_job(self, wf_input):
        wf_input["jobID"] = wfmutils.generate_job_id(wf_input["workflowCode"])
        client_output = self.get_wf_details(wf_input, None, False, None)
        self.update_job_details(client_output, True)
        producer.push_to_queue(client_output, anu_etl_wfm_core_topic)
        return client_output

    # Method to initiate the workflow.
    # This fetches the first step of workflow and starts the job.
    def initiate(self, wf_input):
        try:
            order_of_execution = wfmutils.get_order_of_exc(wf_input["workflowCode"])
            first_step_details = order_of_execution[0]
            first_tool = first_step_details["tool"][0]
            input_topic = first_tool["kafka-input"][0]["topic"]
            first_tool_input = wfmutils.get_tool_input(first_tool["name"], None, None, wf_input)
            if first_tool_input is None:
                error = validator.get_error("INCOMPATIBLE_TOOL_SEQUENCE", "The workflow contains incompatible steps.")
                client_output = self.get_wf_details(wf_input, None, True, error)
                self.update_job_details(client_output, False)
                log_error("initiate", "The workflow contains incompatible steps.", wf_input["jobID"], None)
                return None
            producer.push_to_queue(first_tool_input, input_topic)
            client_output = self.get_wf_details(wf_input, None, False, None)
            self.update_job_details(client_output, False)
            log_info("initiate", "Workflow: " + wf_input["workflowCode"] + " initiated for the job: " + wf_input["jobID"], wf_input["jobID"])
        except Exception as e:
            log_exception("initiate", "Exception while initiating workflow: ", wf_input["jobID"], e)
            post_error_wf("WFLOW_INITIATE_ERROR", "Exception while initiating workflow: " + str(e),
                          wf_input["jobID"], None, None, None, None)

    # This method manages the workflow by tailoring the predecessor and successor tools for the workflow.
    def manage(self, task_output):
        try:
            job_id = task_output["jobID"]
            job_details = self.get_job_details(job_id)
            job_details = job_details[0]
            if job_details["status"] == "FAILED" or job_details["status"] == "COMPLETED":
                log_info("manage", "The job is already completed/failed, jobID: " + job_id, job_id)
                return None
            if task_output["status"] != "FAILED":
                next_step_details = self.get_next_step_details(task_output)
                if next_step_details is not None:
                    client_output = self.get_wf_details(None, task_output, False, None)
                    self.update_job_details(client_output, False)
                    next_step_input = next_step_details[0]
                    if next_step_input is None:
                        error = validator.get_error("INCOMPATIBLE_TOOL_SEQUENCE", "The workflow contains incompatible steps.")
                        client_output = self.get_wf_details(None, task_output, True, error)
                        self.update_job_details(client_output, False)
                        return None
                    next_tool = next_step_details[1]
                    step_completed = task_output["stepOrder"]
                    next_step_input["stepOrder"] = step_completed + 1
                    producer.push_to_queue(next_step_input, next_tool["kafka-input"][0]["topic"])
                else:
                    client_output = self.get_wf_details(None, task_output, True, None)
                    self.update_job_details(client_output, False)
                    log_info("manage", "Job completed: " + task_output["jobID"], task_output["jobID"])
            else:
                log_info("manage", "Job FAILED: " + task_output["jobID"], task_output["jobID"])
                client_output = self.get_wf_details(None, task_output, False, task_output["error"])
                self.update_job_details(client_output, False)
        except Exception as e:
            log_exception("manage", "Exception while managing the workflow: ", task_output["jobID"], e)
            post_error_wf("WFLOW_MANAGE_ERROR", "Exception while managing workflow: " + str(e),
                          task_output["jobID"], None, None, None, None)


    # This method computes the input to the next step based on the step just completed.
    def get_next_step_details(self, task_output):
        wf_code = task_output["workflowCode"]
        step_completed = task_output["stepOrder"]
        order_of_execution = wfmutils.get_order_of_exc(wf_code)
        try:
            next_step_details = order_of_execution[step_completed + 1]
            next_tool = next_step_details["tool"][0]
            next_task_input = wfmutils.get_tool_input(next_tool["name"], task_output["tool"], task_output, None)
            return next_task_input, next_tool
        except Exception as e:
            log_exception("get_next_step_details", "No next step found: ", task_output["jobID"], e)
            return None

    # Method to update the status of job.
    def update_job_details(self, wf_details, iscreate):
        if iscreate:
            wfmrepo.create_job(wf_details)
            del wf_details["_id"]
        else:
            jobID = wf_details["jobID"]
            wfmrepo.update_job(wf_details, jobID)


    # Method fetch wf details in a certain format using wf_input or task_output
    # This is the format in which the job details are stored in the db and also returned to user.
    def get_wf_details(self, wf_input, task_output, isfinal, error):
        if wf_input is not None:
            wf_details = self.get_job_details(wf_input["jobID"])
        else:
            wf_details = self.get_job_details(task_output["jobID"])
        if wf_details is None or len(wf_details) == 0:
            task_details = []
            if task_output is not None:
                task_details = [task_output]
            client_input = {
                "workflowCode": wf_input["workflowCode"],
                "files": wf_input["files"]
            }
            client_output = {"input": client_input, "jobID": wf_input["jobID"], "workflowCode": wf_input["workflowCode"],
                "status": "STARTED", "state": "INITIATED", "metadata": wf_input["metadata"],
                "startTime": eval(str(time.time()).replace('.', '')), "taskDetails": task_details}
        else:
            wf_details = wf_details[0]
            if task_output is not None:
                task_details = wf_details["taskDetails"]
                task_details.append(task_output)
                wf_details["output"] = task_output["output"]
                wf_details["state"] = task_output["state"]
                wf_details["taskDetails"] = task_details
            client_output = wf_details
            if isfinal:
                client_output["status"] = "COMPLETED"
                client_output["endTime"] = eval(str(time.time()).replace('.', ''))
            else:
                client_output["status"] = "INPROGRESS"
            if error is not None:
                client_output["status"] = "FAILED"
                client_output["endTime"] = eval(str(time.time()).replace('.', ''))
                client_output["error"] = error

        return client_output


    # Method to search jobs on job id
    def get_job_details(self, job_id):
        query = {"jobID": job_id}
        return wfmrepo.search_job(query)

    # Method to search jobs on multiple criteria.
    def get_job_details_bulk(self, req_criteria):
        criteria = {}
        if 'jobIDs' in req_criteria.keys():
            if req_criteria["jobIDs"]:
                criteria["jobID"] = {"$in": req_criteria["jobIDs"]}
        if 'userIDs' in req_criteria.keys():
            if req_criteria["userIDs"]:
                criteria["metadata.userID"] = {"$in": req_criteria["userIDs"]}

        return wfmrepo.search_job(criteria)


    # This function is called upon receiving an error on the error topic.
    # The error will be posted to the topic by one of the downstream services upon any error/exception in those services
    # This function will receive the error and update the status of the job.
    def update_errors(self, error):
        try:
            job_id = error["jobID"]
            job_details = self.get_job_details(job_id)
            job_details = job_details[0]
            job_details["status"] = "FAILED"
            job_details["endTime"] = eval(str(time.time()).replace('.', ''))
            job_details["error"] = error
            self.update_job_details(job_details, False)
        except Exception as e:
            log_exception("update_errors", "Failed to update tool error: ", error["jobID"], e)
            post_error("TOOL_ER_UPDATE_ERROR", "Failed to update tool error: " + str(e), None)



