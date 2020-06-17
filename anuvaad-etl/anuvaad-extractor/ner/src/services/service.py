from src.repositories.sc_judgment_header_ner_eval import ScNerAnnotation
import config
import json
import logging

log = logging.getLogger('file')
class Annotation(object):
    def __init__(self):
        pass       

    def storing_tagged_data(self,data, output_filepath):
        write_file = open(output_filepath, 'w')
        log.info("NER operation started")
        for text in data:
            tagged_data = ScNerAnnotation(config.model_dir_judgment, config.model_dir_order, config.mix_model_dir, text).main()
            tagged_json_data = json.dumps(tagged_data)
            write_file.write("%s\n"%tagged_json_data)
        write_file.close()
        log.info("NER operation completed")