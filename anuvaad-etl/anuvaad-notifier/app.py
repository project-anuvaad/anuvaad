#!/bin/python
import eventlet

eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO, join_room, send, leave_room, emit
from config import KAFKA_INPUT_TOPIC, NOTIFIER_SECRET_KEY, KAFKA_URL, APP_HOST, APP_PORT, ANUVAAD_URL_HOST, \
    ANUVAAD_BULK_SEARCH_ENDPOINT
import json
import requests
from kafka_module.listner import Listner

app = Flask(__name__)
app.config['SECRET_KEY'] = NOTIFIER_SECRET_KEY

socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins='*')
# socketio.init_app(app, message_queue='kafka://localhost:9092', channel = input_topic, write_only = True)
KAFKA_MESSAGE_QUEUE_LISTNER = Listner(url=KAFKA_URL, channel=KAFKA_INPUT_TOPIC, write_only=False)

socketio.init_app(app, client_manager=KAFKA_MESSAGE_QUEUE_LISTNER)


@socketio.on('join')
def on_join(request_body):
    """User joins a room"""
    print("\n\n JOIN EVENT \n\n")

    ROOM = request_body["room"]

    join_room(ROOM)

    # Broadcast that new user has joined
    send({"User has joined the " + ROOM + " room."}, room=ROOM)


@socketio.on('leave')
def on_leave(data):
    """User leaves a room"""
    print("\n\n LEAVE EVENT \n\n")

    username = data['username']
    room = data['room']
    leave_room(room)
    send({"msg": username + " has left the room"}, room=room)


@socketio.on('message')
def handleMessage(msg):
    print("\n\n MESSAGE EVENT \n\n")

    print('Message from message: ' + msg)

    send(msg, ignore_queue=True)


# DONE
@socketio.on('bulk_search_server')
def bulk_search(request_body, room):
    print("\n\n BULK SEARCH EVENT \n\n")
    print("INITIATE BULK SEARCH")

    BULK_SEARCH_URL = ANUVAAD_URL_HOST + ANUVAAD_BULK_SEARCH_ENDPOINT

    ROOM = request_body['room']

    AUTH = request_body['auth']

    INPUT_PAYLOAD = request_body['request_payload']
    REQUEST_PAYLOAD = json.dumps(INPUT_PAYLOAD)

    HEADERS = {'auth-token': AUTH, 'content-type': 'application/json'}

    bulk_search_response = requests.request("POST", BULK_SEARCH_URL, headers=HEADERS, data=REQUEST_PAYLOAD).json()

    emit('bulk_search_client', bulk_search_response, room=ROOM)


@socketio.on('kf_test')
def handle_kafka_Message(msg, room):
    print("\n\n MESSAGE EVENT \n\n")

    print('Message from kf_test: ' + msg)

    join_room(room)
    print("\n\n\n Joined Room ", room)


if __name__ == '__main__':
    socketio.run(app, host=APP_HOST, port=APP_PORT, debug=True)
