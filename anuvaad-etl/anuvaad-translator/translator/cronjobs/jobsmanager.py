import random
import string
import time
from threading import Thread
from anuvaad_auditor.loghandler import log_exception, log_info, log_error
from repository.translatorrepository import TranslatorRepository
from kafkawrapper.translatorproducer import Producer
from utilities.translatorutils import TranslatorUtils
from configs.translatorconfig import anu_translator_output_topic
from configs.translatorconfig import save_content_url
from configs.translatorconfig import tool_translator
from configs.translatorconfig import jm_cron_interval_sec
from anuvaad_auditor.errorhandler import post_error


class JobsManger(Thread):
    def __init__(self, event):
        Thread.__init__(self)
        self.stopped = event

    # Cron JOB to fetch status of each record and push it to CH and WFM on completion/failure.
    def run(self):
        obj = {"metadata": {"module": tool_translator}}
        rand_str = ''.join(random.choice(string.ascii_letters) for i in range(4))
        prefix = "JobsManager(" + rand_str + ")"
        log_info(prefix + " -- Translator Deployed, JobsManager running......", obj)
        repo = TranslatorRepository()
        run = 0
        while not self.stopped.wait(jm_cron_interval_sec):
            completed, failed, inprogress = [], [], []
            completed_jobids, failed_jobids = [], []
            try:
                records = repo.find_all()
                for record in records:
                    is_added = False
                    try:
                        total, translated, skipped = record["totalSentences"], record["translatedSentences"], record["skippedSentences"]
                        if total == 0:
                            failed.append(record)
                            failed_jobids.append(record["jobID"])
                            is_added = True
                        elif total == skipped:
                            failed.append(record)
                            failed_jobids.append(record["jobID"])
                            is_added = True
                        elif total == translated or total == (translated + skipped):
                            completed.append(record)
                            completed_jobids.append(record["jobID"])
                            is_added = True
                        if not is_added:
                            inprogress.append(record)
                    except Exception as e:
                        log_exception(prefix + " -- Exception in JobsManger for record: " + record["recordID"], record["transInput"], e)
                        log_exception(prefix + " -- Exception - " + str(e), record["transInput"], e)
                        continue
                log_info(prefix + " -- Run: " + str(run)
                         + " | Completed: " + str(len(completed)) + " | Failed: " + str(len(failed)) + " | InProgress: " + str(len(inprogress)), obj)
                if len(completed) > 0:
                    log_info(prefix + " --  Run: " + str(run) + " | Completed Jobs: " + str(completed_jobids), obj)
                if len(failed) > 0:
                    log_info(prefix + " -- Run: " + str(run) + " | Failed Jobs: " + str(failed_jobids), obj)
                if len(inprogress) > 0:
                    log_info(prefix + " -- Run: " + str(run) + " | InProgress Report --------------------------- ", obj)
                    for record in inprogress:
                        log_info(prefix + " -- " + str(record["jobID"]) + " | " + str(record["totalSentences"]) +
                                 " | " + str(record["translatedSentences"]) + " | " + str(record["skippedSentences"]), obj)
                self.data_sink(completed, failed, obj)
                run += 1
            except Exception as e:
                log_exception(prefix + " -- Run: " + str(run) + " | Exception: " + str(e), obj, e)
                run += 1

    # Method to push data to CH and WFM.
    def data_sink(self, completed, failed, obj):
        utils = TranslatorUtils()
        producer = Producer()
        repo = TranslatorRepository()
        try:
            job_wise_records = {}
            for fail in failed:
                output = {"inputFile": str(fail["recordID"]).split("|")[1], "outputFile": "FAILED", "error": "Error while translating"}
                job_wise_records = self.manage_records(job_wise_records, fail, output)
            for complete in completed:
                ch_input = {
                    "file_locale": complete["transInput"]["input"]["files"][0]["model"]["source_language_code"],
                    "src_lang": complete["transInput"]["input"]["files"][0]["model"]["source_language_code"],
                    "tgt_lang": complete["transInput"]["input"]["files"][0]["model"]["target_language_code"],
                    "record_id": complete["recordID"], "pages": complete["data"]["result"]
                }
                user_id = complete["transInput"]["metadata"]["userID"]
                res = utils.call_api(save_content_url, "POST", ch_input, None, user_id)
                if res:
                    if res["http"]["status"] != 200:
                        log_error("Content push to CH Failed | Cause: " + res["http"]["why"] + " | record: " + complete["recordID"], complete["transInput"], None)
                        output = {"inputFile": str(complete["recordID"]).split("|")[1], "outputFile": "FAILED","error": res["http"]["why"]}
                    else:
                        output = {"inputFile": str(complete["recordID"]).split("|")[1], "outputFile": str(complete["recordID"])}
                else:
                    log_error("Content push to CH Failed, record: " + complete["recordID"], complete["transInput"], None)
                    output = {"inputFile": str(complete["recordID"]).split("|")[1], "outputFile": "FAILED", "error": "Content push to CH Failed"}
                job_wise_records = self.manage_records(job_wise_records, complete, output)
            for job_id in job_wise_records.keys():
                status = "FAILED"
                for output in job_wise_records[job_id]["output"]:
                    if output["outputFile"] != "FAILED":
                        status = "SUCCESS"
                        break
                job = job_wise_records[job_id]
                job["status"] = status
                if status == "FAILED":
                    job["error"] = post_error("TRANSLATION_FAILED", "All files failed", None)
                job_wise_records[job_id] = job
                producer.produce(job_wise_records[job_id], anu_translator_output_topic)
                repo.delete(job_id)
        except Exception as e:
            log_exception("Exception while pushing Translator data to sink: " + str(e), obj, e)
            return None

    # Manages the records by formating them for CH and WFM.
    def manage_records(self, job_wise_records, record, output):
        if record["jobID"] in job_wise_records.keys():
            result = job_wise_records[record["jobID"]]
            job_output = result["output"]
            job_output.append(output)
            result["output"] = job_output
            job_wise_records[record["jobID"]] = result
        else:
            result = record["transInput"]
            result["input"] = None
            result["state"] = "TRANSLATED"
            result["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
            job_output = [output]
            result["output"] = job_output
            job_wise_records[record["jobID"]] = result

        return job_wise_records
