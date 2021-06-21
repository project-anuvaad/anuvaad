from kafka import KafkaConsumer
from json import loads
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import config

# Kafka consumer class
class Consumer(object):
    def __init__(self,topic_name, server_address):
        self.topic_name = topic_name
        self.server_address = server_address

    # Consumer initialisation to consume message from queue
    def consumer_instantiate(self):
        try:
            consumer = KafkaConsumer(self.topic_name, bootstrap_servers = list((self.server_address).split(",")), \
                                     auto_offset_reset = 'earliest', group_id = config.CONSUMER_GROUP, \
                                     enable_auto_commit=False,max_poll_interval_ms=30000000)
            log_info("consumer_instantiate : Consumer returned for topic: %s"%(self.topic_name), None)
            return consumer
        except Exception as e:
            log_exception("consumer_instantiate : error occured for consumer topic: %s"%(self.topic_name), None, e)

    @staticmethod
    def get_json_data(x):
        try:
            return loads(str(x, 'utf-8'))
        except Exception as e:
            return None


