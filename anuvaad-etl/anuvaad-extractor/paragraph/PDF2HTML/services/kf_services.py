from utilities.model_response import checking_file_response
from utilities.model_response import CustomResponse
from utilities.model_response import Status
from utilities.utils import FileOperation
from Kafka_module.producer import Producer
from Kafka_module.consumer import Consumer
import time
import config
import logging
from logging.config import dictConfig
log = logging.getLogger('file')

def process_pdf_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.create_file_download_dir(config.download_folder)
    try:
        consumer_class = Consumer(config.pdf2html_output_topic, config.bootstrap_server)
        consumer = consumer_class.consumer_instantiate() 
        log.info("--- consumer running -----")
    except:
        response = Status.ERR_Consumer.value
        producer_pdf2html = Producer(config.bootstrap_server) 
        producer = producer_pdf2html.producer_fn()
        producer.send(config.pdf2html_output_topic, value = response)
        producer.flush()
        log.error("can not listen message from consumer on topic %s"%(config.pdf2html_input_topic))
        log.info("error in kafka opertation producer flushed value on topic %s"%(config.pdf2html_output_topic))
    try:
        log.info("trying to receive value from consumer ")
        for msg in consumer:
            log.info("value received from consumer")
            task_starttime = str(time.time()).replace('.', '')
            task_id = str("PDF2HTML-" + str(time.time()).replace('.', ''))
            data = msg.value
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.input_format(data)
            file_value_response = checking_file_response(jobid, workflow_id, tool_name, step_order, task_id, task_starttime, input_files, DOWNLOAD_FOLDER)
            producer_pdf2html = Producer(config.bootstrap_server) 
            producer = producer_pdf2html.producer_fn()
            producer.send(config.pdf2html_output_topic, value = file_value_response.status_code)
            producer.flush()
            log.info("producer flushed value on topic %s"%(config.pdf2html_output_topic))
    except Exception as e:
        log.error("error occured during consumer running or flushing data to another queue %s"%e)
        task_end_time = str(time.time()).replace('.', '')
        output_file_response = ""
        for msg in consumer:
            log.info("value received from consumer")
            task_starttime = str(time.time()).replace('.', '')
            task_id = str("PDF2HTML-" + str(time.time()).replace('.', ''))
            data = msg.value
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.input_format(data)
            response = CustomResponse(Status.ERR_Producer.value, jobid, workflow_id, tool_name, step_order, task_id, task_starttime, task_end_time, output_file_response)
            producer_pdf2html = Producer(config.bootstrap_server) 
            producer = producer_pdf2html.producer_fn()
            producer.send(config.pdf2html_output_topic, value = response.status_code)
            producer.flush()
            log.info("error in kafka opertation producer flushed value on topic %s"%(config.pdf2html_output_topic))
        

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