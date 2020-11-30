import os

kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')
mongo_translator_db = os.environ.get('MONGO_TRANSLATOR_DB', 'anuvaad-etl-translator-db')
mongo_translator_collection = os.environ.get('MONGO_TRANSLATOR_COL', 'anuvaad-etl-translator-content-collection')

anu_translator_output_topic = os.environ.get('KAFKA_ANUVAAD_DP_TRANSLATOR_OUTPUT_TOPIC', 'anuvaad-dp-tools-translator-output-v3')
save_content_url = str(os.environ.get('CONTENT_HANDLER_HOST', 'http://gateway_anuvaad-content-handler:5001')) \
                   + str(os.environ.get('SAVE_CONTENT_ENDPOINT', '/anuvaad/content-handler/v0/save-content'))


jm_cron_interval_sec = os.environ.get('TRANSLATOR_JM_INTERVAL_SEC', 30)
module_name = "JOBS-MANAGER"
