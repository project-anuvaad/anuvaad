import time
from logging.config import dictConfig

from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_info

import config
from errors.errors_exception import KafkaConsumerError
from errors.errors_exception import KafkaProducerError
from kafka_module.consumer import Consumer
from kafka_module.producer import Producer
from repositories.job_repo import JobRepository
from resources.response_generation import Response
from utilities.model_response import CustomResponse
from utilities.model_response import Status
from utilities.utils import FileOperation

job = JobRepository()


# TRANSFORM function for async process
def process_transform_file_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER = file_ops.file_download(config.download_folder)
    # instatiation of consumer for respective topic
    try:
        consumer_class = Consumer(config.transform_input_topic, list(str(config.bootstrap_server).split(",")))
        consumer = consumer_class.consumer_instantiate()
        log_info("process_transform_input_file_kf : trying to receive value from consumer ", None)
        for msg in consumer:
            data = msg.value
            log_info("process_input_file_kf : received input json from input topic consumer ", data)
            task_id = str("TOK-" + str(time.time()).replace('.', '')[0:13])
            task_starttime = eval(str(time.time()).replace('.', '')[0:13])
            input_files, workflow_id, jobid, tool_name, step_order, user_id = file_ops.json_input_format(data)

            redis_search = job.search([config.redis_key_prefix + jobid])
            if redis_search:
                log_info(f"process_input_file_kf : received job id: {jobid} already present in redis so skipping the process ", data)
                continue
            val = job.upsert(config.redis_key_prefix+jobid, "IN_PROGRESS")
            log_info(f"process_input_file_kf : Added job id: {jobid} in Redis.", data)

            response_gen = Response(data, DOWNLOAD_FOLDER)
            file_value_response = response_gen.workflow_response(task_id, task_starttime, transform_flow=True)
            log_info(f"Test33: filevalueresponse = {file_value_response}",None)

            producer = Producer()
            producer.push_data_to_queue(config.transform_output_topic, file_value_response, data, task_id)
            log_info(f"RESPONSE for JOBID: {jobid}, RESPONSE: {file_value_response}", data)
            if file_value_response['status'] == 'FAILED':
                log_error("process_transform_file_kf : error send to error handler", data, None)
                val = job.upsert(config.redis_key_prefix + jobid, "FAILED")
            else:
                val = job.upsert(config.redis_key_prefix + jobid, "COMPLETED")

    except KafkaConsumerError as e:
        response_custom = CustomResponse(Status.ERR_STATUS.value, None, None)
        response_custom.status_code['message'] = str(e)
        file_ops.error_handler(response_custom.status_code, "KAFKA_CONSUMER_ERROR", True)
        log_exception("process_input_file_kf : Consumer didn't instantiate", None, e)
    except KafkaProducerError as e:
        response_custom = e.code
        response_custom['message'] = e.message
        file_ops.error_handler(response_custom, "KAFKA_PRODUCER_ERROR", True)
        log_exception("process_input_file_kf : response send to topic %s" % config.transform_output_topic, data, e)


# DOWNLOAD function for async process
def process_download_file_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER = file_ops.file_download(config.download_folder)
    # instatiation of consumer for respective topic
    try:
        consumer_class = Consumer(config.download_input_topic, list(str(config.bootstrap_server).split(",")))
        consumer = consumer_class.consumer_instantiate()
        log_info("process_download_input_file_kf : trying to receive value from consumer ", None)
        for msg in consumer:
            data = msg.value
            log_info("process_download_input_file_kf : received input json from input topic consumer ", data)
            task_id = str("TOK-" + str(time.time()).replace('.', '')[0:13])
            task_starttime = eval(str(time.time()).replace('.', '')[0:13])
            input_files, workflow_id, jobid, tool_name, step_order, user_id = file_ops.json_input_format(data)

            redis_search = job.search([config.redis_key_prefix + jobid])
            if redis_search:
                log_info(f"process_input_file_kf : received job id: {jobid} already present in redis so skipping the process ", data)
                continue
            val = job.upsert(config.redis_key_prefix+jobid, "IN_PROGRESS")
            log_info(f"process_input_file_kf : Added job id: {jobid} in Redis.", data)

            response_gen = Response(data, DOWNLOAD_FOLDER)
            file_value_response = response_gen.workflow_response(task_id, task_starttime, download_flow=True)
            producer = Producer()
            producer.push_data_to_queue(config.download_output_topic, file_value_response, data, task_id)

            log_info(f"RESPONSE for JOBID: {jobid}, RESPONSE: {file_value_response}", data)
            if file_value_response['status'] == 'FAILED':
                log_error("process_download_file_kf : error send to error handler", data, None)
                val = job.upsert(config.redis_key_prefix + jobid, "FAILED")
            else:
                val = job.upsert(config.redis_key_prefix + jobid, "COMPLETED")

    except KafkaConsumerError as e:
        response_custom = CustomResponse(Status.ERR_STATUS.value, None, None)
        response_custom.status_code['message'] = str(e)
        file_ops.error_handler(response_custom.status_code, "KAFKA_CONSUMER_ERROR", True)
        log_exception("process_download_file_kf : Consumer didn't instantiate", None, e)
    except KafkaProducerError as e:
        response_custom = e.code
        response_custom['message'] = e.message
        file_ops.error_handler(response_custom, "KAFKA_PRODUCER_ERROR", True)
        log_exception("process_download_file_kf : response send to topic %s" % config.download_output_topic, data, e)


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
