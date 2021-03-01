import json
import logging

import os
from logging.config import dictConfig
from .config import kafka_bootstrap_server_host
from kafka import KafkaProducer


log = logging.getLogger('file')


def instantiate():
    producer = KafkaProducer(bootstrap_servers=list(str(kafka_bootstrap_server_host).split(",")),
                             api_version=(1, 0, 0),
                             value_serializer=lambda x: json.dumps(x).encode('utf-8'))
    return producer


# Method to push records to a topic in the kafka queue
def push_to_queue(object_in, topic):
    producer = instantiate()
    try:
        producer.send(topic, value=object_in)
        log.info("Pushing to the topic: " + topic)
        producer.flush()
    except Exception as e:
        log.exception("Exception while producing: " + str(e))


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
