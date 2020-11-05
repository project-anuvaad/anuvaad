import json
from kafka import KafkaProducer
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import config


def get_producer():
    try:
        producer = KafkaProducer(bootstrap_servers=list(str(config.bootstrap_server).split(",")),
                                 value_serializer=lambda x: json.dumps(x).encode('utf-8'))
        log_info('get_producer : producer returned successfully',MODULE_CONTEXT)
        return producer
    except Exception as e:
        log_exception('get_producer : ERROR OCCURRED while creating producer, ERROR =  ' + str(e),MODULE_CONTEXT,e)
        return None