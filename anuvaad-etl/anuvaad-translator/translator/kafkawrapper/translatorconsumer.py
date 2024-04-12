import json
import logging
import random
import string
import threading

from kafka import KafkaConsumer, TopicPartition
from kafka.admin import KafkaAdminClient, NewTopic
from service.translatorservice import TranslatorService
from validator.translatorvalidator import TranslatorValidator
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf
from anuvaad_auditor.loghandler import log_info, log_error
from anuvaad_auditor.loghandler import log_exception

from configs.translatorconfig import anu_translator_input_topic, anu_translator_nonmt_topic
from configs.translatorconfig import anu_translator_consumer_grp
from configs.translatorconfig import kafka_bootstrap_server_host
from configs.translatorconfig import translator_cons_no_of_partitions

log = logging.getLogger('file')


# Method to instantiate the kafka consumer
def instantiate(topics):
    consumer = KafkaConsumer(*topics,
                             bootstrap_servers=list(str(kafka_bootstrap_server_host).split(",")),
                             api_version=(1, 0, 0),
                             group_id=anu_translator_consumer_grp,
                             auto_offset_reset='latest',
                             enable_auto_commit=True,
                             value_deserializer=lambda x: handle_json(x))
    return consumer

def create_topics(topic_names,consumer):
    admin_client = KafkaAdminClient(
                    bootstrap_servers=list(str(kafka_bootstrap_server_host).split(",")), 
                    client_id='test'
                )
    existing_topic_list = consumer.topics()
    print("EXISTING TOPICS:",list(consumer.topics()))
    topic_list = []
    for topic in topic_names:
        if topic not in existing_topic_list:
            print('Topic : {} added '.format(topic))
            topic_list.append(NewTopic(name=topic, num_partitions=6, replication_factor=1))
        else:
            print('Topic : {} already exist '.format(topic))
    try:
        if topic_list:
            admin_client.create_topics(new_topics=topic_list, validate_only=False)
            print("Topic Created Successfully")
        else:
            print("Topic Exist")
    except  Exception as e:
        print(e)

# For all the topics, returns a list of TopicPartition Objects
def get_topic_paritions(topics):
    topic_paritions = []
    for topic in topics:
        for partition in range(0, translator_cons_no_of_partitions):
            tp = TopicPartition(topic, partition)
            topic_paritions.append(tp)
    return topic_paritions


# Method to read and process the requests from the kafka queue
def consume():
    try:
        topics = [anu_translator_input_topic, anu_translator_nonmt_topic]
        consumer = instantiate(topics)
        consumer.subscribe(topics)
        create_topics(topics,consumer)
        service = TranslatorService()
        validator = TranslatorValidator()
        rand_str = ''.join(random.choice(string.ascii_letters) for i in range(4))
        prefix = "Translator-Core-" + "(" + rand_str + ")"
        log_info(prefix + " Running..........", None)
        while True:
            for msg in consumer:
                data = {}
                try:
                    data = msg.value
                    if data:
                        if msg.topic == anu_translator_nonmt_topic:
                            service.process_no_nmt_jobs(data)
                        else:
                            log_info(prefix + " | Received on Topic: " + msg.topic + " | Partition: " + str(msg.partition), data)
                            error = validator.validate_wf(data, False)
                            if error is not None:
                                log_error(prefix + " | Error: " + str(error), data, error)
                                log_info(prefix + " | Input: " + str(data), data)
                                post_error_wf(error["code"], error["message"], data, None)
                                break
                            service.start_file_translation(data)
                    else:
                        break
                except Exception as e:
                    log_exception(prefix + " Exception in translator while consuming: " + str(e), data, e)
                    post_error("TRANSLATOR_CONSUMER_ERROR", "Exception in translator while consuming: " + str(e), None)
    except Exception as e:
        log_exception("Exception while starting the translator consumer: " + str(e), None, e)
        post_error("TRANSLATOR_CONSUMER_EXC", "Exception while starting translator consumer: " + str(e), None)


# Method that provides a deserialiser for the kafka record.
def handle_json(x):
    try:
        return json.loads(x.decode('utf-8'))
    except Exception as e:
        log_exception("Exception while deserialising: ", None, e)
        return {}
