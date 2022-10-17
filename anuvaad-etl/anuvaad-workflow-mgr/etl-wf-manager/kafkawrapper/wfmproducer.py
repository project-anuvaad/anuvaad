import json
import logging
import random

from kafka import KafkaProducer
from configs.wfmconfig import kafka_bootstrap_server_host
from configs.wfmconfig import module_wfm_name
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

log = logging.getLogger('file')
topic_partition_map = {}


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
    def push_to_queue(self, object_in, topic, partitions):
        global topic_partition_map
        producer = self.instantiate()
        partition = random.choice(list(range(0, partitions)))
        if topic in topic_partition_map.keys():
            while partition == topic_partition_map[topic]:
                partition = random.choice(list(range(0, partitions)))
        topic_partition_map[topic] = partition
        try:
            if object_in:
                log_info(f"Test28: Data Sent is {object_in}",None)
                log_info(f"Test28: Data Sent to topic {topic}",None)
                producer.send(topic, partition=partition, value=object_in)
                object_in["metadata"]["module"] = module_wfm_name  # FOR LOGGING ONLY.
                log_info("Pushing to TOPIC: " + topic + " | PARTITION: " + str(partition), object_in)
                return None
            producer.flush()
        except Exception as e:
            log_exception("Exception while producing: " + str(e), object_in, e)
            return post_error("WFLOW_PRODUCER_ERROR", "Exception while producing: " + str(e), None)
