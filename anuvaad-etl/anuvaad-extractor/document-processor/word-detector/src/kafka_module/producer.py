from time import sleep
from json import dumps
from kafka import KafkaProducer
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

# kafka producer class
class Producer(object):
    def __init__(self, server_address):
        self.server_address = server_address

    # publishing massage with kafka producer
    def producer_fn(self):
        try:
            producer = KafkaProducer(bootstrap_servers =  list((self.server_address).split(",")), value_serializer = lambda x:dumps(x).encode('utf-8'))
            log_info("producer_fn : producer returned succesfully", None)
            return producer
        except Exception as e:
            log_exception("producer_fn : error occured in creating producer", None, e)

    def push_data_to_queue(self, topic_name, push_data):
        producer = self.producer_fn()
        producer.send(topic_name, value = push_data)
        producer.flush()
        log_info("push_data_to_queue : successfully pushed data to output queue", None)