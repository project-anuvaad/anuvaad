from utilities.model_response import CustomResponse
from utilities.model_response import Status
from utilities.utils import FileOperation
from Kafka_module.producer import Producer
from Kafka_module.consumer import Consumer
from resources.response_generation import Response
from errors.errors_exception import KafkaError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import time
import config

def consumer_validator():
    try:
        consumer_class = Consumer(config.tok_input_topic, config.bootstrap_server)
        consumer = consumer_class.consumer_instantiate()
        log_info("consumer_validator","--- consumer running -----", None)
        return consumer
    except:
        log_exception("consumer_validator", "error in kafka opertation while listening to consumer on topic %s"%(config.tok_input_topic), None, None)
        raise KafkaError("KAFKA_CONSUMER_ERROR", "Can not connect to consumer.")

def push_output(producer, topic_name, output, jobid):
    try:
        producer.push_data_to_queue(topic_name, output)
        log_info("push_output", "producer flushed value on topic %s"%(topic_name), jobid)
    except:
        log_exception("push_output", "Response can't be pushed to queue %s"%(topic_name), jobid, None)
        raise KafkaError("KAFKA_PRODUCER_ERROR", "data Not pushed to queue: %s"%(topic_name))

# main function for async process
def process_tokenization_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
    task_id = str("TOK-" + str(time.time()).replace('.', ''))
    task_starttime = str(time.time()).replace('.', '')
    producer_tok = Producer(config.bootstrap_server)
    # instatiation of consumer for respective topic
    try:
        consumer = consumer_validator()
        log_info("process_tokenization_kf", "trying to receive value from consumer ", None)
        print("trying to receive value",consumer)
        for msg in consumer:
            print("value received success")
            log_info("process_tokenization_kf", "value received from consumer", None)
            data = msg.value
            task_id = str("TOK-" + str(time.time()).replace('.', ''))
            task_starttime = str(time.time()).replace('.', '')
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)
            response_gen = Response(data, DOWNLOAD_FOLDER)
            file_value_response = response_gen.workflow_response(task_id, task_starttime)
            push_output(producer, config.tok_output_topic, file_value_response, jobid)
            log_info("process_tokenization_kf", "response send to topic %s"%(config.tok_output_topic), None)
    except KafkaError as e:
        response = Status.ERR_STATUS.value
        response['code'], response['message'] = e.code, e.message
        file_ops.error_handler(response, "KAFKA_ERROR", True)
        log_exception("process_tokenization_kf", "response send to topic %s"%(config.tok_output_topic), None, e)