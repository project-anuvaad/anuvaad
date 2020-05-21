from kafka import KafkaConsumer
from json import loads

class Consumer(object):
    def __init__(self,topic_name, group_id, server_address):
        self.topic_name = topic_name
        self.group_id = group_id
        self.server_address = server_address

    def consumer_fn(self):
        consumer = KafkaConsumer(self.topic_name, bootstrap_servers = [self.server_address], group_id = self.group_id, auto_offset_reset = 'earliest', 
                                enable_auto_commit=True, value_deserializer=lambda x: loads(x.decode('utf-8')))
        print("consumer returned")
        return consumer