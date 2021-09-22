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
#from kafka import TopicPartition, OffsetAndMetadata
import threading, queue
import config
from src.utilities.app_context import LOG_WITHOUT_CONTEXT
####################
Queue    = queue.Queue()
controlQueue  = queue.Queue()
controlQueue.put(1)
######################

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
def process_layout_detector_kf():
    file_ops            = FileOperation()
    DOWNLOAD_FOLDER     = file_ops.create_file_download_dir(config.download_folder)
    producer_tok        = Producer(config.bootstrap_server)
    
    # instatiation of consumer for respective topic
    try:
        consumer = consumer_validator()
        log_info("process_layout_detector_kf : trying to receive value from consumer ", LOG_WITHOUT_CONTEXT)

        while True:
            wait_for_control = controlQueue.get(block=True)

            for msg in consumer:

                if Consumer.get_json_data(msg.value) == None:
                    log_info('process_layout_detector_kf - received invalid data {}'.format(msg.value), None)
                    continue
                data            = Consumer.get_json_data(msg.value)

                print(data, 'mes received from consumer')

                # topic_partition = TopicPartition(config.input_topic, msg.partition)
                # consumer.seek(topic_partition,  OffsetAndMetadata(msg.offset+1, ''))
                # consumer.commit()

                consumer.commit_async()   # <--- This is what we need
                # Optionally, To check if everything went good
                #print('New Kafka offset: %s' % consumer.committed(TopicPartition(config.input_topic, msg.partition)))


                jobid           = data['jobID']
                log_info('process_layout_detector_kf - received message from kafka, dumping into internal queue ' , data)
                input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)

                Queue.put(data)
                break

    
    except KafkaConsumerError as e:
        response_custom = {}
        response_custom['message'] = str(e)
        file_ops.error_handler(response_custom, "KAFKA_CONSUMER_ERROR", True)
        log_exception("process_layout_detector_kf : Consumer didn't instantiate", None, e)
    except KafkaProducerError as e:
        response_custom = {}
        response_custom['message'] = e.message      
        file_ops.error_handler(response_custom, "KAFKA_PRODUCER_ERROR", True)
        log_exception("process_layout_detector_kf : response send to topic %s"%(config.output_topic), None, e)

def layout_detector_request_worker():
    file_ops            = FileOperation()
    DOWNLOAD_FOLDER     = file_ops.create_file_download_dir(config.download_folder)
    producer_tok        = Producer(config.bootstrap_server)
    log_info("layout_detector_request_worker : starting thread ", LOG_WITHOUT_CONTEXT)

    while True:
        data            = Queue.get(block=True)
        #################
        task_id         = str("layout_detector" + str(time.time()).replace('.', ''))
        ###################
        task_starttime  = str(time.time()).replace('.', '')
        input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)
        
        log_info("layout_detector_request_worker processing -- received message "+str(jobid), data)

        try:
            response_gen    = Response(data, DOWNLOAD_FOLDER)

            file_value_response = response_gen.workflow_response(task_id, task_starttime, False)
            if file_value_response != None:
                if "errorID" not in file_value_response.keys():
                    push_output(producer_tok, config.output_topic, file_value_response, jobid, task_id,data)
                    log_info("layout_detector_request_worker : response send to topic %s"%(config.output_topic), LOG_WITHOUT_CONTEXT)
                else:
                    log_info("layout_detector_request_worker : error send to error handler", data)

            log_info('layout_detector_request_worker - request in internal queue {}'.format(Queue.qsize()), data)

            Queue.task_done()
        except Exception as e:
            log_exception("layout_detector_request_worker ",  LOG_WITHOUT_CONTEXT, e)

        controlQueue.put(1)
