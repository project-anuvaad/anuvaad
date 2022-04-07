import json
import logging
import random
import string
import threading

from kafka import KafkaConsumer, TopicPartition
from service.alignmentservice import AlignmentService
from logging.config import dictConfig
from utilities.alignmentutils import AlignmentUtils
from configs.alignerconfig import kafka_bootstrap_server_host
from configs.alignerconfig import align_job_consumer_grp
from configs.alignerconfig import align_job_topic
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception


log = logging.getLogger('file')

class Consumer:

    def __init__(self):
        pass

    # Method to instantiate the kafka consumer
    def instantiate(self, topics):
        consumer = KafkaConsumer(*topics,
                                 bootstrap_servers=list(str(kafka_bootstrap_server_host).split(",")),
                                 api_version=(1, 0, 0),
                                 group_id=align_job_consumer_grp,
                                 auto_offset_reset='latest',
                                 enable_auto_commit=True,
                                 value_deserializer=lambda x: self.handle_json(x))
        return consumer

    # Method to read and process the requests from the kafka queue
    def consume(self):
        topics = [align_job_topic]
        consumer = self.instantiate(topics)
        service = AlignmentService()
        util = AlignmentUtils()
        rand_str = ''.join(random.choice(string.ascii_letters) for i in range(4))
        prefix = "Align-Consumer(" + rand_str + ")"
        log_info(prefix + " running.......", None)
        while True:
            thread_count = 0
            for msg in consumer:
                data = {}
                try:
                    data = msg.value
                    if data:
                        log_info(prefix + " | Received on Topic: " + msg.topic + " | Partition: " + str(msg.partition), data)
                        thread_name = prefix + "--" + "thread--" + str(thread_count)
                        align_cons_thread = threading.Thread(target=service.process, args=(data, False), name=thread_name)
                        align_cons_thread.start()
                        log_info(prefix + " | Forked thread: " + thread_name, data)
                        thread_count += 1
                except Exception as e:
                    log_exception("Exception while consuming: " + str(e), data, e)
                    util.error_handler("ALIGNER_CONSUMER_ERROR", "Exception while consuming: " + str(e), None, False)
                    break

    # Method that provides a deserialiser for the kafka record.
    def handle_json(self, x):
        try:
            return json.loads(x.decode('utf-8'))
        except Exception as e:
            log_exception("Exception while deserialising: ", None, e)
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
