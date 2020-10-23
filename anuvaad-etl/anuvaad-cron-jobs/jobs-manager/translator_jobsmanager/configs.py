import os

kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_SERVER_HOST', 'mongodb://localhost:27017/')
mongo_translator_db = os.environ.get('MONGO_ANUVAAD_TRANSLATOR_DB', 'anuvaad-etl-translator-db')
mongo_translator_collection = os.environ.get('MONGO_ANUVAAD_TRANSLATOR_COL', 'anuvaad-etl-translator-content-collection')

anu_translator_output_topic = os.environ.get('KAFKA_ANUVAAD_DP_TRANSLATOR_OUTPUT_TOPIC', 'anuvaad-dp-tools-translator-output-v2')
save_content_url = os.environ.get('SAVE_CONTENT_URL', 'http://gateway_anuvaad-content-handler:5001/api/v0/save-content')


jm_cron_interval_sec = os.environ.get('TRANSLATOR_JM_INTERVAL_SEC', 30)
module_name = "JOBS-MANAGER"
tool_translator = "TRANSLATOR"
