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
        while not self.stopped.wait(20):
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
        for complete in completed:
            wf_output = complete["transInput"]
            wf_output["state"] = "TRANSLATED"
            wf_output["status"] = "SUCCESS"
            wf_output["output"] = {
                "inputFile": str(complete["recordID"]).split("|")[1],
                "result": str(complete["recordID"])
            }
            wf_output["taskEndTime"] = eval(str(time.time()).replace('.', ''))
            producer.produce(wf_output, anu_translator_output_topic)
            repo.delete(complete["recordID"])

        for fail in failed:
            wf_output = fail["transInput"]
            wf_output["state"] = "TRANSLATED"
            wf_output["status"] = "FAILED"
            wf_output["taskEndTime"] = eval(str(time.time()).replace('.', ''))
            producer.produce(wf_output, anu_translator_output_topic)
            repo.delete(fail["recordID"])

        return None
