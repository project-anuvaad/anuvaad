from anuvaad_auditor import log_info, log_exception
from socketio import PubSubManager
import logging
import pickle
from json import loads

from config import CONSUMER_GROUP

try:
    import kafka
except ImportError:
    kafka = None

logger = logging.getLogger('socketio')


class Listner(PubSubManager):
    log_info("_LISTENER CHILD  KFMANGER", None)

    name = 'listner'

    # def __init__(self, url, channel, write_only):
    def __init__(self, url='kafka://localhost:9092', channel='socketio',
                 write_only=False):
        log_info("URL AT LISTENER: %s" % (url), None)
        log_info("URL AT CHANNEL:: %s" % (channel), None)
        if kafka is None:
            raise RuntimeError('kafka-python package is not installed '
                               '(Run "pip install kafka-python" in your '
                               'virtualenv).')

        super(Listner, self).__init__(channel=channel,
                                      write_only=write_only)

        self.kafka_url = url
        self.producer = kafka.KafkaProducer(bootstrap_servers=self.kafka_url)
        self.consumer = kafka.KafkaConsumer(self.channel,
                                            bootstrap_servers=self.kafka_url, group_id=CONSUMER_GROUP,
                                            enable_auto_commit=True, auto_offset_reset='latest'
                                            ,value_deserializer=lambda x: loads(x.decode('utf-8'))
                                            )

    def _publish(self, data):
        log_info("INSIDE _publish KFMANGER", None)
        self.producer.send(self.channel, value=pickle.dumps(data))
        self.producer.flush()

    def _kafka_listen(self):
        log_info("INSIDE _kafka_listen KFMANGER", None)
        for message in self.consumer:
            yield message

    def _listen(self):
        log_info("INSIDE _LISTEN KFMANGER", None)
        try:
            for message in self._kafka_listen():
                try:
                    if message.topic == self.channel:
                        log_info("INSIDE _LISTEN KFMANGER OVERIDDEN", None)
                        log_info("DATA FROM KAFKA TOPIC: %s" % (message.value), None)
                        room = message.value['jobs'][0]['metadata']['userID']
                        print("NOTIFIER KAFKA: EMITING TO ROOM: ", room)
                        PubSubManager.emit(self, event='task_updated', data=message.value, namespace='/', room=room,
                                           ignore_queue=True)
                except Exception as e:
                    log_exception("process_notifier_kf : EXCEPTIOM:\n %s" % (e), None, e)

        except Exception as e:
            log_exception("process_notifier_kf : EXCEPTIOM:\n %s"%(e), None, e)
