from utilities.model_response import CustomResponse
from utilities.model_response import Status
from utilities.utils import FileOperation
from kafka_module.producer import Producer
from kafka_module.consumer import Consumer
from resources.response_generation import Response
from common.errors import KafkaConsumerError
from common.errors import KafkaProducerError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import time
import config

def consumer_validator():
    try:
        consumer_class = Consumer(config.tok_input_topic, list(str(config.bootstrap_server).split(",")))
        consumer = consumer_class.consumer_instantiate()
        log_info("consumer_validator --- consumer running -----", None)
        return consumer
    except:
        log_exception("consumer_validator : error in kafka opertation while listening to consumer on topic %s"%(config.tok_input_topic), None, None)
        raise KafkaConsumerError(400, "Can not connect to consumer.")

def push_output(producer, topic_name, output, jobid, task_id):
    try:
        producer.push_data_to_queue(topic_name, output)
        ctx = {"jobID": jobid, "taskID": task_id, "metadata": {"module": "FILE-CONVERTER"}}
        log_info("push_output : producer flushed value on topic %s"%(topic_name), ctx)
    except Exception as e:
        response_custom = CustomResponse(Status.ERR_STATUS.value, jobid, task_id)
        log_exception("push_output : Response can't be pushed to queue %s"%(topic_name), jobid, None)
        raise KafkaProducerError(response_custom, "data Not pushed to queue: %s"%(topic_name))

# main function for async process
def process_fc_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
    producer_tok = Producer(list(str(config.bootstrap_server).split(",")))
    # instatiation of consumer for respective topic
    try:
        consumer = consumer_validator()
        log_info("process_fc_kf : trying to receive value from consumer ", None)
        for msg in consumer:
            log_info("process_fc_kf : value received from consumer", None)
            task_timestamp = eval(str(time.time()).replace('.', '')[0:13])
            task_id = str("FC-" + str(task_timestamp))
            task_starttime = task_timestamp
            data = msg.value
            task_id = str("FC-" + str(task_timestamp))
            task_starttime = task_timestamp
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)
            response_gen = Response(data, DOWNLOAD_FOLDER)
            file_value_response = response_gen.workflow_response(task_id, task_starttime)
            if "errorID" not in file_value_response.keys():
                push_output(producer_tok, config.tok_output_topic, file_value_response, jobid, task_id)
                log_info("process_fc_kf : response send to topic %s"%(config.tok_output_topic), None)
            else:
                log_info("process_fc_kf : error send to error handler", jobid)
    except KafkaConsumerError as e:
        response_custom = {}
        response_custom['message'] = str(e)
        file_ops.error_handler(response_custom, "KAFKA_CONSUMER_ERROR", True)
        log_exception("process_fc_kf : Consumer didn't instantiate", None, e)
    except KafkaProducerError as e:
        response_custom = {}
        response_custom['message'] = e.message      
        file_ops.error_handler(response_custom, "KAFKA_PRODUCER_ERROR", True)
        log_exception("process_fc_kf : response send to topic %s"%(config.tok_output_topic), None, e)