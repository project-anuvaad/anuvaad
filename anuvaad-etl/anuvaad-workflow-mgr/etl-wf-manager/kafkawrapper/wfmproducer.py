import json
import logging

from kafka import KafkaProducer
from configs.wfmconfig import kafka_bootstrap_server_host
from configs.wfmconfig import module_wfm_name
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
        producer = KafkaProducer(bootstrap_servers=[kafka_bootstrap_server_host],
                                 api_version=(1, 0, 0),
                                 value_serializer=lambda x: json.dumps(x).encode('utf-8'))
        return producer

    # Method to push records to a topic in the kafka queue
    def push_to_queue(self, object_in, topic):
        producer = self.instantiate()
        try:
            if object_in:
                producer.send(topic, value=object_in)
                object_in["metadata"]["module"] = module_wfm_name # FOR LOGGING ONLY.
                log_info("Pushing to topic: " + topic, object_in)
            producer.flush()
            return None
        except Exception as e:
            log_exception("Exception while producing: " + str(e), object_in, e)
            return post_error("WFLOW_PRODUCER_ERROR", "Exception while producing: " + str(e), None)
