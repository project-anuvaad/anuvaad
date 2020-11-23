import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')
app_host = os.environ.get('ANUVAAD_ETL_WFM_HOST', 'localhost')
app_port = os.environ.get('ANUVAD_ETL_WFM_PORT', 5001)


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
tool_worddetector = "WORD-DETECTOR"
tool_layoutdetector = "LAYOUT-DETECTOR"
module_wfm_name = "WORKFLOW-MANAGER"
is_sync_flow_enabled = True
is_async_flow_enabled = True
page_default_limit = os.environ.get('WFM_PAGE_DEFAULT_LIMIT', 20)
jobid_random_str_length = os.environ.get('WFM_JOBID_RANDOM_STR_LEN', 5)


#kafka-configs
anu_etl_wfm_core_topic = os.environ.get('KAFKA_ANUVAAD_ETL_WFM_CORE_TOPIC', 'anuvaad-etl-wf-initiate-v3')
anu_etl_wfm_consumer_grp = os.environ.get('KAFKA_ANUVAAD_ETL_WF_CONSUMER_GRP', 'anuvaad-etl-wfm-consumer-group')
anu_etl_wf_error_topic = os.environ.get('KAFKA_ANUVAAD_ETL_WF_ERROR_TOPIC', 'anuvaad-etl-wf-errors-v1')
wfm_cons_no_of_instances = 1
wfm_cons_no_of_partitions = 1
wfm_core_cons_no_of_instances = 1
wfm_core_cons_no_of_partitions = 1
wfm_error_cons_no_of_instances = 1
wfm_error_cons_no_of_partitions = 1


#datastore-configs
mongo_wfm_db = os.environ.get('MONGO_WFM_DB', 'anuvaad-etl-wfm-db')
mongo_wfm_jobs_col = os.environ.get('MONGO_WFMJOBS_COL', 'anuvaad-etl-wfm-jobs-collection')

#module-configs
context_path = os.environ.get('ANUVAAD_ETL_WFM_CONTEXT_PATH', '/anuvaad-etl/wf-manager')
config_file_url = os.environ.get('ANUVAAD_ETL_WFM_CONFIG_FILE_URL',
            'https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmanager_feature/anuvaad-etl/anuvaad-workflow-mgr/config/etl-wf-manager-config-dev.yml')

#general-log-messages
log_msg_start = " process started."
log_msg_end = " process ended."
log_msg_error = " has encountered an exception, job ended."


