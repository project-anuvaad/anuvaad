from socketio import PubSubManager
import logging
import pickle

try:
    import kafka
except ImportError:
    kafka = None


logger = logging.getLogger('socketio')


class Listner(PubSubManager):
    print("_LISTENER CHILD  KFMANGER")
    name = 'listner'


    # def __init__(self, url, channel, write_only):
    def __init__(self, url='kafka://localhost:9092', channel='socketio',
                 write_only=False):
        print("URL AT LISTENER:: ", url)
        print("URL AT CHANNEL:: ", channel)
        if kafka is None:
            raise RuntimeError('kafka-python package is not installed '
                               '(Run "pip install kafka-python" in your '
                               'virtualenv).')

        super(Listner, self).__init__(channel=channel,
                                           write_only=write_only)


        self.kafka_url = url
        print("INSIDE KafkaManager", self.kafka_url)
        self.producer = kafka.KafkaProducer(bootstrap_servers=self.kafka_url)
        self.consumer = kafka.KafkaConsumer(self.channel,
                                            bootstrap_servers=self.kafka_url)

    def _publish(self, data):
        self.producer.send(self.channel, value=pickle.dumps(data))
        self.producer.flush()

    def _kafka_listen(self):
        for message in self.consumer:
            yield message



    def _listen(self):
        print("INSIDE _LISTEN KFMANGER")
        for message in self._kafka_listen():
            if message.topic == self.channel:
                print("INSIDE _LISTEN KFMANGER OVERIDDEN")
                print("DATA FROM KAFKA TOPIC: ", message.value)
                room = message.value['jobs'][0]['metadata']['userID']
                PubSubManager.emit(self, event='task_updated', data=message.value, namespace='/', room=room,
                                  ignore_queue=True)
