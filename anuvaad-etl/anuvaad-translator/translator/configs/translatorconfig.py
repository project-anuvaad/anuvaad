import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_SERVER_HOST', 'mongodb://localhost:27017/')
file_download_url = os.environ.get('FILE_DOWNLOAD_URL', 'https://auth.anuvaad.org/anuvaad/v1/download')
save_content_url = os.environ.get('SAVE_CONTENT_URL', 'https://auth.anuvaad.org/api/v0/save-content')
fetch_content_url = os.environ.get('FETCH_CONTENT_URL', 'https://auth.anuvaad.org/api/v0/fetch-content')



#MODULE-SPECIFIC-CONFIGS
#common-variables
tool_translator = "TRANSLATOR"
nmt_max_batch_size = 25
anu_nmt_input_topic = 'anuvaad_nmt_translate'
anu_nmt_output_topic = 'anuvaad_nmt_translate_processed'

#kafka-configs
anu_translator_input_topic = 'anuvaad-dp-tools-translator-input-v1'
anu_translator_output_topic = 'anuvaad-dp-tools-translator-output-v1'
anu_translator_consumer_grp = os.environ.get('ANUVAAD_ETL_TRANSLATOR_CONSUMER_GRP', 'anuvaad-etl-translator-consumer-group')
translator_cons_no_of_instances = 1
translator_cons_no_of_partitions = 1
translator_nmt_cons_no_of_instances = 1
translator_nmt_cons_no_of_partitions = 1


#datastore-configs
mongo_translator_db = os.environ.get('MONGO_ANUVAAD_TRANSLATOR_DB', 'anuvaad-etl-translator')
mongo_translator_collection = os.environ.get('MONGO_ANUVAAD_TRANSLATOR_COL', 'anuvaad-etl-translator-content')

#module-configs
context_path = os.environ.get('ANU_ETL_WFM_CONTEXT_PATH', '/anuvaad-etl/translator')

#general-log-messages
log_msg_start = " process started."
log_msg_end = " process ended."
log_msg_error = " has encountered an exception, job ended."


