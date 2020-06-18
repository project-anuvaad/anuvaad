import json
import logging
import traceback

import os
import datetime as dt
from kafka import KafkaProducer

log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9095')
align_job_topic = "etl-align-job-register"
anu_dp_wf_aligner_out_topic = "anuvaad-dp-tools-aligner-input-new"
align_job_consumer_grp = "anuvaad-dp-tools-aligner-output"


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
    def push_to_queue(self, object_in, iswf):
        producer = self.instantiate()
        try:
            if iswf:
                producer.send(anu_dp_wf_aligner_out_topic, value=object_in)
                log.info("Pushed to the topic: " + anu_dp_wf_aligner_out_topic)
            else:
                producer.send(align_job_topic, value=object_in)
                log.info("Pushed to the topic: " + align_job_topic)
            producer.flush()
        except Exception as e:
            log.exception("Exception while producing: " + str(e))
