from src.utilities.model_response import checking_file_response
from src.utilities.utils import FileOperation
from src.Kafka.producer import Producer
from src.Kafka.consumer import Consumer
import time
import config
import logging
from logging.config import dictConfig

log = logging.getLogger('file')

def process_annotation_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
    consumer = Consumer(config.para_topic, config.bootstrap_server)
    consumer = consumer.consumer_instantiate() #Consumer
    log.info("---consumer running-----")
    try:
        log.info("trying to receive data from consumer")
        for msg in consumer:
            log.info("received data from consumer")
            data = msg.value
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)
            task_id = str("NER-" + str(time.time()).replace('.', ''))
            task_starttime = str(time.time()).replace('.', '')
            file_value_response = checking_file_response(jobid, workflow_id, tool_name, step_order, task_id, task_starttime, input_files, DOWNLOAD_FOLDER)
            producer_ner = Producer(config.bootstrap_server) 
            producer = producer_ner.producer_fn()
            producer.send(config.ner_topic, value = file_value_response.status_code)
            producer.flush()
            log.info("producer flushed for topic %s"%(config.ner_topic))
    except Exception as e:
        log.error("error occured during consumer running or flushing data to another queue %s"%e)

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