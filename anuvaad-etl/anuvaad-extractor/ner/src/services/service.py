from src.repositories.sc_judgment_header_ner_eval import ScNerAnnotation
import config
import json
import logging
from flask.json import jsonify

log = logging.getLogger('file')
class Annotation(object):
    def __init__(self):
        pass       

    # after successful entity annotation creating json object of annotation tag and tagged value
    def storing_tagged_data(self,data):
        response_ner = dict()
        log.info("NER operation started")
        for i, text in enumerate(data):
            tagged_data = ScNerAnnotation(config.model_dir_judgment, config.model_dir_order, config.mix_model_dir, text).main()
            ner_per_page = {str(i) : {"ner" : tagged_data}}
            response_ner.update(ner_per_page)
        log.info("NER operation completed")
        return response_ner