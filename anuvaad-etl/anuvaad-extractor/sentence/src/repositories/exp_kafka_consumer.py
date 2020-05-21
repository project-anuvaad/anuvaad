from kafka import KafkaConsumer
from json import loads

def consumer_fn():
    consumer = KafkaConsumer('tokenise_topic',bootstrap_servers=['localhost:9092'], group_id='tok_grp', auto_offset_reset='earliest', 
                                enable_auto_commit=True, value_deserializer=lambda x: loads(x.decode('utf-8')))
    print("consumer returned")
    return consumer