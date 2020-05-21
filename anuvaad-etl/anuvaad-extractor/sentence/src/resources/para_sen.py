import os
from repositories.sentence_tokenise import AnuvaadEngTokenizer
import json
from flask_restful import reqparse, Resource
from flask.json import jsonify

# sentence tokenisation
parser = reqparse.RequestParser(bundle_errors=True)
parser.add_argument('paragraphs',action = 'append', required = True)

class sen_tokenise(Resource):
    
    def post(self):
        args    = parser.parse_args()
        print()
        if 'paragraphs' not in args or args['paragraphs'] is None or not isinstance(args['paragraphs'],list):
             return jsonify({
                'status': {
                    'code' : 400,
                    'message' : 'data missing'
                }
            })
        else:
            lines = list()
            for paragraph in args['paragraphs']:
                sentence_data = AnuvaadEngTokenizer().tokenize(paragraph)
                for sentence in sentence_data:
                    lines.append(sentence)
                    print(sentence)
            return jsonify({
                'status' : {
                    'code' : 200,
                    'message' : 'api successful'
                },
                'sentences' : lines
            })
