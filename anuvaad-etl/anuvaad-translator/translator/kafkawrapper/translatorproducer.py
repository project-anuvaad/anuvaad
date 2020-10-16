import json
import logging

from kafka import KafkaProducer
from configs.translatorconfig import kafka_bootstrap_server_host
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

log = logging.getLogger('file')


class Producer:

    def __init__(self):
        pass

    # Method to instantiate producer
    # Any other method that needs a producer will get it from her
    def instantiate(self):
        producer = KafkaProducer(bootstrap_servers=list(str(kafka_bootstrap_server_host).split(",")),
                                 api_version=(1, 0, 0),
                                 value_serializer=lambda x: json.dumps(x).encode('utf-8'))
        return producer

    # Method to push records to a topic in the kafka queue
    def produce(self, object_in, topic):
        producer = self.instantiate()
        try:
            if object_in:
                producer.send(topic, value=object_in)
                log_info("Pushing to topic: " + topic, object_in)
            producer.flush()
        except Exception as e:
            log_exception("Exception in translator while producing: " + str(e), object_in, e)
            post_error("TRANSLATOR_PRODUCER_EXC", "Exception in translator while producing: " + str(e), None)
