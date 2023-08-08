import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')
#mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017/?readPreference=primary&ssl=false')
redis_server_prefix = os.environ.get('REDIS_PREFIX', 'redis')
redis_server_host = os.environ.get('REDIS_URL', 'localhost')
redis_server_port = os.environ.get('REDIS_PORT', 6379)
active_docs_redis_db = os.environ.get('ACTIVE_DOCS_REDIS_DB', 11)
app_host = os.environ.get('ANUVAAD_ETL_WFM_HOST', '0.0.0.0')
app_port = os.environ.get('ANUVAD_ETL_WFM_PORT', 5001)

#Active Document (Time to Live in Seconds)
active_doc_time = int(os.environ.get('WFM_ACTIVE_DOCS_TTL',18000))

#MODULE-SPECIFIC-CONFIGS
#common-variables
tool_tokeniser = "TOKENISER"
tool_aligner = "ALIGNER"
tool_pdftohtml = "PDF-TO-HTML"
tool_htmltojson = "HTML-TO-JSON"
tool_fileconverter = "FILE-CONVERTER"
tool_blockmerger = "BLOCK-MERGER"
tool_translator = "TRANSLATOR"
tool_sync_block_translator = "SYNC-BLOCK-TRANSLATOR"
tool_sync_sentence_translator = "SYNC-SENTENCE-TRANSLATOR"
tool_sync_block_tokenizer = "SYNC-BLOCK-TOKENISER"
tool_sync_paragraph_tokeniser = "SYNC-PARAGRAPH-TOKENIZER"
tool_ch = "CONTENT-HANDLER"
tool_nmt = "NMT"
tool_worddetector = "WORD-DETECTOR"
tool_layoutdetector = "LAYOUT-DETECTOR"
tool_ocrgooglevision = "OCR-GOOGLE-VISION"
tool_ocrdd10googlevision = "OCR-DD10-GOOGLE-VISION"
tool_ocrdd15googlevision = "OCR-DD15-GOOGLE-VISION"
tool_ocrdd20tesseract = "OCR-DD20-TESSERACT"
tool_ocrtokeniser = "OCR-TOKENISER"
tool_ocrtesseract = "OCR-TESSERACT"
tool_blocksegmenter = "BLOCK-SEGMENTER"
tool_annotator = "ANNOTATOR"
module_wfm_name = "WORKFLOW-MANAGER"
tool_filetranslator = "FILE-TRANSLATOR"
tool_filetranslator_download = "FILE-TRANSLATOR-DOWNLOAD"
tool_syncfiletranslator = "SYNC-FILE-TRANSLATOR"
tool_imageocr = "IMAGE-OCR"
tool_doc_pre_processor = "SYNC-DOCUMENT-PREPROCESS"
is_sync_flow_enabled = True
is_async_flow_enabled = True
page_default_limit = os.environ.get('WFM_PAGE_DEFAULT_LIMIT', 20)
jobid_random_str_length = os.environ.get('WFM_JOBID_RANDOM_STR_LEN', 5)
app_context = {"metadata" : {"module" : "WORKFLOW-MANAGER"}}

#kafka-configs
anu_etl_wfm_core_topic = os.environ.get('KAFKA_ANUVAAD_ETL_WFM_CORE_TOPIC', 'anuvaad-etl-wf-initiate-v3')
anu_etl_wfm_consumer_grp = os.environ.get('KAFKA_ANUVAAD_ETL_WF_CONSUMER_GRP', 'anuvaad-etl-wfm-consumer-group')
anu_etl_wf_error_topic = os.environ.get('KAFKA_ANUVAAD_ETL_WF_ERROR_TOPIC', 'anuvaad-etl-wf-errors-v1')
anu_etl_notifier_input_topic = os.environ.get('KAFKA_ANUVAAD_NOTIFIER_INPUT_TOPIC', 'anuvaad-notifier-input-v1')
total_no_of_partitions = 6 # default value   ####changes made to 1 from 6


#datastore-configs
mongo_wfm_db = os.environ.get('MONGO_WFM_DB', 'anuvaad-etl-wfm-db')
mongo_wfm_jobs_col = os.environ.get('MONGO_WFMJOBS_COL', 'anuvaad-etl-wfm-jobs-collection')

#module-configs
context_path = os.environ.get('ANUVAAD_ETL_WFM_CONTEXT_PATH', '/anuvaad-etl/wf-manager')
#config_file_url = os.environ.get('ANUVAAD_ETL_WFM_CONFIG_FILE_URL',
#            'https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmrefactoring/anuvaad-etl/anuvaad-workflow-mgr/config/etl-wf-manager-workflow-config-dev.yml')
config_file_url = os.environ.get('ANUVAAD_ETL_WORKFLOW_CONFIG_FILE_URL',
            'https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmrefactoring/anuvaad-etl/anuvaad-workflow-mgr/config/etl-wf-manager-workflow-config-dev.yml')
tool_config_url = os.environ.get('ANUVAAD_ETL_TOOL_CONFIG_FILE_URL',
            'https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmrefactoring/anuvaad-etl/anuvaad-workflow-mgr/config/etl-wf-manager-tool-config-dev.yml')
#general-log-messages
log_msg_start = " process started."
log_msg_end = " process ended."
log_msg_error = " has encountered an exception, job ended."

#Specific variables
granularity_list = ["manualEditingStartTime","manualEditingEndTime","parallelDocumentUpload","reviewerInProgress","reviewerCompleted"]
workflowCodesTranslation = ["DP_WFLOW_FBT","WF_A_FCBMTKTR","DP_WFLOW_FBTTR","WF_A_FTTKTR"]
