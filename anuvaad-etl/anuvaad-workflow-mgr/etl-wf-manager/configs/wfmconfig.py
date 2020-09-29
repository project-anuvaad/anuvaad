import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_SERVER_HOST', 'mongodb://localhost:27017/')
file_upload_url = os.environ.get('FILE_UPLOAD_URL', 'https://auth.anuvaad.org/upload')



#MODULE-SPECIFIC-CONFIGS
#common-variables
tool_tokeniser = "TOKENISER"
tool_aligner = "ALIGNER"
tool_pdftohtml = "PDF-TO-HTML"
tool_htmltojson = "HTML-TO-JSON"
tool_fileconverter = "FILE-CONVERTER"
tool_blockmerger = "BLOCK-MERGER"
tool_translator = "TRANSLATOR"
tool_ch = "CONTENT-HANDLER"
tool_nmt = "NMT"
module_wfm_name = "WORKFLOW-MANAGER"
is_sync_flow_enabled = True
is_async_flow_enabled = True
js_cron_interval_sec = 3600 # 1 hr
js_job_failure_interval_sec = 43200 # 12 hrs


#kafka-configs
anu_etl_wfm_core_topic = 'anu-etl-wf-initiate-v3'
anu_etl_wfm_consumer_grp = os.environ.get('ANUVAAD_ETL_WF_CONSUMER_GRP', 'anuvaad-etl-wfm-consumer-group')
anu_etl_wf_error_topic = os.environ.get('ANUVAAD_ETL_WF_ERROR_TOPIC', 'anuvaad-etl-wf-errors')
wfm_cons_no_of_instances = 1
wfm_cons_no_of_partitions = 1
wfm_core_cons_no_of_instances = 1
wfm_core_cons_no_of_partitions = 1
wfm_error_cons_no_of_instances = 1
wfm_error_cons_no_of_partitions = 1


#datastore-configs
mongo_wfm_db = os.environ.get('MONGO_ALIGNMENT_DB', 'anuvaad-etl-dataflow-pipeline')
mongo_wfm_jobs_col = os.environ.get('MONGO_WFMJOBS_COL', 'anuvaad-etl-wfm-jobs')

#module-configs
context_path = os.environ.get('ANU_ETL_WFM_CONTEXT_PATH', '/anuvaad-etl/wf-manager')
config_file_url = os.environ.get('ETL_WFM_CONFIG_FILE_URL',
            'https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmanager_feature/anuvaad-etl/anuvaad-workflow-mgr/config/example.yml')

#module-wise-topics
tokeniser = 'anuvaad-dp-tools-tokeniser-input', 'anuvaad-dp-tools-tokeniser-output'
aligner = 'anuvaad-dp-tools-aligner-input-v2', 'anuvaad-dp-tools-aligner-output-v2'
file_converter = 'anuvaad-dp-tools-fc-input', 'anuvaad-dp-tools-fc-output'
pdftohtml = 'anuvaad-dp-tools-pdf-html-input', 'anuvaad-dp-tools-pdf-html-output'
htmltojson = 'anuvaad-dp-tools-html-json-input', 'anuvaad-dp-tools-html-json-output'

#general-log-messages
log_msg_start = " process started."
log_msg_end = " process ended."
log_msg_error = " has encountered an exception, job ended."


