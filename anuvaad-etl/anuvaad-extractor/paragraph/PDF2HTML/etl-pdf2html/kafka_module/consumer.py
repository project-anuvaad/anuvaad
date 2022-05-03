from kafka import KafkaConsumer
from json import loads
from errors.errors_exception import KafkaConsumerError
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

# Kafka consumer class
class Consumer(object):
    def __init__(self,topic_name, server_address):
        self.topic_name = topic_name
        self.server_address = server_address

    # Consumer initialisation to consume message from queue
    def consumer_instantiate(self):
        try:
            consumer = KafkaConsumer(self.topic_name, bootstrap_servers = [self.server_address], auto_offset_reset = 'latest', 
                                    enable_auto_commit=True, value_deserializer=lambda x: loads(x.decode('utf-8')))
            log_info("consumer_instantiate", "Consumer returned for topic: %s"%(self.topic_name), None)
            return consumer
        except:
            log_exception("consumer_instantiate", "error occured for consumer topic: %s"%(self.topic_name), None, None)
            raise KafkaConsumerError(400, "Can not connect to consumer.")