import logging
import time

from utilities.wfmutils import WFMUtils
from kafkawrapper.wfmproducer import Producer
from repository.wfmrepository import WFMRepository
from validator.wfmvalidator import WFMValidator
from configs.wfmconfig import anu_etl_wfm_core_topic
from configs.wfmconfig import log_msg_start
from configs.wfmconfig import log_msg_end
from configs.wfmconfig import module_wfm_name
from anuvaad_auditor.errorhandler import post_error_wf, post_error
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
        configs = wfmutils.get_configs()
        wf_type = configs[wf_input["workflowCode"]]["type"]
        if wf_type == "ASYNC":
            producer.push_to_queue(client_output, anu_etl_wfm_core_topic)
            return client_output
        else:
            return self.process_sync(client_output)

    # Method to initiate the workflow.
    # This fetches the first step of workflow and starts the job.
    def process_sync(self, wf_input):
        try:
            order_of_execution = wfmutils.get_order_of_exc(wf_input["workflowCode"])
            tool_output = None
            previous_tool = None
            for tool_order in order_of_execution.keys():
                step_details = order_of_execution[tool_order]
                tool_details = step_details["tool"][0]
                log_info(tool_details["name"] + log_msg_start, wf_input)
                uri = tool_details["api-details"][0]["uri"]
                if not tool_output:
                    tool_input = wfmutils.get_tool_input_sync(tool_details["name"], None, None, wf_input)
                else:
                    tool_input = wfmutils.get_tool_input_sync(tool_details["name"], tool_output, previous_tool, None)
                response = wfmutils.call_api(uri, tool_input)
                if not response:
                    log_error("There was an error from the tool: " + str(tool_details["name"]), wf_input, None)
                    error = post_error("ERROR_FROM_TOOL", "There was an error from: " + str(tool_details["name"]), None)
                    client_output = self.get_wf_details(wf_input, None, True, error)
                    self.update_job_details(client_output, False)
                    log_info("Job FAILED, jobID: " + str(wf_input["jobID"]), wf_input)
                    return client_output
                else:
                    if 'error' in response.keys():
                        log_error("Error from the tool: " + str(tool_details["name"], " | Cause: " + str(response["error"])), None)
                        error = post_error("ERROR_FROM_TOOL",
                                           "Error from the tool: " + str(tool_details["name"], " | Cause: " + str(response["error"])), None)
                        client_output = self.get_wf_details(wf_input, None, True, error)
                        self.update_job_details(client_output, False)
                        log_info("Job FAILED, jobID: " + str(wf_input["jobID"]), wf_input)
                        return client_output
                    tool_output = response
                    previous_tool = tool_details["name"]
                    log_info(tool_details["name"] + log_msg_end, wf_input)
            client_output = self.get_wf_details(tool_output, None, True, None)
            self.update_job_details(client_output, False)
            log_info("Job COMPLETED, jobID: " + str(wf_input["jobID"]), wf_input)
            return client_output
        except Exception as e:
            log_exception("Exception while processing sync workflow: " + str(e), wf_input, e)
            error = post_error("SYNC_WFLOW_ERROR", "Exception while processing the sync workflow: " + str(e), wf_input, e)
            client_output = self.get_wf_details(wf_input, None, True, error)
            self.update_job_details(client_output, False)
            log_info("Job FAILED, jobID: " + str(wf_input["jobID"]), wf_input)
            return client_output

    # Method to initiate the workflow.
    # This fetches the first step of workflow and starts the job.
    def initiate_wf(self, wf_input):
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
                log_error("The workflow contains incompatible steps.", wf_input, None)
                return None
            producer.push_to_queue(first_tool_input, input_topic)
            client_output = self.get_wf_details(wf_input, None, False, None)
            self.update_job_details(client_output, False)
            wf_input["metadata"]["module"] = module_wfm_name  # FOR LOGGING ONLY.
            log_info("Workflow: " + wf_input["workflowCode"] + " initiated for the job: " + wf_input["jobID"], wf_input)
            log_info(first_tool["name"] + log_msg_start, wf_input)
        except Exception as e:
            log_exception("Exception while initiating workflow: " + str(e), wf_input, e)
            wf_input["taskID"] = "TASK-ID-NA"
            post_error_wf("WFLOW_INITIATE_ERROR", "Exception while initiating workflow: " + str(e), wf_input, e)

    # This method manages the workflow by tailoring the predecessor and successor tools for the workflow.
    def manage_wf(self, task_output):
        try:
            job_id = task_output["jobID"]
            job_details = wfmutils.get_job_details(job_id)
            if not job_details:
                log_error("This job is not found in the system, jobID: " + job_id, task_output, None)
                return None
            log_info(task_output["tool"] + log_msg_end, task_output)
            job_details = job_details[0]
            if job_details["status"] == "FAILED" or job_details["status"] == "COMPLETED":
                log_error("The job is already completed/failed, jobID: " + job_id, task_output, None)
                return None
            if task_output["status"] != "FAILED":
                next_step_details = self.get_next_step_details(task_output)
                if next_step_details is not None:
                    if next_step_details == "EXC":
                        log_error("Job FAILED: " + task_output["jobID"], task_output, None)
                        post_error_wf("NEXT_STEP_EXCEPTION",
                                      "There was an error while fetching the next step for this wf", task_output, None)
                        return None
                    client_output = self.get_wf_details(None, task_output, False, None)
                    self.update_job_details(client_output, False)
                    next_step_input = next_step_details[0]
                    if next_step_input is None:
                        log_error("The workflow contains incompatible steps in sequence. Please check the wf config.",
                                  task_output, None)
                        post_error_wf("INCOMPATIBLE_TOOL_SEQUENCE",
                                      "The wf contains incompatible steps in sequence. Please check the wf config.",
                                      task_output, None)
                        return None
                    next_tool = next_step_details[1]
                    step_completed = task_output["stepOrder"]
                    next_step_input["stepOrder"] = step_completed + 1
                    producer.push_to_queue(next_step_input, next_tool["kafka-input"][0]["topic"])
                    log_info(next_tool["name"] + log_msg_start, task_output)
                else:
                    client_output = self.get_wf_details(None, task_output, True, None)
                    self.update_job_details(client_output, False)
                    log_info("Job COMPLETED: " + task_output["jobID"], task_output)
            else:  # Safety else block, in case module fails to push data to error topic
                log_error("Job FAILED: " + task_output["jobID"], task_output, None)
                client_output = self.get_wf_details(None, task_output, False, task_output["error"])
                self.update_job_details(client_output, False)
        except Exception as e:
            log_exception("Exception while managing the workflow: " + str(e), task_output, e)
            post_error_wf("WFLOW_MANAGE_ERROR", "Exception while managing workflow: " + str(e), task_output, e)

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
        except KeyError as e:
            log_exception("No next step found: " + str(e), task_output, e)
            return None
        except Exception as e:
            log_exception("Exception while fetching next step" + str(e), task_output, e)
            return "EXC"

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
            wf_details = wfmutils.get_job_details(wf_input["jobID"])
        else:
            wf_details = wfmutils.get_job_details(task_output["jobID"])
        if wf_details is None or len(wf_details) == 0:
            task_details = []
            if task_output is not None:
                task_details = [task_output]
            client_input = {
                "workflowCode": wf_input["workflowCode"]
            }
            if 'textBlocks' in wf_input.keys():
                client_input["textBlocks"] = wf_input["textBlocks"]
            else:
                client_input["files"] = wf_input["files"]
            if 'jobName' in wf_input.keys():
                if wf_input["jobName"]:
                    client_input["jobName"] = wf_input["jobName"]

            client_output = {"input": client_input, "jobID": wf_input["jobID"],
                             "workflowCode": wf_input["workflowCode"],
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
            client_output["metadata"] = wf_details["metadata"]
        return client_output

    # Method to search jobs on multiple criteria.
    def get_job_details_bulk(self, req_criteria):
        criteria = {"metadata.userID": {"$in": req_criteria["userIDs"]}}
        if 'jobIDs' in req_criteria.keys():
            if req_criteria["jobIDs"]:
                jobIDs = []
                for jobID in req_criteria["jobIDs"]:
                    if jobID:
                        jobIDs.append(jobID)
                    if len(jobIDs) > 0:
                        criteria["jobID"] = {"$in": jobIDs}
        if 'workflowCodes' in req_criteria.keys():
            if req_criteria["workflowCodes"]:
                wCodes = []
                for wCode in req_criteria["workflowCodes"]:
                    if wCode:
                        wCodes.append(wCode)
                    if len(wCodes) > 0:
                        criteria["workflowCode"] = {"$in": wCodes}
        if 'statuses' in req_criteria.keys():
            if req_criteria["statuses"]:
                statuses = []
                for status in statuses:
                    if status:
                        statuses.append(status)
                    if len(statuses) > 0:
                        criteria["status"] = {"$in": req_criteria["statuses"]}
        exclude = {'_id': False}
        if 'taskDetails' not in req_criteria.keys():
            exclude["taskDetails"] = False
        else:
            if req_criteria["taskDetails"] is False:
                exclude["taskDetails"] = False
        if 'error' in req_criteria.keys():
            if req_criteria["error"] is False:
                exclude["error"] = False
        return wfmrepo.search_job(criteria, exclude)

    # Method to get wf configs from the remote yaml file.
    def get_wf_configs(self):
        return wfmutils.get_configs()

    # This function is called upon receiving an error on the error topic.
    # The error will be posted to the topic by one of the downstream services upon any error/exception in those services
    # This function will receive the error and update the status of the job.
    def update_errors(self, error):
        try:
            job_id = error["jobID"]
            job_details = wfmutils.get_job_details(job_id)
            job_details = job_details[0]
            if job_details["status"] == "FAILED" or job_details["status"] == "COMPLETED":
                return None
            job_details["status"] = "FAILED"
            job_details["endTime"] = eval(str(time.time()).replace('.', ''))
            job_details["error"] = error
            self.update_job_details(job_details, False)
            log_info("Job FAILED: " + error["jobID"], error)
        except Exception as e:
            log_exception("Failed to update tool error: " + str(e), error, e)
