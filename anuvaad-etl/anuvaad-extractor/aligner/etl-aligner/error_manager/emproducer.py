import json
import logging
import traceback

import os
from kafka import KafkaProducer


log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9092')


def instantiate():
    producer = KafkaProducer(bootstrap_servers=[cluster_details],
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
        log.error("Exception while producing: " + str(e))
        traceback.print_exc()