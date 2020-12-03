import json
import logging
import string
import threading
from random import random

from kafka import KafkaConsumer, TopicPartition
from logging.config import dictConfig
from utilities.wfmutils import WFMUtils
from service.wfmservice import WFMService
from configs.wfmconfig import anu_etl_wf_error_topic
from configs.wfmconfig import anu_etl_wfm_consumer_grp
from configs.wfmconfig import kafka_bootstrap_server_host
from configs.wfmconfig import wfm_error_cons_no_of_partitions
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception


log = logging.getLogger('file')

# Method to instantiate the kafka consumer
def instantiate(topics):
    consumer = KafkaConsumer(*topics,
                             bootstrap_servers=list(str(kafka_bootstrap_server_host).split(",")),
                             api_version=(1, 0, 0),
                             group_id=anu_etl_wfm_consumer_grp,
                             auto_offset_reset='latest',
                             enable_auto_commit=True,
                             value_deserializer=lambda x: handle_json(x))
    return consumer


# For all the topics, returns a list of TopicPartition Objects
def get_topic_paritions(topics):
    topic_paritions = []
    for topic in topics:
        for partition in range(0, wfm_error_cons_no_of_partitions):
            tp = TopicPartition(topic, partition)
            topic_paritions.append(tp)
    return topic_paritions


# Method to read and process the requests from the kafka queue
def error_consume():
    try:
        wfmutils = WFMUtils()
        wfmservice = WFMService()
        topics = [anu_etl_wf_error_topic]
        consumer = instantiate(topics)
        rand_str = ''.join(random.choice(string.ascii_letters) for i in range(4))
        prefix = "WFM-Error-" + "(" + rand_str + ")"
        log_info(prefix + " | Running..........", None)
        log_info(prefix + " | Topics: " + str(topics), None)
        while True:
            for msg in consumer:
                data = {}
                try:
                    if msg:
                        data = msg.value
                        if 'jobID' in data.keys():
                            job_details = wfmutils.get_job_details(data["jobID"])
                            if job_details:
                                data["metadata"] = job_details[0]["metadata"]
                        log_info(prefix + " | Received on Topic: " + msg.topic + " | Partition: " + str(msg.partition), data)
                        wfmservice.update_errors(data)
                except Exception as e:
                    log_exception(prefix + " | Exception while consuming: " + str(e), data, e)
                    post_error("WFM_ERROR_CONSUMER_ERROR", "Exception while consuming: " + str(e), None)
    except Exception as e:
        log_exception("Exception while starting the wfm error consumer: " + str(e), None, e)
        post_error("WFM_CONSUMER_ERROR", "Exception while starting wfm error consumer: " + str(e), None)


# Method that provides a deserialiser for the kafka record.
def handle_json(x):
    try:
        return json.loads(x.decode('utf-8'))
    except Exception as e:
        log_exception("Exception while deserialising: ", None, e)
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