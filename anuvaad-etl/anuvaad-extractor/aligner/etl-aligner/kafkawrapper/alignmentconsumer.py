import json
import logging

from kafka import KafkaConsumer, OffsetAndMetadata
import os
from service.alignmentservice import AlignmentService
from logging.config import dictConfig
from error_manager.emservice import post_error


log = logging.getLogger('file')
cluster_details = os.environ.get('KAFKA_CLUSTER_DETAILS', 'localhost:9092')
align_job_topic = "anuvaad-etl-alignment-jobs-v3"
align_job_consumer_grp = "anuvaad-etl-consumer-group"


class Consumer:

    def __init__(self):
        pass

    # Method to instantiate the kafka consumer
    def instantiate(self):
        topics = [align_job_topic]
        consumer = KafkaConsumer(*topics,
                                 bootstrap_servers=[cluster_details],
                                 api_version=(1, 0, 0),
                                 group_id=align_job_consumer_grp,
                                 auto_offset_reset='latest',
                                 enable_auto_commit=False,
                                 max_poll_records=1,
                                 value_deserializer=lambda x: self.handle_json(x))
        return consumer

    # Method to read and process the requests from the kafka queue
    def consume(self):
        consumer = self.instantiate()
        service = AlignmentService()
        log.info("Align Consumer running.......")
        for msg in consumer:
            try:
                data = msg.value
                log.info("Received on Topic: " + msg.topic)
                service.process(data, False)
                consumer.commit(OffsetAndMetadata(msg.offset + 1, None))
            except Exception as e:
                log.exception("Exception while consuming: " + str(e))
                post_error("ALIGNER_CONSUMER_ERROR", "Exception while consuming: " + str(e), None)
                continue

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
