import json
import logging
import random

from kafka import KafkaProducer
from configs.wfmconfig import kafka_bootstrap_server_host
from configs.wfmconfig import module_wfm_name
from configs.wfmconfig import total_no_of_partitions
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

log = logging.getLogger('file')
p0_partition = None

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
    def push_to_queue(self, object_in, topic):
        global p0_partition
        producer = self.instantiate()
        partition = random.choice(list(range(0, total_no_of_partitions)))
        if p0_partition:
            while partition == p0_partition:
                partition = random.choice(list(range(0, total_no_of_partitions)))
        p0_partition = partition
        try:
            if object_in:
                producer.send(topic, partition=partition, value=object_in)
                object_in["metadata"]["module"] = module_wfm_name # FOR LOGGING ONLY.
                log_info("Pushing to TOPIC: " + topic + " | PARTITION: " + str(partition), object_in)
                return None
            producer.flush()
        except Exception as e:
            log_exception("Exception while producing: " + str(e), object_in, e)
            return post_error("WFLOW_PRODUCER_ERROR", "Exception while producing: " + str(e), None)
