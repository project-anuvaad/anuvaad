from src.utilities.model_response import CustomResponse
from src.utilities.model_response import Status
from src.utilities.utils import FileOperation
from src.kafka_module.producer import Producer
from src.kafka_module.consumer import Consumer
from src.resources.response_gen import Response
from src.errors.errors_exception import KafkaConsumerError
from src.errors.errors_exception import KafkaProducerError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import time
import os
import config
from src.utilities.app_context import LOG_WITHOUT_CONTEXT

def consumer_validator():
    try:
        consumer_class = Consumer(config.input_topic, config.bootstrap_server)
        consumer = consumer_class.consumer_instantiate()
        log_info("consumer_validator --- consumer running -----", None)
        return consumer
    except:
        log_exception("consumer_validator : error in kafka opertation while listening to consumer on topic %s"%(config.input_topic), None, None)
        raise KafkaConsumerError(400, "Can not connect to consumer.")

def push_output(producer, topic_name, output, jobid, task_id,data):
    try:
        producer.push_data_to_queue(topic_name, output)
        log_info("push_output : producer flushed value on topic %s"%(topic_name), data)
    except Exception as e:
        response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
        log_exception("push_output : Response can't be pushed to queue %s"%(topic_name), data, None)
        raise KafkaProducerError(response_custom, "data Not pushed to queue: %s"%(topic_name))


# main function for async process
def process_kf_request_payload():
    file_ops            = FileOperation()
    
    # instatiation of consumer for respective topic
    try:
        consumer = consumer_validator()
        log_info("trying to receive value from consumer ", LOG_WITHOUT_CONTEXT)
        
        for msg in consumer:
            if Consumer.get_json_data(msg.value) == None:
                log_info('received invalid data {}'.format(msg.value), LOG_WITHOUT_CONTEXT)
                continue
            
            data            = Consumer.get_json_data(msg.value)
            LOG_WITHOUT_CONTEXT['jobID']=data['jobID']
            log_info("received input request from Kafka queue for JobID: %s " % (data['jobID']), LOG_WITHOUT_CONTEXT)
            processRequest(data)
    
    except KafkaConsumerError as e:
        response_custom = {}
        response_custom['message'] = str(e)
        file_ops.error_handler(response_custom, "KAFKA_CONSUMER_ERROR", True)
        log_exception("Consumer didn't instantiate", None, e)
    except KafkaProducerError as e:
        response_custom = {}
        response_custom['message'] = e.message      
        file_ops.error_handler(response_custom, "KAFKA_PRODUCER_ERROR", True)
        log_exception("response send to topic %s"%(config.output_topic), None, e)
    except Exception as e: 
        file_ops.error_handler(response_custom, "KAFKA_CONSUMER_ERROR", True)
        log_exception("response send to topic %s"%(config.output_topic), None, e)

def processRequest(data):
    file_ops            = FileOperation()
    producer_tok        = Producer(config.bootstrap_server)
    DOWNLOAD_FOLDER     = file_ops.file_download(config.download_folder)
    task_id             = str("ANNO-" + str(time.time()).replace('.', ''))
    task_starttime      = str(time.time()).replace('.', '')
    input_params, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)
    
    log_info("processing -- received message "+str(jobid), data)

    try:
        response_gen        = Response(data, DOWNLOAD_FOLDER)
        result_response     = response_gen.workflow_response(task_id, task_starttime)

        if result_response != None:
            if "errorID" not in result_response.keys():
                push_output(producer_tok, config.output_topic, result_response, jobid, task_id, data)
                log_info("processing completed successfully, published at %s"%(config.output_topic), data)
            else:
                log_info("processing failed, informed WFM", data)

    except Exception as e:
        log_exception("exception encountered ",  LOG_WITHOUT_CONTEXT, e)