import logging
import os
import time

from utilities.wfmutils import WFMUtils
from kafkawrapper.wfmproducer import Producer
from repository.wfmrepository import WFMRepository
from validator.wfmvalidator import WFMValidator
from configs.wfmconfig import anu_etl_wfm_core_topic, log_msg_start, log_msg_end, module_wfm_name, page_default_limit, anu_etl_notifier_input_topic, total_no_of_partitions
from anuvaad_auditor.errorhandler import post_error_wf, post_error, log_exception
from anuvaad_auditor.loghandler import log_info, log_error
from repository.redisrepo import REDISRepository
from configs.wfmconfig import app_context, workflowCodesTranslation
import datetime 

log = logging.getLogger('file')
producer = Producer()
wfmrepo = WFMRepository()
wfmutils = WFMUtils()
validator = WFMValidator()
redisRepo = REDISRepository()

class WFMService:
    def __init__(self):
        pass

    # Method to register the SYNC job.
    # Generates job ID, creates entry to the DB, passes the request to further processing
    # Returns client-readable job status.
    def register_sync_job(self, wf_sync_input):
        wf_sync_input["jobID"] = wfmutils.generate_job_id(wf_sync_input["workflowCode"])
        log_info("Initiating SYNC job..", wf_sync_input)
        client_output = self.get_wf_details_sync(wf_sync_input, None, False, None)
        self.update_job_details(client_output, True)
        return self.process_sync(client_output)

    # Method to register the ASYNC job.
    # Generates job ID, creates entry to the DB, passes the request to further processing
    # Returns client-readable job status.
    def register_async_job(self, wf_async_input):
        wf_async_input["jobID"] = wfmutils.generate_job_id(wf_async_input["workflowCode"])
        log_info("Initiating ASYNC job..", wf_async_input)
        client_output = self.get_wf_details_async(wf_async_input, None, False, None)
        self.update_job_details(client_output, True)
        self.update_active_doc_count(wf_async_input,False)
        prod_res = producer.push_to_queue(client_output, anu_etl_wfm_core_topic, total_no_of_partitions)
        if prod_res:
            client_output = self.get_wf_details_async(wf_async_input, None, False, prod_res)
            self.update_job_details(client_output, False)
        return client_output

    # Method to interrupt the job
    def interrupt_job(self, interrupt_in):
        response = []
        if 'jobIDs' in interrupt_in.keys():
            if interrupt_in["jobIDs"]:
                for job_id in interrupt_in["jobIDs"]:
                    job_details = wfmutils.get_job_details(job_id)
                    if not job_details:
                        response.append({"jobID": job_id, "message": "There is no job with this id, cant be interrupted."})
                        continue
                    job_details = job_details[0]
                    if job_details["status"] == "FAILED" or job_details["status"] == "COMPLETED" or job_details["status"] == "INTERRUPTED":
                        response.append({"jobID": job_id, "message": "The job is either completed/failed/interrupted, cant be interrupted."})
                    else:
                        job_details["status"] = "INTERRUPTED"
                        job_details["endTime"] = eval(str(time.time()).replace('.', ''))
                        self.update_job_details(job_details, False)
                        log_info("Job INTERRUPTED: " + str(job_id), {"jobID": job_id})
                        response.append({"jobID": job_id, "message": "Interrupted successfully."})
        return response

    # Method to mark the jobs as inactive
    def mark_inactive(self, req_criteria):
        succeeded, failed, job_ids, message = [], [], [], None
        if 'jobIDs' in req_criteria:
            job_ids = req_criteria["jobIDs"]
        else:
            return {"status": "FAILED", "message": "No job ids found", "succeeded": [], "failed": []}
        if job_ids:
            try:
                log_info("Marking jobs inactive......", None)
                job_details = self.get_job_details_bulk(req_criteria, True)
                if job_details:
                    if len(job_details) < len(job_ids):
                        failed = job_ids
                        message = "This user doesn't have access to either all or few of these jobs"
                    else:
                        for job in job_details:
                            job["active"] = False
                            self.update_job_details(job, False)
                            succeeded.append(str(job["jobID"]))
                            log_info("Job marked as inactive by the user", job)
                else:
                    failed = job_ids
                    message = "No jobs were found for these jobIDs"
                if failed:
                    return {"status": "FAILED", "message": message, "succeeded": succeeded, "failed": failed}
                if len(succeeded) == len(job_ids):
                    message = "All jobs have been successfully marked inactive."
                    return {"status": "SUCCESS", "message": message, "succeeded": succeeded, "failed": failed}
            except Exception as e:
                log_exception("Exception while marking jobs as inactive: " + str(e), None, None)
                return {"status": "FAILED", "message": "Exception while marking inactive", "succeeded": [], "failed": job_ids}
        else:
            return {"status": "FAILED", "message": "Empty job IDs List", "succeeded": [], "failed": []}

    # Method to initiate and process the SYNC workflow.
    def process_sync(self, wf_input):
        try:
            ctx = wf_input
            order_of_execution = wfmutils.get_order_of_exc(wf_input["workflowCode"])
            tool_output = None
            previous_tool = None
            for tool_order in order_of_execution.keys():
                step_details = order_of_execution[tool_order]
                tool_details = step_details["tool"][0]
                log_info(tool_details["name"] + log_msg_start + " jobID: " + ctx["jobID"], ctx)
                if not tool_output:
                    tool_input = wfmutils.get_tool_input_sync(tool_details["name"], None, None, wf_input)
                else:
                    tool_input = wfmutils.get_tool_input_sync(tool_details["name"], previous_tool, tool_output, None)
                log_info(f'Sync Call API Params: {wfmutils.get_tool_config_details(tool_details["name"])["api-details"][0]["uri"]} tool_input: {tool_input} userid: {wf_input["metadata"]["userID"]}',app_context)
                response = wfmutils.call_api(wfmutils.get_tool_config_details(tool_details["name"])["api-details"][0]["uri"], tool_input, wf_input["metadata"]["userID"])
                log_info(f'Sync Call API Response: {response}',app_context)
                error = self.validate_tool_response(response, tool_details, wf_input)
                if error:
                    return error
                tool_output = response
                previous_tool = tool_details["name"]
                ctx["metadata"]["module"] = module_wfm_name
                tool_output["metadata"] = ctx["metadata"]
                log_info(tool_details["name"] + log_msg_end + " jobID: " + ctx["jobID"], ctx)
            client_output = self.get_wf_details_sync(None, tool_output, True, None)
            self.update_job_details(client_output, False)
            log_info("Job COMPLETED, jobID: " + str(wf_input["jobID"]), ctx)
            client_output.pop("input")
            client_output.pop("metadata")
            return client_output
        except Exception as e:
            log_exception("Exception while processing SYNC workflow: " + str(e), wf_input, e)
            error = post_error("SYNC_WFLOW_ERROR", "Exception while processing the sync workflow: " + str(e), e)
            client_output = self.get_wf_details_sync(wf_input, None, True, error)
            self.update_job_details(client_output, False)
            log_info("Job FAILED, jobID: " + str(wf_input["jobID"]), wf_input)
            return client_output

    # Validates errors and returns failure object
    def validate_tool_response(self, tool_response, tool_details, wf_input):
        if not tool_response:
            log_error("Error from the tool: " + str(tool_details["name"]), wf_input, None)
            error = post_error("ERROR_FROM_TOOL", "Error from the tool: " + str(tool_details["name"]), None)
            error["jobID"] = wf_input["jobID"]
            client_output = self.get_wf_details_sync(wf_input, None, True, error)
            self.update_job_details(client_output, False)
            log_info("Job FAILED, jobID: " + str(wf_input["jobID"]), wf_input)
            return client_output
        else:
            fail_msg = None
            if 'error' in tool_response.keys():
                if tool_response["error"]:
                    fail_msg = "Error from the tool: " + str(tool_details["name"]) + " | Cause: " + str(
                        tool_response["error"]["message"])
            elif 'http' in tool_response.keys():
                if 'status' in tool_response["http"]:
                    if tool_response["http"]["status"] != 200:
                        fail_msg = "Error from the tool: " + str(tool_details["name"]) + " | Cause: " + str(
                            tool_response["why"])
            if fail_msg:
                log_error(fail_msg, wf_input, None)
                error = post_error("ERROR_FROM_TOOL", fail_msg, tool_response["error"])
                error["jobID"] = wf_input["jobID"]
                client_output = self.get_wf_details_sync(wf_input, None, True, error)
                self.update_job_details(client_output, False)
                log_info("Job FAILED, jobID: {}".format(wf_input["jobID"]), wf_input)
                return client_output

    # Method fetch wf details in a certain format using wf_input or task_output
    # This is the format in which the job details are stored in the db and also returned to user for SYNC flow.
    def get_wf_details_sync(self, wf_input, task_output, isfinal, error):
        if wf_input is not None:
            wf_details = wfmutils.get_job_details(wf_input["jobID"])
        else:
            wf_details = wfmutils.get_job_details(task_output["jobID"])
        if wf_details is None or len(wf_details) == 0:
            config = wfmutils.get_configs()['workflowCodes'][wf_input["workflowCode"]]
            if "model" in wf_input.keys():
                if "source_language_code" in wf_input["model"].keys():
                    wf_input["source_language_code"] = wf_input["model"]["source_language_code"]
                if "target_language_code" in wf_input["model"].keys():
                    wf_input["target_language_code"] = wf_input["model"]["target_language_code"]
            client_output = {"input": wf_input, "jobID": wf_input["jobID"], "translation": config["translation"],
                             "workflowCode": wf_input["workflowCode"], "active": True,
                             "status": "STARTED", "state": "INITIATED", "metadata": wf_input["metadata"],
                             "startTime": eval(str(time.time()).replace('.', '')[0:13]), "taskDetails": []}
            if 'source_language_code' in wf_input.keys():
                client_output['source_language_code'] = wf_input["source_language_code"]
            if 'target_language_code' in wf_input.keys():
                client_output['target_language_code'] = wf_input["target_language_code"]
            
        else:
            wf_details = wf_details[0]
            if task_output is not None:
                wf_details["output"] = task_output["output"]
                wf_details["state"] = task_output["state"]
            client_output = wf_details
            if isfinal:
                client_output["status"] = "COMPLETED"
                client_output["endTime"] = eval(str(time.time()).replace('.', '')[0:13])
            else:
                client_output["status"] = "INPROGRESS"
            if error is not None:
                client_output["status"] = "FAILED"
                client_output["endTime"] = eval(str(time.time()).replace('.', '')[0:13])
                client_output["error"] = error
            client_output["metadata"] = wf_details["metadata"]
        return client_output


    # Method to initiate the workflow.
    # This fetches the first step of workflow and starts the job.
    def initiate_wf(self, wf_input):
        try:
            order_of_execution = wfmutils.get_order_of_exc(wf_input["workflowCode"])
            first_step_details = order_of_execution[0]
            first_tool = wfmutils.get_tool_config_details(first_step_details["tool"][0]["name"])
            input_topic = os.environ.get(first_tool["kafka-input"], "NA")
            first_tool_input = wfmutils.get_tool_input_async(first_tool["name"], None, None, wf_input)
            if first_tool_input is None or input_topic == "NA":
                error = post_error("INCOMPATIBLE_TOOL_SEQUENCE", "The workflow contains incompatible steps.", None)
                client_output = self.get_wf_details_async(wf_input, None, True, error)
                self.update_job_details(client_output, False)
                log_error("The workflow contains incompatible steps.", wf_input, None)
                return None
            configs_global = wfmutils.get_configs()
            partitions = os.environ.get(configs_global['numPartitions'],str(total_no_of_partitions))
            producer.push_to_queue(first_tool_input, input_topic, eval(partitions))
            client_output = self.get_wf_details_async(wf_input, None, False, None)
            self.update_job_details(client_output, False)
            wf_input["metadata"]["module"] = module_wfm_name  # FOR LOGGING ONLY.
            log_info("Workflow: " + wf_input["workflowCode"] + " initiated for the job: " + wf_input["jobID"], wf_input)
            log_info(first_tool["name"] + log_msg_start + " jobID: " + wf_input["jobID"], wf_input)
        except Exception as e:
            log_exception("Exception while initiating ASYNC workflow: " + str(e), wf_input, e)
            post_error_wf("WFLOW_INITIATE_ERROR", "Exception while initiating workflow: " + str(e), wf_input, e)

    # This method manages the workflow by tailoring the predecessor and successor tools for the workflow.
    def manage_wf(self, task_output):
        try:
            job_id = task_output["jobID"]
            job_details = wfmutils.get_job_details(job_id)
            if not job_details:
                log_error("This job is not found in the system, jobID: " + job_id, task_output, None)
                return None
            log_info(task_output["tool"] + log_msg_end + " jobID: " + task_output["jobID"], task_output)
            job_details = job_details[0]
            if job_details["status"] == "FAILED" or job_details["status"] == "COMPLETED" or job_details["status"] == "INTERRUPTED":
                log_error("The job is already completed/failed/interrupted, jobID: " + job_id, task_output, None)
                return None
            if task_output["status"] != "FAILED":
                next_step_details = self.get_next_step_details(task_output)
                if next_step_details is not None:
                    if next_step_details == "EXC":
                        log_error("Job FAILED: " + task_output["jobID"], task_output, None)
                        post_error_wf("NEXT_STEP_EXCEPTION",
                                      "There was an error while fetching the next step for this wf", task_output, None)
                        return None
                    client_output = self.get_wf_details_async(None, task_output, False, None)
                    self.update_job_details(client_output, False)
                    next_step_input = next_step_details[0]
                    next_tool = wfmutils.get_tool_config_details(next_step_details[1]["name"])
                    topic = os.environ.get(next_tool["kafka-input"], "NA")
                    configs_global = wfmutils.get_configs()
                    partitions = os.environ.get(configs_global['numPartitions'],str(total_no_of_partitions))
                    log_info(f"Partitions: {partitions}",None)
                    if next_step_input is None or topic == "NA":
                        log_error("The workflow contains incompatible steps in sequence. Please check the wf config.",
                                  task_output, None)
                        post_error_wf("INCOMPATIBLE_TOOL_SEQUENCE",
                                      "The wf contains incompatible steps in sequence. Please check the wf config.",
                                      task_output, None)
                        return None
                    next_step_input["stepOrder"] = task_output["stepOrder"] + 1
                    producer.push_to_queue(next_step_input, topic, eval(partitions))
                    log_info(next_tool["name"] + log_msg_start + " jobID: " + task_output["jobID"], task_output)
                else:
                    log_info("Job COMPLETED: " + task_output["jobID"], task_output)
                    #Add code here
                    self.update_active_doc_count(task_output,True)
                    client_output = self.get_wf_details_async(None, task_output, True, None)
                    log.info("JOB COMPLETED Client Output Data: ",client_output)
                    self.update_job_details(client_output, False)
            else:  # Safety else block, in case module fails to push data to error topic
                log_error("Job FAILED: " + task_output["jobID"], task_output, None)
                client_output = self.get_wf_details_async(None, task_output, False, task_output["error"])
                self.update_active_doc_count(task_output,True)
                self.update_job_details(client_output, False)
            #self.push_to_notifier(task_output)
        except Exception as e:
            log_exception("Exception while managing the ASYNC workflow: " + str(e), task_output, e)
            post_error_wf("WFLOW_MANAGE_ERROR", "Exception while managing workflow: " + str(e), task_output, e)

    # Method to push details to noifier module.
    def push_to_notifier(self, task_output):
        job_details = self.get_job_details_bulk({"jobIDs": [task_output["jobID"]]}, True)
        producer.push_to_queue(anu_etl_notifier_input_topic, job_details, total_no_of_partitions)
        log_info("Job details pushed to notifier. | Topic -- {}".format(anu_etl_notifier_input_topic), task_output)

    # This method computes the input to the next step based on the step just completed.
    def get_next_step_details(self, task_output):
        wf_code = task_output["workflowCode"]
        step_completed = task_output["stepOrder"]
        order_of_execution = wfmutils.get_order_of_exc(wf_code)
        try:
            next_step_details = order_of_execution[step_completed + 1]
            next_tool = next_step_details["tool"][0]
            next_task_input = wfmutils.get_tool_input_async(next_tool["name"], task_output["tool"], task_output, None)
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
    # This is the format in which the job details are stored in the db and also returned to user for ASYNC flow.
    def get_wf_details_async(self, wf_input, task_output, isfinal, error):
        if wf_input is not None:
            wf_details = wfmutils.get_job_details(wf_input["jobID"])
        else:
            wf_details = wfmutils.get_job_details(task_output["jobID"])
        if not wf_details:
            task_details = []
            if task_output:
                task_details = [task_output]
            client_output = {"input": wf_input, "jobID": wf_input["jobID"],
                             "workflowCode": wf_input["workflowCode"], "active": True,
                             "status": "STARTED", "state": "INITIATED", "metadata": wf_input["metadata"],
                             "startTime": eval(str(time.time()).replace('.', '')[0:13]), "taskDetails": task_details}
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
                client_output["granularity"] = {}
                if "workflowCode" in client_output.keys():
                    if client_output["workflowCode"] in workflowCodesTranslation:
                        client_output["granularity"]["currentStatus"] = "auto_translation_completed"
                client_output["status"] = "COMPLETED"
                client_output["endTime"] = eval(str(time.time()).replace('.', '')[0:13])
            else:
                client_output["status"] = "INPROGRESS"
            if error is not None:
                client_output["status"] = "FAILED"
                client_output["endTime"] = eval(str(time.time()).replace('.', '')[0:13])
                client_output["error"] = error
            client_output["metadata"] = wf_details["metadata"]
        return client_output

    # Method to search jobs on multiple criteria.
    def get_job_details_bulk(self, req_criteria, skip_pagination, isReviewer=False):
        try:
            criteria = {}
            if isReviewer == False:
                criteria = {"metadata.userID": {"$in": req_criteria["userIDs"]}}
            if 'jobIDs' in req_criteria.keys():
                if req_criteria["jobIDs"]:
                    jobIDs = []
                    for jobID in req_criteria["jobIDs"]:
                        if jobID:
                            jobIDs.append(jobID)
                    if len(jobIDs) > 0:
                        criteria["jobID"] = {"$in": jobIDs}
            if 'orgIDs' in req_criteria.keys():
                if req_criteria["orgIDs"]:
                    orgIDs = []
                    for orgID in req_criteria["orgIDs"]:
                        if orgID:
                            orgIDs.append(orgID)
                    if len(orgIDs) > 0:
                        criteria["metadata.orgID"] = {"$in": orgIDs}
            if 'currentStatus' in req_criteria.keys():
                if req_criteria["currentStatus"]:
                    currentStatus = []
                    for currentStat in req_criteria["currentStatus"]:
                        if currentStat:
                            currentStatus.append(currentStat)
                    if len(currentStatus) > 0:
                        criteria["granularity.currentStatus"] = {"$in": currentStatus}
            if 'filterByStartTime' in req_criteria.keys():
                if 'startTimeStamp' in req_criteria['filterByStartTime'].keys() and 'endTimeStamp' in req_criteria['filterByStartTime'].keys():
                            criteria["startTime"] = { "$gte": req_criteria['filterByStartTime']['startTimeStamp'], "$lte": req_criteria['filterByStartTime']['endTimeStamp']}
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
            if not skip_pagination:
                offset = 0 if 'offset' not in req_criteria.keys() else req_criteria["offset"]
                limit = eval(str(page_default_limit)) if 'limit' not in req_criteria.keys() else req_criteria["limit"]
                criteria["active"] = {"$ne": False}
                jobs = wfmrepo.search_job(criteria, exclude, offset, limit)
                total_jobs = wfmrepo.search_job(criteria, exclude, None, None)
                return {"count": len(total_jobs), "jobs": jobs}
            else:
                return wfmrepo.search_job(criteria, exclude, None, None)
        except Exception as e:
            log_exception("Exception while searching jobs: " + str(e), None, e)
            return None

    def set_granularity(self,data):
        try: 
            job_details = wfmutils.get_job_details(data["jobID"])
            job_details = job_details[0]
            for each_granularity in data['granularity']:
                if 'granularity' not in job_details.keys():
                    job_details['granularity'] = {}
                if each_granularity not in job_details['granularity'].keys():
                    job_details['granularity'][each_granularity] = eval(str(time.time()).replace('.', '')[0:13])
                    #Manual Editing Start Time
                    if each_granularity == 'manualEditingStartTime':
                        job_details['granularity']['manualEditingStatus'] = "IN PROGRESS"
                        job_details['granularity']['currentStatus'] = "manual_editing_in_progress"
                    #Manual Editing End Time
                    elif each_granularity == 'manualEditingEndTime':
                        if 'manualEditingStartTime' not in job_details['granularity'].keys():
                            return {"status": "FAILED","message":"Setting editing end time failed"}
                        job_details['granularity']['manualEditingStatus'] = "COMPLETED"     
                        if job_details['granularity']['currentStatus'] == "manual_reediting_in_progress":
                                job_details['granularity']['currentStatus'] = "manual_reediting_completed"
                        job_details['granularity']['currentStatus'] = "manual_editing_completed"
                        #Calculate manual editing time  
                        if "manualEditingDuration" not in job_details['granularity']:
                            dt1 = datetime.datetime.fromtimestamp(job_details['granularity']['manualEditingStartTime']/1000) # 1973-11-29 22:33:09
                            dt2 = datetime.datetime.fromtimestamp(job_details['granularity']['manualEditingEndTime']/1000) # 1977-06-07 23:44:50
                            difference = dt2-dt1
                            job_details['granularity']['manualEditingDuration'] = difference.seconds
                        else:
                            dt1 = datetime.datetime.fromtimestamp(job_details['granularity']['manualEditingStartTime']/1000) # 1973-11-29 22:33:09
                            dt2 = datetime.datetime.fromtimestamp(job_details['granularity']['manualEditingEndTime']/1000) # 1977-06-07 23:44:50
                            difference = dt2-dt1
                            job_details['granularity']['manualEditingDuration'] = job_details['granularity']['manualEditingDuration']+difference.seconds
                    #Reviewer In Progress
                    elif each_granularity == "reviewerInProgress":
                        if job_details['granularity']['manualEditingStatus'] == "COMPLETED":
                            job_details['granularity']['reviewerInProgress'] = True
                            job_details['granularity']['reviewerStatus'] = "In Progress"
                            job_details['granularity']['currentStatus'] = "reviewer_in_progress"
                        else:
                            return {'status': 'FAILED','message':'Cannot start reviewing if manual editing is not completed'}
                    #Reviewer Completed
                    elif each_granularity == "reviewerCompleted":
                        if 'reviewerInProgress' in job_details['granularity'] and job_details['granularity']['reviewerInProgress'] == True:
                            job_details['granularity']['reviewerInProgress'] = False
                            job_details['granularity']['reviewerCompleted'] = True
                            job_details['granularity']['reviewerStatus'] = "Completed"
                            job_details['granularity']['currentStatus'] = "reviewer_completed"
                            #job_details['granularity']['parallelDocumentUploadStatus'] = "COMPLETED"     
                        else:
                            return {'status': 'FAILED','message':'Cannot end reviewer status now since it is not started'}                        
                    #Parallel Document Upload          
                    elif each_granularity == "parallelDocumentUpload":
                        job_details['granularity']['parallelDocumentUploadStatus'] = "COMPLETED"     
                        job_details['granularity']['currentStatus'] = "parallel_document_uploaded"
                        if 'manualEditingStartTime' in job_details['granularity'].keys():
                            if 'manualEditingEndTime' not in job_details['granularity'].keys():
                                job_details['granularity']['manualEditingStatus'] = "COMPLETED"                    
                                job_details['granularity']['manualEditingEndTime'] = eval(str(time.time()).replace('.', '')[0:13]) 
                    self.update_job_details(job_details, False)
                elif each_granularity == 'manualEditingStartTime' and 'reviewerInProgress' in job_details['granularity'].keys() and job_details['granularity']['reviewerInProgress'] == True:
                    job_details['granularity']['reviewerInProgress'] = False
                    del job_details['granularity']['reviewerStatus']
                    job_details['granularity'][each_granularity] = eval(str(time.time()).replace('.', '')[0:13])
                    job_details['granularity']['manualEditingStatus'] = "IN PROGRESS"
                    job_details['granularity']['currentStatus'] = "manual_reediting_in_progress"
                    del job_details['granularity']['manualEditingEndTime']
                    self.update_job_details(job_details, False)
                elif each_granularity == "reviewerInProgress":
                    if job_details['granularity']['manualEditingStatus'] == "COMPLETED":
                        job_details['granularity']['reviewerInProgress'] = True
                        job_details['granularity']['reviewerStatus'] = "In Progress"
                        job_details['granularity']['currentStatus'] = "reviewer_in_progress"
                        self.update_job_details(job_details, False)
                    else:
                        return {'status': 'FAILED','message':'Cannot start reviewing if manual editing is not completed'}

                else:
                    return {"status": "SUCCESS","message":"Granularity already exists"}
            return {"status": "SUCCESS","message":"Granularity set successfully"}
        except Exception as e:
            log_exception("Exception while setting granularity: " + str(e), None, None)
            return {"status": "FAILED", "message": "Exception while setting granularity", "succeeded": [], "failed": data["jobID"]}

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
            if job_details["status"] == "FAILED" or job_details["status"] == "COMPLETED" or job_details["status"] == "INTERRUPTED":
                return None
            job_details["status"] = "FAILED"
            job_details["endTime"] = eval(str(time.time()).replace('.', '')[0:13])
            job_details["error"] = error
            self.update_job_details(job_details, False)
            log_info("Job FAILED: " + error["jobID"], error)
        except Exception as e:
            log_exception("Failed to update tool error: " + str(e), error, e)

    def update_active_doc_count(self,wf_async_input,is_job_completed):
        try:
            if is_job_completed == False:
                task = None
                translation_workflows = ['WF_A_FCBMTKTR','WF_A_FTTKTR','WF_A_FTIOTKTR']
                digitization_workflows = ['WF_A_OD10GV','WF_A_OD15GV','WF_A_OD20TES','WF_A_FCOD10GV','WF_A_OD10GVOTK','WF_A_FCOD10GVOTK','WF_A_WDOD15GV','WF_A_WDOD15GVOTK','WF_A_FCWDLDBSOTES','WF_A_FCWDLDBSOD15GV','WF_A_FCWDLDOD15GVOTK','WF_A_FCWDLDBSOD15GVOTK','WF_A_FCWDLDBSOD15GVOTK_S','WF_A_FCWDLDBSOD20TESOTK']
                if wf_async_input['workflowCode'] in translation_workflows:
                    task = "translation"
                elif wf_async_input['workflowCode'] in digitization_workflows:
                    task = "digitization"
                if task is not None:
                    input_data = {}
                    input_data['jobID'] = wf_async_input["jobID"]
                    input_data['workflowCode'] = wf_async_input['workflowCode']
                    input_data["task"] = task
                    input_data['userID'] = wf_async_input["metadata"]['userID']
                    input_data['startTime'] = wf_async_input["metadata"]['receivedAt']
                    redisRepo.upsert(wf_async_input["jobID"],input_data)
                log_info(f"Active Job Status updated to started: {wf_async_input['jobID']}", wf_async_input)
            else:
                redisRepo.delete([wf_async_input["jobID"]])
                log_info(f"Active Job Status updated to completed: {wf_async_input['jobID']}", wf_async_input)
        except Exception as e:
            log_exception("Active Job Status updated failed: {wf_async_input['jobID']} " + str(e), None, e)

    def get_active_doc_count(self):
        try:
            response = redisRepo.get_active_count()
            return response
        except Exception as e:
            log_exception("Active Job Status Retrieval: {wf_async_input['jobID']} " + str(e), None, e)