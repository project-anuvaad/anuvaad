from time import sleep
from json import dumps
from kafka import KafkaProducer
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from utilities.model_response import Status
from errors.errors_exception import KafkaProducerError
from utilities.model_response import CustomResponse
import config

# kafka producer class
class Producer(object):
    def __init__(self):
        pass

    # publishing massage with kafka producer
    def producer_fn(self):
        producer = KafkaProducer(bootstrap_servers = list(str(config.bootstrap_server).split(",")), value_serializer = lambda x:dumps(x).encode('utf-8'))
        return producer

    def push_data_to_queue(self, topic_name, push_data, json_data, task_id):
        producer = self.producer_fn()
        try:
            producer.send(topic_name, value = push_data)
            producer.flush()
            log_info("push_data_to_queue : successfully pushed data to output queue : %s"%(config.output_topic), json_data)
        except:
            response_custom = json_data
            response_custom['taskID'] = task_id
            log_exception("push_data_to queue : Response can't be pushed to queue %s"%(topic_name), json_data, None)
            raise KafkaProducerError(response_custom, "data Not pushed to queue: %s"%(topic_name))