import os
import json
from flask_restful import reqparse, Resource
from flask.json import jsonify
from src.resources.services import Tokenisation
from src.kafka.producer import Producer
from src.kafka.consumer import Consumer
# from src.resources.services import ConsumerRunning
from src.utilities.utils import File_operation
import werkzeug
from werkzeug.utils import secure_filename
import uuid
from time import sleep

# sentence tokenisation
file_operation = File_operation()
UPLOAD_FOLDER = file_operation.file_upload('upload_folder')
parser = reqparse.RequestParser(bundle_errors=True)
parser.add_argument('file', type = werkzeug.datastructures.FileStorage, location = 'files', required = True)
DOWNLOAD_FOLDER =file_operation.file_download('download_folder')

class sen_tokenise(Resource):
    
    def post(self):
        uploaded_file = parser.parse_args()
        file_data = uploaded_file['file']
        filename = secure_filename(file_data.filename)
        print(filename)
        if filename == "" or filename is None:
             return jsonify({
                'status': {
                    'code' : 400,
                    'message' : 'file not found'
                }
            })
        else:
            file_data.save(os.path.join(UPLOAD_FOLDER, filename))
            input_filepath = os.path.join(UPLOAD_FOLDER, filename)
            output_filepath = os.path.join(DOWNLOAD_FOLDER, 'tokenised_file_' + str(uuid.uuid1()) + '.txt')
            input_file_data = file_operation.read_file(input_filepath)
            producer_feed_data = {
                'paragraphs' : input_file_data
            }
            producer_paragraph = Producer('txt_paragraph','localhost:9092')
            producer_paragraph.producer_fn(producer_feed_data)

            consumer_paragraph = Consumer('txt_paragraph', 'tokenisation', 'localhost:9092')
            consumer_recieved_data = consumer_paragraph.consumer_fn()
            print("consumer done!!")
            for item in consumer_recieved_data:
                print("extracting value from consumer")
                data = item.value
                break
            print("recieved data from consumer")
            # try:
            #     consumer = ConsumerRunning()
            #     t1 = threading.Thread(target=consumer.consumer_running(output_filepath), name='keep_on_running')
            #     t1.start()
            # except Exception as e:
            #     print("error para_sen: ", e)
            tokenisation = Tokenisation()
            tokenisation.tokenisation(data, output_filepath)
            return jsonify({
                'status' : {
                    'code' : 200,
                    'message' : 'api successful'
                },
                'output' : 'file saved successfully'
            })

    
