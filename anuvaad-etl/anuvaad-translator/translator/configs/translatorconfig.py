import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')
redis_host = os.environ.get('REDIS_SERVER_HOST', 'redis://localhost:6379/')
file_download_url = str(os.environ.get('USER_FILE_UPLOADER_HOST', 'http://gateway_anuvaad-user-fileuploader:5001')) \
                    + str(os.environ.get('USER_FILE_DOWNLOAD_ENDPOINT', '/anuvaad-api/file-uploader/v0/download-file'))
save_content_url = str(os.environ.get('CONTENT_HANDLER_HOST', 'http://gateway_anuvaad-content-handler:5001')) \
                    + str(os.environ.get('SAVE_CONTENT_ENDPOINT', '/api/v0/save-content'))
fetch_content_url = str(os.environ.get('CONTENT_HANDLER_HOST', 'http://gateway_anuvaad-content-handler:5001')) \
                    + str(os.environ.get('FETCH_CONTENT_ENDPOINT', '/api/v0/fetch-content'))
update_content_url = str(os.environ.get('CONTENT_HANDLER_HOST', 'http://gateway_anuvaad-content-handler:5001')) \
                    + str(os.environ.get('UPDATE_CONTENT_ENDPOINT', '/api/v0/update-content'))
sentence_fetch_url = str(os.environ.get('CONTENT_HANDLER_HOST', 'http://gateway_anuvaad-content-handler:5001')) \
                    + str(os.environ.get('SENTENCE_FETCH_ENDPOINT', '/api/v0/fetch-content-sentence'))
nmt_translate_url = os.environ.get('NMT_TRANSLATE_URL', 'http://172.30.0.234:5001/nmt-inference/v3/translate-anuvaad')
nmt_interactive_translate_url = os.environ.get('NMT_IT_URL', 'http://172.30.0.234:5001/nmt-inference/v2/interactive-translation')


#MODULE-SPECIFIC-CONFIGS
#common-variables
tool_translator = "TRANSLATOR"
nmt_max_batch_size = 25
anu_nmt_input_topic = os.environ.get('KAFKA_NMT_TRANSLATION_INPUT_TOPIC', 'anuvaad_nmt_translate')
anu_nmt_output_topic = os.environ.get('KAFKA_NMT_TRANSLATION_OUTPUT_TOPIC', 'anuvaad_nmt_translate_processed')
jm_cron_interval_sec = 30

#kafka-configs
anu_translator_input_topic = os.environ.get('KAFKA_ANUVAAD_DP_TRANSLATOR_INPUT_TOPIC', 'anuvaad-dp-tools-translator-input-v3')
anu_translator_output_topic = os.environ.get('KAFKA_ANUVAAD_DP_TRANSLATOR_OUTPUT_TOPIC', 'anuvaad-dp-tools-translator-output-v3')
anu_translator_tmx_in_topic = os.environ.get('KAFKA_ANUVAAD_TRANSLATOR_TMX_INPUT_TOPIC', 'anuvaad-translator-tmx-input-v1')
anu_translator_consumer_grp = os.environ.get('KAFKA_ANUVAAD_ETL_TRANSLATOR_CONSUMER_GRP', 'anuvaad-etl-translator-consumer-group')
translator_cons_no_of_instances = 1
translator_cons_no_of_partitions = 1
translator_nmt_cons_no_of_instances = 1
translator_nmt_cons_no_of_partitions = 1


#datastore-configs
mongo_translator_db = os.environ.get('MONGO_TRANSLATOR_DB', 'anuvaad-etl-translator-db')
mongo_translator_collection = os.environ.get('MONGO_TRANSLATOR_CONTENT_COL', 'anuvaad-etl-translator-content-collection')
mongo_sentences_collection = os.environ.get('MONGO_ANUVAAD_TRANSLATOR_SENTENCES_COL', 'anuvaad-etl-translator-sentences')

#module-configs
context_path = os.environ.get('ANUVAAD_ETL_TRANSLATOR_CONTEXT_PATH', '/anuvaad-etl/translator')

#general-log-messages
log_msg_start = " process started."
log_msg_end = " process ended."
log_msg_error = " has encountered an exception, job ended."


