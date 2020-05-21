from time import sleep
from json import dumps
from kafka import KafkaProducer

def producer_fn(json_paragraphs):
    producer = KafkaProducer(bootstrap_servers = ['localhost:9092'], value_serializer = lambda x:dumps(x).encode('utf-8'))
    print("sending message to kafka")
    producer.send('tokenise_topic', value = json_paragraphs)
    producer.flush()
    print("message published successfully")


