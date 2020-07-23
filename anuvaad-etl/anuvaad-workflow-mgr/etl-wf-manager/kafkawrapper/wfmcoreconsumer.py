import json
import logging
import traceback

from kafka import KafkaConsumer, TopicPartition
import os
from logging.config import dictConfig
from service.wfmservice import WFMService
from anuvaad_em.emservice import post_error


log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9092')
#anu_etl_wfm_core_topic = os.environ.get('ANU_ETL_WFM_CORE_TOPIC', 'anu-etl-wf-initiate')
anu_etl_wfm_consumer_grp = os.environ.get('ANU_ETL_WF_CONSUMER_GRP', 'anu-etl-consumer-group')
anu_etl_wfm_core_topic = 'anu-etl-wf-initiate-v2'



# Method to instantiate the kafka consumer
def instantiate(topics):
    topic_partitions = get_topic_paritions(topics)
    consumer = KafkaConsumer(bootstrap_servers=[cluster_details],
                             api_version=(1, 0, 0),
                             group_id=anu_etl_wfm_consumer_grp,
                             auto_offset_reset='latest',
                             enable_auto_commit=True,
                             max_poll_records=1,
                             value_deserializer=lambda x: handle_json(x))
    consumer.assign(topic_partitions)
    return consumer


# For all the topics, returns a list of TopicPartition Objects
def get_topic_paritions(topics):
    topic_paritions = []
    for topic in topics:
        tp = TopicPartition(topic, 0)  # for now the partition is hardocoded
        topic_paritions.append(tp)
    return topic_paritions


# Method to read and process the requests from the kafka queue
def core_consume():
    wfmservice = WFMService()
    topics = [anu_etl_wfm_core_topic]
    consumer = instantiate(topics)
    log.info("WFM Core Consumer Running..........")
    while True:
        for msg in consumer:
            try:
                data = msg.value
                log.info("Received on Topic: " + msg.topic)
                wfmservice.initiate(data)
                break
            except Exception as e:
                log.exception("Exception while consuming: " + str(e))
                post_error("ALIGNER_CONSUMER_ERROR", "Exception while consuming: " + str(e), None)
                break


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