import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_SERVER_HOST', 'mongodb://localhost:27017/')
file_download_url = os.environ.get('FILE_DOWNLOAD_URL', 'https://auth.anuvaad.org/anuvaad/v1/download')
save_content_url = os.environ.get('SAVE_CONTENT_URL', 'http://gateway_anuvaad-content-handler:5001/api/v0/save-content')
fetch_content_url = os.environ.get('FETCH_CONTENT_URL', 'http://gateway_anuvaad-content-handler:5001/api/v0/fetch-content')
update_content_url = os.environ.get('UPDATE_CONTENT_URL', 'http://gateway_anuvaad-content-handler:5001/api/v0/update-content')
nmt_translate_url = os.environ.get('NMT_TRANSLATE_URL', 'http://52.40.71.62:3003/translator/translate-anuvaad')
nmt_interactive_translate_url = os.environ.get('NMT_IT_URL', 'http://52.40.71.62:5001/v1/interactive-translation')

#MODULE-SPECIFIC-CONFIGS
#common-variables
tool_translator = "TRANSLATOR"
nmt_max_batch_size = 25
anu_nmt_input_topic = os.environ.get('KAFKA_NMT_TRANSLATION_INPUT_TOPIC', 'anuvaad_nmt_translate')
anu_nmt_output_topic = os.environ.get('KAFKA_NMT_TRANSLATION_OUTPUT_TOPIC', 'anuvaad_nmt_translate_processed')
jm_cron_interval_sec = 30

#kafka-configs
anu_translator_input_topic = os.environ.get('KAFKA_ANUVAAD_DP_TRANSLATOR_INPUT_TOPIC', 'anuvaad-dp-tools-translator-input-v2')
anu_translator_output_topic = os.environ.get('KAFKA_ANUVAAD_DP_TRANSLATOR_OUTPUT_TOPIC', 'anuvaad-dp-tools-translator-output-v2')
anu_translator_consumer_grp = os.environ.get('KAFKA_ANUVAAD_ETL_TRANSLATOR_CONSUMER_GRP', 'anuvaad-etl-translator-consumer-group')
translator_cons_no_of_instances = 1
translator_cons_no_of_partitions = 1
translator_nmt_cons_no_of_instances = 1
translator_nmt_cons_no_of_partitions = 1


#datastore-configs
mongo_translator_db = os.environ.get('MONGO_ANUVAAD_TRANSLATOR_DB', 'anuvaad-etl-translator-db')
mongo_translator_collection = os.environ.get('MONGO_ANUVAAD_TRANSLATOR_COL', 'anuvaad-etl-translator-content-collection')
mongo_sentences_collection = os.environ.get('MONGO_ANUVAAD_TRANSLATOR_SENTENCES_COL', 'anuvaad-etl-translator-sentences')

#module-configs
context_path = os.environ.get('ANUVAAD_ETL_TRANSLATOR_CONTEXT_PATH', '/anuvaad-etl/translator')

#general-log-messages
log_msg_start = " process started."
log_msg_end = " process ended."
log_msg_error = " has encountered an exception, job ended."


