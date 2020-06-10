from kafka import KafkaConsumer
from json import loads
import logging

log = logging.getLogger('file')

# Kafka consumer class
class Consumer(object):
    def __init__(self,topic_name, server_address):
        self.topic_name = topic_name
        self.server_address = server_address

    # Consumer initialisation to consume message from queue
    def consumer_instantiate(self):
        consumer = KafkaConsumer(self.topic_name, bootstrap_servers = [self.server_address], auto_offset_reset = 'earliest', 
                                enable_auto_commit=True, value_deserializer=lambda x: loads(x.decode('utf-8')))
        return consumer


