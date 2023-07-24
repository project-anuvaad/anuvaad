import json
import logging
import random
import string

from kafka import KafkaConsumer, TopicPartition
from service.translatorservice import TranslatorService
from utilities.translatorutils import TranslatorUtils
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception

from configs.translatorconfig import anu_translator_consumer_grp
from configs.translatorconfig import kafka_bootstrap_server_host
from configs.translatorconfig import translator_nmt_cons_no_of_partitions
from configs.translatorconfig import anu_nmt_output_topic

log = logging.getLogger('file')


# Method to instantiate the kafka consumer
def instantiate(topics):
    try:
        consumer = KafkaConsumer(*topics,
                                    bootstrap_servers=list(str(kafka_bootstrap_server_host).split(",")),
                                    api_version=(1, 0, 0),
                                    group_id=anu_translator_consumer_grp,
                                    auto_offset_reset='latest',
                                    enable_auto_commit=True,
                                    value_deserializer=lambda x: handle_json(x),
                                    max_poll_interval_ms=30000000,
                                    session_timeout_ms=30000)
        
        log_info("consumer_instantiate : Consumer returned for topic: %s"%(topics), None)
        return consumer
    except Exception as e:
            log_exception("consumer_instantiate : error occured for consumer topic: %s"%(topics), None, e)








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
        utils = TranslatorUtils()
        topics = utils.get_topics_from_models()
        #topics = [] #for local debug only
        topics.append(anu_nmt_output_topic)
        consumer = instantiate(topics)
        service = TranslatorService()
        rand_str = ''.join(random.choice(string.ascii_letters) for i in range(4))
        prefix = "Translator-NMT-" + "(" + rand_str + ")"
        log_info(prefix + " Running..........", None)
        while True:
            for msg in consumer:
                data = {}
                try:
                    data = msg.value
                    if data:
                        log_info(prefix + " | Received on Topic: " + msg.topic + " | Partition: " + str(msg.partition), data)
                        service.process_nmt_output(data)
                    else:
                        break
                except Exception as e:
                    log_exception(prefix + " Exception in translator nmt while consuming: " + str(e), data, e)
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
