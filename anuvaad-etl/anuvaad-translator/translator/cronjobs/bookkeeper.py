import time
from threading import Thread
from anuvaad_auditor.loghandler import log_exception, log_info
from repository.translatorrepository import TranslatorRepository
from kafkawrapper.translatorproducer import Producer
from utilities.translatorutils import TranslatorUtils
from configs.translatorconfig import anu_translator_output_topic
from configs.translatorconfig import save_content_url


class BookKeeper(Thread):
    def __init__(self, event):
        Thread.__init__(self)
        self.stopped = event

    # Cron JOB to fetch status of each record and push it to CH and WFM on completion/failure.
    def run(self):
        log_info("BookKeeper running......")
        repo = TranslatorRepository()
        while not self.stopped.wait(30):
            completed = []
            failed = []
            try:
                records = repo.find_all()
                for record in records:
                    try:
                        total = record["totalSentences"]
                        translated = record["translatedSentences"]
                        skipped = record["skippedSentences"]
                        if total == translated or total == (translated + skipped):
                            completed.append(record)
                        elif total == skipped:
                            failed.append(record)
                    except Exception as e:
                        log_exception("Exception while book-keeping for record: " + record["recordID"], record["transInput"], e)
                        continue
                self.push_to_ch(completed)
                self.push_to_wfm(completed, failed)
            except Exception as e:
                log_exception("Exception in bookKeeper: " + str(e), None, e)

    # Method to push completed records to CH
    def push_to_ch(self, completed, failed):
        utils = TranslatorUtils()
        for complete in completed:
            ch_input = {
                "userid": complete["transInput"]["metadata"]["userID"],
                "uniqueID": complete["recordID"],
                "request": complete["data"]
            }
            utils.call_api(save_content_url, "POST", ch_input, None)
            return None

    # Method to push completed and failed records to WFM for job status update
    def push_to_wfm(self, completed, failed):
        producer = Producer
        repo = TranslatorRepository()
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
                job_output = [output]
                result["output"] = job_output
                job_wise_records[fail["jobID"]] = result

        for job_id in job_wise_records.keys():
            producer.produce(job_wise_records[job_id], anu_translator_output_topic)
            repo.delete(job_id)

        return None
