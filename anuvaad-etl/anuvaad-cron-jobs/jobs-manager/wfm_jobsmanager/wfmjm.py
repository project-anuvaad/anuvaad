import random
import string
import time
from threading import Thread
from .configs import module_name
from .configs import js_cron_interval_sec
from .configs import js_job_failure_interval_sec
from .utils import WFMJMCronUtils
from anuvaad_auditor.loghandler import log_exception, log_info
from anuvaad_auditor.errorhandler import post_error


class WFMJobsManager(Thread):
    def __init__(self, event):
        Thread.__init__(self)
        self.stopped = event

    # Cron JOB to fetch status of each record and push it to CH and WFM on completion/failure.
    def run(self):
        obj = {"metadata": {"module": module_name}}
        rand_str = ''.join(random.choice(string.ascii_letters) for i in range(4))
        prefix = "WFMJobsManager(" + rand_str + ")"
        log_info(prefix + " -- AJM Deployed, WFMJobsManager running......", obj)
        wfm_utils = WFMJMCronUtils()
        run = 0
        while not self.stopped.wait(eval(str(js_cron_interval_sec))):
            try:
                criteria, exclude = {"status": {"$in": ["STARTED", "INPROGRESS"]}}, {'_id': False}
                jobs = wfm_utils.search_job(criteria, exclude, None, None)
                no_of_jobs = 0
                if jobs:
                    log_info(prefix + " -- Run: " + str(run) + " | Jobs Fetched: " + str(len(jobs)), obj)
                    for job in jobs:
                        job_start_time = job["startTime"]
                        diff = eval(str(time.time()).replace('.', '')[0:13]) - job_start_time
                        if (diff / 1000) > eval(str(js_job_failure_interval_sec)):
                            job["status"] = "FAILED"
                            job["error"] = post_error("ORPHAN_JOB",
                                                      "The job was failed by the system, since it was idle", None)
                            job["endTime"] = eval(str(time.time()).replace('.', '')[0:13])
                            wfm_utils.update_job(job, job["jobID"])
                            log_info(prefix + " -- JOB FAILED: Idle job, force failed. jobID: " + job["jobID"], job)
                            no_of_jobs += 1
                run += 1
                log_info(prefix + " -- Run: " + str(run) + " | Jobs Fetched: " + str(len(jobs)) + " | Jobs Processed: " + str(no_of_jobs), obj)
            except Exception as e:
                run += 1
                log_exception(prefix + " -- Run: " + str(run) + " | Exception in JobSweeper: " + str(e), obj, e)
