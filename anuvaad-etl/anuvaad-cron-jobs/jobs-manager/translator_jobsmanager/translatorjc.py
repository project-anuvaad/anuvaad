import random
import string
import time
from threading import Thread
from anuvaad_auditor.loghandler import log_exception, log_info
from .utils import TranslatorCronUtils
from .configs import module_name
from .configs import jc_job_delete_interval_sec
from .configs import jc_cron_interval_sec


class TranslatorJobsCleaner(Thread):
    def __init__(self, event):
        Thread.__init__(self)
        self.stopped = event

    # Cron JOB to fetch status of each record and push it to CH and WFM on completion/failure.
    def run(self):
        obj = {"metadata": {"module": module_name}}
        rand_str = ''.join(random.choice(string.ascii_letters) for i in range(4))
        prefix = "TranslatorJobsCleaner(" + rand_str + ")"
        log_info(prefix + " -- AJM Deployed, TranslatorJobsCleaner running......", obj)
        translator_utils = TranslatorCronUtils()
        run = 0
        while not self.stopped.wait(eval(str(jc_cron_interval_sec))):
            try:
                records = translator_utils.find_all(False)
                print(records,"records")
                log_info(f"records {records}" , obj)
                deleted = 0
                for record in records:
                    try:
                        job_start_time = record["transInput"]["taskStartTime"]
                        print(job_start_time,"job_time_start")
                        diff = eval(str(time.time()).replace('.', '')[0:13]) - job_start_time
                        print(diff,"diff")
                        log_info(f"Job time start {job_start_time}" , obj)
                        log_info(f"diff {diff}" , obj)
                        if (diff / 1000) > eval(str(jc_job_delete_interval_sec)):
                            log_info("Inside if" , obj)
                            translator_utils.delete(record["jobID"])
                            translator_utils.delete_batches(record["jobID"])
                            translator_utils.delete_pages(record["recordID"])
                            deleted += 1
                    except Exception as e:
                        log_exception(prefix + " -- Exception in JobsCleaner for record: " + record["recordID"], record["transInput"], e)
                        log_exception(prefix + " -- Exception - " + str(e), record["transInput"], e)
                        continue
                log_info(prefix + " -- Run: " + str(run) + " | Deleted: " + str(deleted), obj)
                run += 1
            except Exception as e:
                log_exception(prefix + " -- Run: " + str(run) + " | Exception: " + str(e), obj, e)
                run += 1

