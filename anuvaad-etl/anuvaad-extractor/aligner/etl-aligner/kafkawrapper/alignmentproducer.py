import json
import logging
import traceback

import os
import datetime as dt
from kafka import KafkaProducer

log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9095')
align_job_topic = "laser-align-job-register-b"
#align_job_topic = os.environ.get('ALIGN_JOB_TOPIC', 'laser-align-job-register')
anu_dp_wf_aligner_out_topic = os.environ.get('ANU_DP_WF_ALIGNER_OUT_TOPIC', 'anuvaad-dp-tools-aligner-output')
align_job_topic_partitions = os.environ.get('ALIGN_JOB_TOPIC_PARTITIONS', 2)


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
            log.info(object_in)
            if iswf:
                producer.send(anu_dp_wf_aligner_out_topic, value=object_in)
                log.info("Pushed to the topic: " + anu_dp_wf_aligner_out_topic)
            else:
                producer.send(align_job_topic, value=object_in)
                log.info("Pushed to the topic: " + align_job_topic)
            producer.flush()
        except Exception as e:
            log.error("Exception while producing: " + str(e))
            traceback.print_exc()
