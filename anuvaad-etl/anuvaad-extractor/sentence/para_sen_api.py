from src.repositories.sentence_tokenise import AnuvaadEngTokenizer
import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import uuid
from src.repositories.exp_kafka_producer import producer_fn
from src.repositories.exp_kafka_consumer import consumer_fn
from time import sleep

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'upload_file')
SAVE_FOLDER = os.path.join(os.getcwd(), 'saved_file')

app = Flask(__name__, template_folder='./')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SAVE_FOLDER'] = SAVE_FOLDER

@app.route('/para_to_sen',methods = ['POST'])
def para_to_sen():
    uploaded_file = request.files['txt_file']
    filename = secure_filename(uploaded_file.filename)
    if filename =='' or filename is None:
        return jsonify({
            'status' : {
                'code' : 200,
                'message' : 'file not found'
            }
        })
    else:
        uploaded_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        in_filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        out_filepath = os.path.join(app.config['SAVE_FOLDER'], 'tok_file_' + str(uuid.uuid1()) + '.txt')
        tokenised_sen_data = open(out_filepath, 'w')
        parsed_records = list()
        with open(in_filepath, 'r') as f:
            in_file_data = f.readlines()
        prod_data = {
            'paragraphs' : in_file_data
        }
        producer_fn(prod_data)
        consumer_recieved = consumer_fn()
        for item in consumer_recieved:
            data = item.value
            break
        print("recieved data from consumer")
        for item in data['paragraphs']:
            print("start tokenisation")
            sentence_data = AnuvaadEngTokenizer().tokenize(item)
            for sentence in sentence_data:
                tokenised_sen_data.write("%s\n"%sentence)
                print("tokenised sentence:   ",sentence)
        
        tokenised_sen_data.close()
        return jsonify({
            'status' : {
                'code' : 200,
                'message' : 'api successful'
            },
            'output' : 'file saved successfully'
        })
    
if __name__ == "__main__":
    app.run()