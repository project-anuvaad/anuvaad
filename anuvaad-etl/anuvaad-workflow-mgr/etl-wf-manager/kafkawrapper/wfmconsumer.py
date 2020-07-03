import json
import logging
import traceback

from kafka import KafkaConsumer
import os
from logging.config import dictConfig
from utilities.wfmutils import WFMUtils
from service.wfmservice import WFMService

log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9092')
consumer_poll_interval = os.environ.get('CONSUMER_POLL_INTERVAL', 10)
anu_etl_wfm_core_topic = os.environ.get('ANU_ETL_WFM_CORE_TOPIC', 'anu-etl-wf-initiate')
anu_etl_wfm_consumer_grp = os.environ.get('ANU_ETL_WF_CONSUMER_GRP', 'anu-etl-wfm-consumer-group')


# Method to instantiate the kafka consumer
def instantiate(topics):
    consumer = KafkaConsumer(*topics,
                             bootstrap_servers=[cluster_details],
                             api_version=(1, 0, 0),
                             group_id=anu_etl_wfm_consumer_grp,
                             auto_offset_reset='latest',
                             enable_auto_commit=True,
                             max_poll_records=1,
                             value_deserializer=lambda x: handle_json(x))
    #consumer.poll(consumer_poll_interval)
    return consumer


# Method to read and process the requests from the kafka queue
def consume():
    wfmutils = WFMUtils()
    wfmservice = WFMService()
    wfmutils.read_all_configs()
    configs = wfmutils.get_configs()
    topics = wfmutils.fetch_output_topics(configs)
    topics.append(anu_etl_wfm_core_topic)
    consumer = instantiate(topics)
    log.info("WFM Consumer Running..........")
    try:
        for msg in consumer:
            data = msg.value
            log.info("CONSUMING from: " + msg.topic)
            if msg.topic == anu_etl_wfm_core_topic:
                wfmservice.initiate(data)
            else:
                wfmservice.manage(data)
    except Exception as e:
        log.exception("Exception while consuming: " + str(e))
        traceback.print_exc()
    finally:
        consumer.close()

# Method that provides a deserialiser for the kafka record.
def handle_json(x):
    try:
        return json.loads(x.decode('utf-8'))
    except Exception as e:
        print("Exception while deserialising: " + str(e))
        log.error("Exception while deserialising: " + str(e))
        traceback.print_exc()
        return {}




# Log config
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] {%(filename)s:%(lineno)d} %(threadName)s %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {
        'info': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'filename': 'info.log'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'stream': 'ext://sys.stdout',
        }
    },
    'loggers': {
        'file': {
            'level': 'DEBUG',
            'handlers': ['info', 'console'],
            'propagate': ''
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['info', 'console']
    }
})