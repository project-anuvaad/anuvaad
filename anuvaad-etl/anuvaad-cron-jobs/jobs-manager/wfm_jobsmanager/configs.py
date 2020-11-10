import os

mongo_wfm_db = os.environ.get('MONGO_WFM_DB', 'anuvaad-etl-wfm-db')
mongo_wfm_jobs_col = os.environ.get('MONGO_WFMJOBS_COL', 'anuvaad-etl-wfm-jobs-collection')
mongo_server_host = os.environ.get('MONGO_SERVER_HOST', 'mongodb://localhost:27017/')

module_name = "JOBS-MANAGER"
js_cron_interval_sec = os.environ.get('WFM_JS_CRON_INTERVAL_SEC', 3600) # 1/2 hr
js_job_failure_interval_sec = os.environ.get('WFM_JS_CRON_FAILURE_INTERVAL_SEC', 86400) # 2 hrs