from kafka import KafkaConsumer
from json import loads
from src.services.service import Tokenisation
import logging

log = logging.getLogger('file')

class Consumer(object):
    def __init__(self,topic_name, group_id, server_address):
        self.topic_name = topic_name
        self.group_id = group_id
        self.server_address = server_address

    def consumer_instantiate(self):
        consumer = KafkaConsumer(self.topic_name, bootstrap_servers = [self.server_address], group_id = self.group_id, auto_offset_reset = 'earliest', 
                                enable_auto_commit=True, value_deserializer=lambda x: loads(x.decode('utf-8')))
        return consumer

    def consumer_fn(self, output_filepath):
        consumer = self.consumer_instantiate()
        service = Tokenisation()
        log.info("Consumer running!!!")
        try:
            data = {}
            for msg in consumer:
                log.info("Consuming from the Kafka Queue.")
                data = msg.value
                break
            service.tokenisation(data, output_filepath)
        except Exception as e:
            log.error("Exception while consuming: " + str(e))
        finally:
            consumer.close()

