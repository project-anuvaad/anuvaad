import json
import logging
import traceback

from kafka import KafkaConsumer, TopicPartition
import os
from service.alignmentservice import AlignmentService
from utilities.alignmentutils import AlignmentUtils
from logging.config import dictConfig
from error_manager.emservice import post_error_wf


log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9092')
anu_dp_wf_aligner_in_topic = "anuvaad-dp-tools-aligner-input-v2"
align_job_consumer_grp = "anuvaad-etl-consumer-group"


class WflowConsumer:

    def __init__(self):
        pass

    # Method to instantiate the kafka consumer
    def instantiate(self, topics):
        topic_partitions = self.get_topic_paritions(topics)
        consumer = KafkaConsumer(bootstrap_servers=[cluster_details],
                                 api_version=(1, 0, 0),
                                 group_id=align_job_consumer_grp,
                                 auto_offset_reset='earliest',
                                 enable_auto_commit=True,
                                 max_poll_records=1,
                                 value_deserializer=lambda x: self.handle_json(x))
        consumer.assign(topic_partitions)
        return consumer

    # For all the topics, returns a list of TopicPartition Objects
    def get_topic_paritions(self, topics):
        topic_paritions = []
        for topic in topics:
            tp = TopicPartition(topic, 0) #for now the partition is hardocoded
            topic_paritions.append(tp)
        return topic_paritions


    # Method to read and process the requests from the kafka queue
    def consume(self):
        topics = [anu_dp_wf_aligner_in_topic]
        consumer = self.instantiate(topics)
        service = AlignmentService()
        util = AlignmentUtils()
        log.info("Align WFM Consumer running.......")
        while True:
            for msg in consumer:
                data = {}
                try:
                    data = msg.value
                    log.info("Received on Topic: " + msg.topic)
                    service.wf_process(data)
                    break
                except Exception as e:
                    log.exception("Exception while consuming: " + str(e))
                    data["taskID"] = "taskID"
                    util.error_handler("ALIGNER_CONSUMER_ERROR", "Exception while consuming", data, True)
                    break

    # Method that provides a deserialiser for the kafka record.
    def handle_json(self, x):
        try:
            return json.loads(x.decode('utf-8'))
        except Exception as e:
            log.exception("Exception while deserialising: " + str(e))
            return {}

    # Log config
    dictConfig({
        'version': 1,
        'formatters': {'default': {
            'format': '[%(asctime)s] {%(filename)s:%(lineno)d} %(threadName)s %(levelname)s in %(module)s: %(message)s',
        }},
        'handlers': {
            'info': {
                'class': 'logging.FileHandler',
                'level': 'DEBUG',
                'formatter': 'default',
                'filename': 'info.log'
            },
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'DEBUG',
                'formatter': 'default',
                'stream': 'ext://sys.stdout',
            }
        },
        'loggers': {
            'file': {
                'level': 'DEBUG',
                'handlers': ['info', 'console'],
                'propagate': ''
            }
        },
        'root': {
            'level': 'DEBUG',
            'handlers': ['info', 'console']
        }
    })
