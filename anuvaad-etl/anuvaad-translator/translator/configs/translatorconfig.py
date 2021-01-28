import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')
redis_server_prefix = os.environ.get('REDIS_PREFIX', 'redis')
redis_server_host = os.environ.get('REDIS_URL', 'localhost')
redis_server_port = os.environ.get('REDIS_PORT', 6379)
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
nmt_labse_align_url = os.environ.get('NMT_LABSE_ALIGN_URL', 'http://172.30.0.234:5001/nmt-inference/v1/labse-aligner')


#MODULE-SPECIFIC-CONFIGS
#common-variables
tool_translator = "TRANSLATOR"
download_folder = "/app/upload/"
tmx_default_context = "JUDICIARY"
nmt_max_batch_size = os.environ.get('NMT_MAX_BATCH_SIZE', 25)
tmx_word_length = os.environ.get('TRANSLATOR_TMX_WORD_LENGTH', 10)
no_of_process = os.environ.get('TRANSLATOR_NO_OF_PROC', 5)
tmx_enabled = os.environ.get('TRANSLATOR_TMX_ENABLED', True)
tmx_global_enabled = os.environ.get('TRANSLATOR_TMX_GLOBAL_ENABLED', False)
tmx_org_enabled = os.environ.get('TRANSLATOR_TMX_ORG_ENABLED', True)
tmx_user_enabled = os.environ.get('TRANSLATOR_TMX_USER_ENABLED', True)


#nmt-machine-topics
anu_nmt_input_topic_mx = os.environ.get('KAFKA_NMT_MACHINES_INPUT_TOPICS', 'anuvaad-nmt-translate,anuvaad-nmt-translate-m2')
anu_nmt_output_topic_mx = os.environ.get('KAFKA_NMT_MACHINES_OUTPUT_TOPICS', 'anuvaad-nmt-translate-processed,anuvaad-nmt-translate-processed-m2')


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
mongo_tmx_collection = os.environ.get('MONGO_TMX_COL', 'anuvaad-tmx-collection')

#module-configs
context_path = os.environ.get('ANUVAAD_ETL_TRANSLATOR_CONTEXT_PATH', '/anuvaad-etl/translator')

#general-log-messages
log_msg_start = " process started."
log_msg_end = " process ended."
log_msg_error = " has encountered an exception, job ended."


