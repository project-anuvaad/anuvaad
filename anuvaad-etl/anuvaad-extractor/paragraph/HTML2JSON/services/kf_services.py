from utilities.model_response import CheckingResponse
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

# main function for async process
def process_HTML_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.create_file_download_dir(config.download_folder)
    task_id = str("HTML2JSON-" + str(time.time()).replace('.', ''))
    task_starttime = str(time.time()).replace('.', '')
    # instatiation of consumer for respective topic
    try:
        consumer_class = Consumer(config.html_input_topic, config.bootstrap_server)
        consumer = consumer_class.consumer_instantiate() #Consumer
        log.info("--- consumer running -----")
    except:
        response = Status.ERR_Consumer.value
        producer_html2json = Producer(config.bootstrap_server) 
        producer = producer_html2json.producer_fn()
        producer.send(config.html_output_topic, value = response)
        producer.flush()
        log.error("error in kafka opertation producer flushed value on topic %s"%(config.html_input_topic))
    try:
        log.info("trying to receive value from consumer ")
        for msg in consumer:
            log.info("value received from consumer")
            data = msg.value
            task_id = str("HTML2JSON-" + str(time.time()).replace('.', ''))
            task_starttime = str(time.time()).replace('.', '')
            checking_response = CheckingResponse(data, task_id, task_starttime, DOWNLOAD_FOLDER)
            file_value_response = checking_response.main_response_wf()
            try:
                producer_html2json = Producer(config.bootstrap_server) 
                producer = producer_html2json.producer_fn()
                producer.send(config.html_output_topic, value = file_value_response)
                producer.flush()
                log.info("producer flushed value on topic %s"%(config.html_output_topic))
            except:
                log.info("error occured in file operation of workflow and it is pushed to error queue")
    except Exception as e:
        log.error("error occured while listening message from consumer or flushing data to another queue %s"%e)
        for msg in consumer:
            log.info("value received from consumer")
            data = msg.value
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.input_format(data)
            task_id = str("HTML2JSON-" + str(time.time()).replace('.', ''))
            task_starttime = str(time.time()).replace('.', '')
            response_custom = CustomResponse(Status.ERR_Producer.value, jobid, task_id)
            file_ops.error_handler(response_custom.status_code, True)
            log.info("error in kafka opertation producer flushed value on error topic")
        

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