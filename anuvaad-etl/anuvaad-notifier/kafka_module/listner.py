from socketio.kafka_manager import KafkaManager


class Listner(KafkaManager):
    print("_LISTENER CHILD  KFMANGER")

    def __init__(self, url, channel, write_only):
        super(Listner, self).__init__(url=url, channel=channel, write_only=write_only)

    def _listen(self):
        print("INSIDE _LISTEN KFMANGER")
        for message in self._kafka_listen():
            if message.topic == self.channel:
                print("INSIDE _LISTEN KFMANGER OVERIDDEN")
                room = message.value['jobs'][0]['metadata']['userID']
                KafkaManager.emit(self, event='task_updated', data=message.value, namespace='/', room=room,
                                  ignore_queue=True)
