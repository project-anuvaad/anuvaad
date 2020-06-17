from time import sleep
from json import dumps
from kafka import KafkaProducer
import logging

log = logging.getLogger('file')
# kafka producer class
class Producer(object):
    def __init__(self, server_address):
        self.server_address = server_address

    # publishing massage with kafka producer
    def producer_fn(self):
        try:
            producer = KafkaProducer(bootstrap_servers = [self.server_address], value_serializer = lambda x:dumps(x).encode('utf-8'))
            log.info("producer returned succesfully")
            return producer
        except Exception as e:
            log.error("error occured in creating producer %s"%e)