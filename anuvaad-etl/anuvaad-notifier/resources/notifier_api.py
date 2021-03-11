import json
import logging
import threading
import time
import urllib

import requests
from flask_restful import Resource
from flask import request, jsonify
from anuvaad_auditor import log_info, log_error

# rest request for notifier bulk search
from flask_socketio import emit

from config import ANUVAAD_URL_HOST, ANUVAAD_BULK_SEARCH_ENDPOINT
from app import app, socketio



class NotifierBulkSearch(Resource):

    # reading json request and reurnung final response
    def post(self):
        request_body = request.get_json(force=True)
        socketio.start_background_task(target=bulk_search(request_body))

def bulk_search(request_body):
    for i in range(0, 50):
        print("\n\n BULK SEARCH EVENT \n\n")
        print("INITIATE BULK SEARCH from Notifier API")

        # BULK_SEARCH_URL = urllib.parse.urljoin(ANUVAAD_URL_HOST, ANUVAAD_BULK_SEARCH_ENDPOINT)
        BULK_SEARCH_URL = urllib.parse.urljoin(ANUVAAD_URL_HOST , ANUVAAD_BULK_SEARCH_ENDPOINT)

        ROOM = request_body['room']
        print("REQUEST FOR ROOM: ", ROOM)

        AUTH = request_body['auth']

        INPUT_PAYLOAD = request_body['request_payload']
        REQUEST_PAYLOAD = json.dumps(INPUT_PAYLOAD)

        HEADERS = {'auth-token': AUTH, 'content-type': 'application/json'}

        bulk_search_response = requests.request("POST", BULK_SEARCH_URL, headers=HEADERS, data=REQUEST_PAYLOAD).json()

        print("RESPONSE: ", bulk_search_response)
        print("EMITITNG TO : ", ROOM)
        print("ROOM TYPE: ", type(ROOM))


        emit('task_updated', bulk_search_response, room=ROOM, namespace='/', ignore_queue= True)
        print("Wait for 10 sec")
        time.sleep(10)