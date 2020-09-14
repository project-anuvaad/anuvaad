import time
from threading import Thread
from anuvaad_auditor.loghandler import log_exception, log_info
from repository.translatorrepository import TranslatorRepository
from kafkawrapper.translatorproducer import Producer
from utilities.translatorutils import TranslatorUtils
from configs.translatorconfig import anu_translator_output_topic
from configs.translatorconfig import save_content_url
from configs.translatorconfig import anu_etl_module_name
from anuvaad_auditor.errorhandler import post_error_wf


class JobsManger(Thread):
    def __init__(self, event):
        Thread.__init__(self)
        self.stopped = event

    # Cron JOB to fetch status of each record and push it to CH and WFM on completion/failure.
    def run(self):
        log_info("JobsManger running......", None)
        repo = TranslatorRepository()
        run = 0
        obj = {"metadata": {"module": anu_etl_module_name}}
        while not self.stopped.wait(30):
            completed = []
            failed = []
            inprogress = []
            try:
                records = repo.find_all()
                for record in records:
                    '''
                    log_info("JobsManager - recordID: " + record["recordID"] + "| total: " + str(record["totalSentences"])
                             + " | translated: " + str(record["translatedSentences"])
                             + " | skipped: " + str(record["skippedSentences"]), record["transInput"])
                    '''
                    is_added = False
                    try:
                        total = record["totalSentences"]
                        if total == 0:
                            failed.append(record)
                            continue
                        translated = record["translatedSentences"]
                        skipped = record["skippedSentences"]
                        if total == translated or total == (translated + skipped):
                            completed.append(record)
                            is_added = True
                        elif total == skipped:
                            failed.append(record)
                            is_added = True
                        if not is_added:
                            inprogress.append(record)
                    except Exception as e:
                        log_exception("Exception in JobsManger for record: " + record["recordID"], record["transInput"], e)
                        continue
                pushed = self.push_to_ch(completed, obj)
                if pushed:
                    self.push_to_wfm(completed, failed, obj)
                log_info("JobsManger - Run: " + str(run)
                         + " | Completed: " + str(len(completed)) + " | Failed: " + str(len(failed)) + " | InProgress: " + str(len(inprogress)), obj)
                run += 1
            except Exception as e:
                log_exception("JobsManger - Run: " + str(run) + " | Exception: " + str(e), obj, e)

    # Method to push completed records to CH
    def push_to_ch(self, completed, obj):
        try:
            utils = TranslatorUtils()
            for complete in completed:
                ch_input = {
                    "file_locale": complete["transInput"]["metadata"]["userID"],
                    "record_id": complete["recordID"],
                    "pages": complete["data"]["result"]
                }
                utils.call_api(save_content_url, "POST", ch_input, None)
                return True
        except Exception as e:
            log_exception("Exception while pushing to CH: " + str(e), obj)
            return False

    # Method to push completed and failed records to WFM for job status update
    def push_to_wfm(self, completed, failed, obj):
        producer = Producer()
        repo = TranslatorRepository()
        try:
            job_wise_records = {}
            for complete in completed:
                output = {
                    "inputFile": str(complete["recordID"]).split("|")[1], "outputFile": str(complete["recordID"])
                }
                if complete["jobID"] in job_wise_records.keys():
                    result = job_wise_records[complete["jobID"]]
                    job_output = result["output"]
                    job_output.append(output)
                    result["output"] = job_output
                    job_wise_records[complete["jobID"]] = result
                else:
                    result = complete["transInput"]
                    result["state"] = "TRANSLATED"
                    result["status"] = "SUCCESS"
                    result["taskEndTime"] = eval(str(time.time()).replace('.', ''))
                    job_output = [output]
                    result["output"] = job_output
                    job_wise_records[complete["jobID"]] = result

            for fail in failed:
                output = {
                    "inputFile": str(fail["recordID"]).split("|")[1], "outputFile": "FAILED"
                }
                if fail["jobID"] in job_wise_records.keys():
                    result = job_wise_records[fail["jobID"]]
                    job_output = result["output"]
                    job_output.append(output)
                    result["output"] = job_output
                    job_wise_records[fail["jobID"]] = result
                else:
                    result = fail["transInput"]
                    result["state"] = "TRANSLATED"
                    result["status"] = "FAILED"
                    result["taskEndTime"] = eval(str(time.time()).replace('.', ''))
                    result["error"] = post_error_wf("NMT_TRANSLATION_FAILED", "There was an error at NMT while translating!", fail["transInput"], None)
                    job_output = [output]
                    result["output"] = job_output
                    job_wise_records[fail["jobID"]] = result

            for job_id in job_wise_records.keys():
                producer.produce(job_wise_records[job_id], anu_translator_output_topic)
                repo.delete(job_id)
            return True
        except Exception as e:
            log_exception("Exception while pushing to WFM: " + str(e), obj)
            return False
