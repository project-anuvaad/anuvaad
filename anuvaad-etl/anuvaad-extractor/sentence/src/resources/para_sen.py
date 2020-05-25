import os
import json
from flask_restful import reqparse, Resource
from flask.json import jsonify
from src.resources.services import Tokenisation
from src.kafka.producer import Producer
from src.kafka.consumer import Consumer
# from src.resources.services import ConsumerRunning
from src.utilities.utils import FileOperation
from src.utilities.model_response import Status
from src.utilities.model_response import CustomResponse
import werkzeug
from werkzeug.utils import secure_filename
import uuid
import config
from time import sleep

# sentence tokenisation
file_operation = FileOperation()
UPLOAD_FOLDER = file_operation.file_upload(config.upload_folder)
parser = reqparse.RequestParser(bundle_errors=True)
parser.add_argument('file', type = werkzeug.datastructures.FileStorage, location = 'files', required = True)
DOWNLOAD_FOLDER =file_operation.file_download(config.download_folder)

class SenTokenisePost(Resource):
    
    def post(self):
        uploaded_file = parser.parse_args()
        file_data = uploaded_file['file']
        filename = secure_filename(file_data.filename)
        # log
        if filename == "" or filename is None:
            response = CustomResponse(Status.ERR_FILE_NOT_FOUND.value, None)
            return response.get_response()
        else:
            file_data.save(os.path.join(UPLOAD_FOLDER, filename))
            input_filepath = os.path.join(UPLOAD_FOLDER, filename)
            output_filepath = os.path.join(DOWNLOAD_FOLDER, config.output_filenname)
            input_file_data = file_operation.read_file(input_filepath)
            if len(input_file_data) == 0:
                response = CustomResponse(Status.ERR_EMPTY_FILE.value, None)
                return response.get_response()
            tokenisation = Tokenisation()
            producer_feed_data = tokenisation.producer_input(input_file_data)
            producer_paragraph = Producer(config.sen_topic, config.kf_server)
            producer_paragraph.producer_fn(producer_feed_data)
            consumer_paragraph = Consumer(config.sen_topic, config.kf_group, config.kf_server)
            consumer_recieved_data = consumer_paragraph.consumer_fn()
            # log print("consumer done!!")
            for item in consumer_recieved_data:
                # print("extracting value from consumer")
                data = item.value
                break
            # print("recieved data from consumer")
            # try:
            #     consumer = ConsumerRunning()
            #     t1 = threading.Thread(target=consumer.consumer_running(output_filepath), name='keep_on_running')
            #     t1.start()
            # except Exception as e:
            #     print("error para_sen: ", e)
            tokenisation.tokenisation(data, output_filepath)
            response_true = CustomResponse(Status.SUCCESS.value, None)
            return response_true.get_response()

    
