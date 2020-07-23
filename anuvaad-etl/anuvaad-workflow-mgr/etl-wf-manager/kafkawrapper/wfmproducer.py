import json
import logging
import traceback

import os
from kafka import KafkaProducer
from anuvaad_em.emservice import post_error

log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9092')


class Producer:

    def __init__(self):
        pass

    # Method to instantiate producer
    # Any other method that needs a producer will get it from her
    def instantiate(self):
        producer = KafkaProducer(bootstrap_servers=[cluster_details],
                                 api_version=(1, 0, 0),
                                 value_serializer=lambda x: json.dumps(x).encode('utf-8'))
        return producer

    # Method to push records to a topic in the kafka queue
    def push_to_queue(self, object_in, topic):
        producer = self.instantiate()
        try:
            producer.send(topic, value=object_in)
            log.info("Pushing to topic: " + topic)
            producer.flush()
        except Exception as e:
            log.exception("Exception while producing: " + str(e))
            post_error("WFLOW_PRODUCER_ERROR", "Exception while producing: " + str(e), None)
