import json
import logging
import threading

from kafka import KafkaConsumer, TopicPartition
from service.translatorservice import TranslatorService
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

from configs.translatorconfig import anu_nmt_output_topic
from configs.translatorconfig import anu_translator_consumer_grp
from configs.translatorconfig import kafka_bootstrap_server_host
from configs.translatorconfig import translator_nmt_cons_no_of_partitions


log = logging.getLogger('file')

# Method to instantiate the kafka consumer
def instantiate(topics):
    topic_partitions = get_topic_paritions(topics)
    consumer = KafkaConsumer(bootstrap_servers=[kafka_bootstrap_server_host],
                             api_version=(1, 0, 0),
                             group_id=anu_translator_consumer_grp,
                             auto_offset_reset='latest',
                             enable_auto_commit=True,
                             value_deserializer=lambda x: handle_json(x))
    consumer.assign(topic_partitions)
    return consumer


# For all the topics, returns a list of TopicPartition Objects
def get_topic_paritions(topics):
    topic_paritions = []
    for topic in topics:
        for partition in range(0, translator_nmt_cons_no_of_partitions):
            tp = TopicPartition(topic, partition)
            topic_paritions.append(tp)
    return topic_paritions


# Method to read and process the requests from the kafka queue
def consume_nmt():
    try:
        topics = [anu_nmt_output_topic]
        consumer = instantiate(topics)
        service = TranslatorService()
        thread = threading.current_thread().name
        log_info(str(thread) + " Running..........", None)
        while True:
            for msg in consumer:
                try:
                    if msg:
                        data = msg.value
                        log_info(str(thread) + " | Received on Topic: " + msg.topic, data)
                        service.process_nmt_output(data)
                except Exception as e:
                    log_exception("Exception in translator nmt while consuming: " + str(e), None, e)
                    post_error("TRANSLATOR_CONSUMER_ERROR", "Exception in translator while consuming: " + str(e), None)
    except Exception as e:
        log_exception("Exception while starting the translator nmt consumer: " + str(e), None, e)
        post_error("TRANSLATOR_CONSUMER_EXC", "Exception while starting translator consumer: " + str(e), None)


# Method that provides a deserialiser for the kafka record.
def handle_json(x):
    try:
        return json.loads(x.decode('utf-8'))
    except Exception as e:
        log_exception("Exception while deserialising: ", None, e)
        return {}