from kafka import KafkaConsumer
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import config
import json


def get_consumer(topics):
    try:
        consumer = KafkaConsumer(
            bootstrap_servers=[config.bootstrap_server],
            value_deserializer=lambda x: json.loads(x.decode('utf-8')))
    
        consumer.subscribe(topics)    
        log_info('get_consumer : consumer returned for topics:{}'.format(topics),MODULE_CONTEXT)
        return consumer
    except Exception as e:
        log_exception('ERROR OCCURRED for getting consumer with topics:{}'.format(topics),MODULE_CONTEXT,e)
        log_exception('get_consumer : ERROR = ' + str(e),MODULE_CONTEXT,e)
        return None