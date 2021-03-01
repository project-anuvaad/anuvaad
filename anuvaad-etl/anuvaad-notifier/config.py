import os

# CROSS-MODULE-COMMON-CONFIGS
# kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
# mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')
APP_HOST = os.environ.get('ANUVAAD_NOTIFIER_HOST', '0.0.0.0')
APP_PORT = os.environ.get('ANUVAD_NOTIFIER_PORT', 5000)

# MODULE-SPECIFIC-CONFIGS
# common-variables

NOTIFIER_SECRET_KEY_DEFAULT = 'SOME_SECRETE_KEY'
NOTIFIER_SECRET_KEY_IDENTIFIER = 'NOTIFIER_SECRET_KEY'
NOTIFIER_SECRET_KEY = os.environ.get(NOTIFIER_SECRET_KEY_IDENTIFIER, NOTIFIER_SECRET_KEY_DEFAULT)

# kafka-configs
KAFKA_URL_DEFAULT = 'kafka://localhost:9092'
KAFKA_URL_IDENTIFIER = 'KAFKA_BOOTSTRAP_SERVER_HOST'
KAFKA_URL = os.environ(KAFKA_URL_IDENTIFIER, KAFKA_URL_DEFAULT)

KAFKA_INPUT_TOPIC_DEFAULT = 'anuvaad-notifier-input-v1'
KAFKA_INPUT_TOPIC_IDENTIFIER = 'KAFKA_ANUVAAD_NOTIFIER_INPUT_TOPIC'
KAFKA_INPUT_TOPIC = os.environ.get(KAFKA_INPUT_TOPIC_IDENTIFIER, KAFKA_INPUT_TOPIC_DEFAULT)

KAFKA_NOTIFIER_CONSUMER_GROUP_DEFAULT = 'anuvaad-notifier-consumer-group'
KAFKA_NOTIFIER_CONSUMER_GROUP_IDENTIFIER = 'KAFKA_ANUVAAD_ETL_TOKENISER_CONSUMER_GRP'
CONSUMER_GROUP = os.environ.get(KAFKA_NOTIFIER_CONSUMER_GROUP_IDENTIFIER, KAFKA_NOTIFIER_CONSUMER_GROUP_DEFAULT)


# DIFFERENT MODULE CONFIGS

ANUVAAD_URL_HOST_DEFAULT = "https://auth.anuvaad.org"
ANUVAAD_URL_HOST_IDENTIFIER = 'ANUVAD_URL_HOST'
ANUVAAD_URL_HOST = os.environ.get(ANUVAAD_URL_HOST_IDENTIFIER, ANUVAAD_URL_HOST_DEFAULT)

ANUVAAD_BULK_SEARCH_ENDPOINT_DEFAULT = "/anuvaad-etl/wf-manager/v1/workflow/jobs/search/bulk"
ANUVAAD_BULK_SEARCH_ENDPOINT_IDENTIFIER = 'ANUVAAD_BULK_SEARCH_ENDPOINT'
ANUVAAD_BULK_SEARCH_ENDPOINT = os.environ.get(ANUVAAD_BULK_SEARCH_ENDPOINT_IDENTIFIER, ANUVAAD_BULK_SEARCH_ENDPOINT_DEFAULT)




