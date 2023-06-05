import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')
redis_server_prefix = os.environ.get('REDIS_PREFIX', 'redis')
redis_server_host = os.environ.get('REDIS_URL', 'localhost')
redis_server_port = os.environ.get('REDIS_PORT', 6379)
tmx_redis_db = os.environ.get('ANUVAAD_TMX_REDIS_DB', 3)
if isinstance(tmx_redis_db, str):
    tmx_redis_db = eval(tmx_redis_db)
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
fetch_user_translation_url = str(os.environ.get('CONTENT_HANDLER_HOST', 'http://gateway_anuvaad-content-handler:5001')) \
                    + str(os.environ.get('FETCH_USER_TRANSLATION_ENDPOINT', '/anuvaad/content-handler/v0/records/user-translation-search'))
nmt_fetch_models_url = str(os.environ.get('NMT_HOST', 'http://172.30.0.234:5001')) + str(os.environ.get('FETCH_MODELS_ENDPOINT', '/nmt-inference/v2/fetch-models'))
nmt_translate_url = str(os.environ.get('NMT_HOST', 'http://172.30.0.234:5001')) + str(os.environ.get('NMT_TRANSLATE_ENDPOINT', '/nmt-inference/v4/translate'))
nmt_it_url = str(os.environ.get('NMT_HOST', 'http://172.30.0.234:5001')) + str(os.environ.get('NMT_IT_ENDPOINT', '/nmt-inference/v3/interactive-translation'))
nmt_labse_align_url = str(os.environ.get('NMT_HOST', 'http://172.30.0.234:5001')) + str(os.environ.get('NMT_LABSE_ALIGN_ENDPOINT', '/nmt-inference/v1/labse-aligner'))
nmt_attention_align_url = str(os.environ.get('NMT_HOST', 'http://172.30.0.234:5001')) + str(os.environ.get('NMT_ATTN_ALIGN_ENDPOINT', '/aai4b-nmt-inference/v1/labse-aligner-attention'))



#MODULE-SPECIFIC-CONFIGS
#common-variables
tool_translator = "TRANSLATOR"
download_folder = "/app/upload/"
tmx_default_context = os.environ.get('TRANSLATOR_TMX_DEFAULT_CONTEXT', "JUDICIARY")
nmt_max_batch_size = os.environ.get('NMT_MAX_BATCH_SIZE', 75)
tmx_word_length = os.environ.get('TRANSLATOR_TMX_WORD_LENGTH', 10)
no_of_process = os.environ.get('TRANSLATOR_NO_OF_PROC', 30)
tmx_enabled = os.environ.get('TRANSLATOR_TMX_ENABLED', True)
if isinstance(tmx_enabled, str):
    if tmx_enabled == "TRUE":
        tmx_enabled = True
    else:
        tmx_enabled = False
tmx_global_enabled = os.environ.get('TRANSLATOR_TMX_GLOBAL_ENABLED', False)
if isinstance(tmx_global_enabled, str):
    if tmx_global_enabled == "TRUE":
        tmx_global_enabled = True
    else:
        tmx_global_enabled = False
tmx_org_enabled = os.environ.get('TRANSLATOR_TMX_ORG_ENABLED', False)
if isinstance(tmx_org_enabled, str):
    if tmx_org_enabled == "TRUE":
        tmx_org_enabled = True
    else:
        tmx_org_enabled = False
tmx_user_enabled = os.environ.get('TRANSLATOR_TMX_USER_ENABLED', True)
if isinstance(tmx_user_enabled, str):
    if tmx_user_enabled == "TRUE":
        tmx_user_enabled = True
    else:
        tmx_user_enabled = False
user_translation_enabled = os.environ.get('USER_TRANSLATION_ENABLED', True)
if isinstance(user_translation_enabled, str):
    if user_translation_enabled == "TRUE":
        user_translation_enabled = True
    else:
        user_translation_enabled = False
orgs_nmt_disable = os.environ.get('ORGS_NMT_DISABLE', 'NONMT')
tmx_disable_roles = os.environ.get('ROLES_TMX_DISABLE', 'ANNOTATOR')
utm_disable_roles = os.environ.get('ROLES_UTM_DISABLE', 'ANNOTATOR')
suggestion_statuses = ["Pending", "Approved", "Rejected","Modified"]
is_attention_based_alignment_enabled = os.environ.get('IS_ATTN_BASED_ALIGNMENT_ENABLED', True)
if isinstance(is_attention_based_alignment_enabled, str):
    if is_attention_based_alignment_enabled == "TRUE":
        is_attention_based_alignment_enabled = True
    else:
        is_attention_based_alignment_enabled = False

#nmt-machine-topics
anu_nmt_input_topic = os.environ.get('KAFKA_NMT_TRANSLATION_INPUT_TOPIC', 'anuvaad-nmt-translate')
anu_nmt_output_topic = os.environ.get('KAFKA_NMT_TRANSLATION_OUTPUT_TOPIC', 'anuvaad-nmt-translate-processed')


#kafka-configs
anu_translator_input_topic = os.environ.get('KAFKA_ANUVAAD_DP_TRANSLATOR_INPUT_TOPIC', 'anuvaad-dp-tools-translator-input-v3')
anu_translator_output_topic = os.environ.get('KAFKA_ANUVAAD_DP_TRANSLATOR_OUTPUT_TOPIC', 'anuvaad-dp-tools-translator-output-v3')
anu_translator_nonmt_topic = os.environ.get('KAFKA_ANUVAAD_TRANSLATOR_NONMT_TOPIC', 'anuvaad-translator-no-nmt-v1')
anu_translator_consumer_grp = os.environ.get('KAFKA_ANUVAAD_ETL_TRANSLATOR_CONSUMER_GRP', 'anuvaad-etl-translator-consumer-group')
translator_cons_no_of_partitions = 1
translator_nmt_cons_no_of_partitions = 1
total_no_of_partitions = 6


#datastore-configs
mongo_translator_db = os.environ.get('MONGO_TRANSLATOR_DB', 'anuvaad-etl-translator-db')
mongo_translator_collection = os.environ.get('MONGO_TRANSLATOR_CONTENT_COL', 'anuvaad-etl-translator-content-collection')
mongo_trans_pages_collection = os.environ.get('MONGO_TRANSLATOR_PAGES_COL', 'anuvaad-etl-translator-pages-collection')
mongo_trans_batch_collection = os.environ.get('MONGO_TRANSLATOR_BATCH_COL', 'anuvaad-etl-translator-batch-collection')
mongo_tmx_collection = os.environ.get('MONGO_TMX_COL', 'anuvaad-tmx-collection')
mongo_suggestion_box_collection = os.environ.get('MONGO_SUGGESTIONS_COL', 'anuvaad-tmx-suggestion-box-collection')

#module-configs
context_path = os.environ.get('ANUVAAD_ETL_TRANSLATOR_CONTEXT_PATH', '/anuvaad-etl/translator')

#general-log-messages
log_msg_start = " process started."
log_msg_end = " process ended."
log_msg_error = " has encountered an exception, job ended."

#Order of Suggestion Box Glossary to be shown
suggestion_box_order={"Pending":0, "Modified":1, "Approved":2, "Rejected":3}
