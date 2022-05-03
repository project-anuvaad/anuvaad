from utilities.model_response import CustomResponse
from utilities.model_response import Status
from utilities.utils import FileOperation
from kafka_module.producer import Producer
from kafka_module.consumer import Consumer
from resources.response_generation import Response
from errors.errors_exception import KafkaConsumerError
from errors.errors_exception import KafkaProducerError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import time
import config
import logging
from logging.config import dictConfig

# main function for async process
def process_pdf_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.create_file_download_dir(config.download_folder)
    task_id = str("PDF2HTML-" + str(time.time()).replace('.', ''))
    task_starttime = str(time.time()).replace('.', '')
    # instatiation of consumer for respective topic
    try:
        consumer_class = Consumer(config.input_topic, config.bootstrap_server)
        consumer = consumer_class.consumer_instantiate()
        log_info("process_pdf_kf", "trying to receive value from consumer ", None)
        for msg in consumer:
            data = msg.value
            task_id = str("PDF2HTML-" + str(time.time()).replace('.', ''))
            task_starttime = str(time.time()).replace('.', '')
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)
            response_gen = Response(data, DOWNLOAD_FOLDER)
            file_value_response = response_gen.workflow_response(task_id, task_starttime)
            if "errorID" not in file_value_response.keys():
                producer = Producer()
                producer.push_data_to_queue(config.output_topic, file_value_response, jobid, task_id)
            else:
                log_info("process_pdf_kf", "error send to error handler", jobid)
    except KafkaConsumerError as e:
        response_custom = CustomResponse(Status.ERR_STATUS.value, None, None)
        response_custom.status_code['message'] = str(e)
        file_ops.error_handler(response_custom.status_code, "KAFKA_CONSUMER_ERROR", True)
        log_exception("process_pdf_kf", "Consumer didn't instantiate", None, e)
    except KafkaProducerError as e:
        response_custom = e.code
        response_custom['message'] = e.message      
        file_ops.error_handler(response_custom, "KAFKA_PRODUCER_ERROR", True)
        log_exception("process_pdf_kf", "response send to topic %s"%(config.output_topic), response_custom['jobID'], e)


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