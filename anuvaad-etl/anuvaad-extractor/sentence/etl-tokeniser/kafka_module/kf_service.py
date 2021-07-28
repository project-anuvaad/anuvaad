import redis
from utilities.model_response import CustomResponse
from utilities.model_response import Status
from utilities.utils import FileOperation
from kafka_module.producer import Producer
from kafka_module.consumer import Consumer
from resources.response_generation import Response
from errors.errors_exception import KafkaConsumerError
from errors.errors_exception import KafkaProducerError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_exception
import time
import config
from repositories.job_repo import JobRepository
import logging
from logging.config import dictConfig
job = JobRepository()

# main function for async process
def process_tokenization_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
    # instatiation of consumer for respective topic
    try:
        consumer_class = Consumer(config.input_topic, list(str(config.bootstrap_server).split(",")))
        consumer = consumer_class.consumer_instantiate()
        log_info("process_tokenization_kf : trying to receive value from consumer ", None)
        for msg in consumer:
            data = msg.value
            log_info("process_tokenization_kf : received input json from input topic consumer ", data)
            task_id = str("TOK-" + str(time.time()).replace('.', '')[0:13])
            task_starttime = eval(str(time.time()).replace('.', '')[0:13])
            input_files, workflow_id, jobid, tool_name, step_order, user_id = file_ops.json_input_format(data)

            redis_search = job.search([config.redis_key_prefix + jobid])
            if redis_search:
                log_info(f"process_input_file_kf : received job id: {jobid} already present in redis so skipping the process ",data)
                continue
            val = job.upsert(config.redis_key_prefix + jobid, "IN_PROGRESS")
            log_info(f"process_input_file_kf : Added job id: {jobid} in Redis.", data)

            response_gen = Response(data, DOWNLOAD_FOLDER)
            file_value_response = response_gen.workflow_response(task_id, task_starttime)
            if "errorID" not in file_value_response.keys():
                producer = Producer()
                producer.push_data_to_queue(config.output_topic, file_value_response, data, task_id)
                val = job.upsert(config.redis_key_prefix + jobid, "COMPLETED")
            else:
                log_error("process_tokenization_kf : error send to error handler", data, None)
                val = job.upsert(config.redis_key_prefix + jobid, "FAILED")
    except KafkaConsumerError as e:
        response_custom = CustomResponse(Status.ERR_STATUS.value, None, None)
        response_custom.status_code['message'] = str(e)
        file_ops.error_handler(response_custom.status_code, "KAFKA_CONSUMER_ERROR", True)
        log_exception("process_tokenization_kf : Consumer didn't instantiate", None, e)
    except KafkaProducerError as e:
        response_custom = e.code
        response_custom['message'] = e.message      
        file_ops.error_handler(response_custom, "KAFKA_PRODUCER_ERROR", True)
        log_exception("process_tokenization_kf : response send to topic %s"%(config.output_topic), data, e)



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