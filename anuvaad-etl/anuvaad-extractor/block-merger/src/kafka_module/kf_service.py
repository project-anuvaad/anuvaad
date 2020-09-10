from src.utilities.model_response import CustomResponse
from src.utilities.model_response import Status
from src.utilities.utils import FileOperation
from src.kafka_module.producer import Producer
from src.kafka_module.consumer import Consumer
from src.resources.response_gen import Response
#from src.resources.response_gen import multi_thred_block_merger
from src.errors.errors_exception import KafkaConsumerError
from src.errors.errors_exception import KafkaProducerError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import time
import os

import threading
import config

def consumer_validator():
    try:
        consumer_class = Consumer(config.input_topic, config.bootstrap_server)
        consumer = consumer_class.consumer_instantiate()
        log_info("consumer_validator --- consumer running -----", None)
        return consumer
    except:
        log_exception("consumer_validator : error in kafka opertation while listening to consumer on topic %s"%(config.input_topic), None, None)
        raise KafkaConsumerError(400, "Can not connect to consumer.")

def push_output(producer, topic_name, output, jobid, task_id):
    try:
        producer.push_data_to_queue(topic_name, output)
        log_info("push_output : producer flushed value on topic %s"%(topic_name), jobid)
    except Exception as e:
        response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
        log_exception("push_output : Response can't be pushed to queue %s"%(topic_name), jobid, None)
        raise KafkaProducerError(response_custom, "data Not pushed to queue: %s"%(topic_name))


# main function for async process
def process_block_merger_kf():
    file_ops            = FileOperation()
    DOWNLOAD_FOLDER     = file_ops.create_file_download_dir(config.download_folder)
    task_starttime      = str(time.time()).replace('.', '')
    producer_tok        = Producer(config.bootstrap_server)

    # instatiation of consumer for respective topic
    try:
        consumer = consumer_validator()
        log_info("process_block_merger_kf : trying to receive value from consumer ", None)
        
        for msg in consumer:
            if Consumer.get_json_data(msg.value) == None:
                log_info('process_block_merger_kf - received invalid data {}'.format(msg.value), None)
                continue

            data            = Consumer.get_json_data(msg.value)
            task_id         = str("BM-" + str(time.time()).replace('.', ''))
            task_starttime  = str(time.time()).replace('.', '')

            input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)
            log_info("process_block_merger_kf kafka request arrived "+str(jobid), data)

            response_gen    = Response(data, DOWNLOAD_FOLDER)

            file_value_response = response_gen.workflow_response(task_id, task_starttime, os.environ.get('DEBUG_FLUSH', False))
            if file_value_response != None:
                if "errorID" not in file_value_response.keys():
                    push_output(producer_tok, config.output_topic, file_value_response, jobid, task_id)
                    log_info("process_block_merger_kf : response send to topic %s"%(config.output_topic), None)
                else:
                    log_info("process_block_merger_kf : error send to error handler", jobid)
    
    except KafkaConsumerError as e:
        response_custom = {}
        response_custom['message'] = str(e)
        file_ops.error_handler(response_custom, "KAFKA_CONSUMER_ERROR", True)
        log_exception("process_block_merger_kf : Consumer didn't instantiate", None, e)
    except KafkaProducerError as e:
        response_custom = {}
        response_custom['message'] = e.message      
        file_ops.error_handler(response_custom, "KAFKA_PRODUCER_ERROR", True)
        log_exception("process_block_merger_kf : response send to topic %s"%(config.output_topic), None, e)
