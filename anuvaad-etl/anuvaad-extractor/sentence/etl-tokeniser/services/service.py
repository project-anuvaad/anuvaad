from repositories.eng_sentence_tokeniser import AnuvaadEngTokenizer
from repositories.hin_sentence_tokeniser import AnuvaadHinTokenizer
from errors.errors_exception import ServiceError
from utilities.utils import FileOperation
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import json

file_ops = FileOperation()
class Tokenisation(object):
    def __init__(self, DOWNLOAD_FOLDER, input_json_data):
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER
        self.input_json_data = input_json_data 

    # tokenising text in respective language 
    def tokenisation_core(self, paragraph_data, text_locale):
        try:
            tokenised_text = []
            if text_locale == 'en':
                for paragraph in paragraph_data:
                    tokenised_sentence_data = AnuvaadEngTokenizer().tokenize(paragraph)
                    tokenised_text.extend(tokenised_sentence_data)
            elif text_locale == 'hi':
                for paragraph in paragraph_data:
                    tokenised_sentence_data = AnuvaadHinTokenizer().tokenize(paragraph)
                    tokenised_text.extend(tokenised_sentence_data)
            return tokenised_text
        except:
            log_exception("tokenisation_core : Error occured during tokenising the paragraphs", self.input_json_data, None)
            raise ServiceError(400, "Tokenisation failed. Something went wrong during tokenisation.")
    
    # after successful tokenisation writting tokenised sentences into a text file
    def writing_tokenised_sentence_in_file(self, tokenised_data, output_path):
        log_info("writing_tokenised_sentence_in_file : File write for tokenised sentence started", self.input_json_data)
        write_file = open(output_path, 'w', encoding='utf-16')
        for item in tokenised_data:
            write_file.write("%s\n"%item)
        log_info("writing_tokenised_sentence_in_file : File write for tokenised sentence completed", None)

    # calling service function to convert paragragh into tokenised sentences for their respective language
    def tokenisation_response(self, input_file_data, in_locale, index):
        try:
            output_filepath , output_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER, '.txt')
            tokenised_data = self.tokenisation_core(input_file_data, in_locale)
            self.writing_tokenised_sentence_in_file(tokenised_data, output_filepath)
            return output_filename 
        except:
            log_exception("tokenisation_response : Error occured during output file creation", None, None)
            raise ServiceError(400, "Tokenisation failed. Something went wrong during output file creation.")

    def adding_tokenised_text_blockmerger(self, input_json_data_pagewise):
        try:
            blocks = input_json_data_pagewise['text_blocks']
            for item in blocks:
                text_data = item['text']
                tokenised_text = AnuvaadEngTokenizer().tokenize(text_data)
                item['tokenised_text'] = tokenised_text
            return input_json_data_pagewise
        except:
            log_error("Keys in block merger response changed or tokenisation went wrong.", self.input_json_data, e) 

    def writing_json_file_blockmerger(self, index, json_output_data):
        output_filepath , output_json_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER, '.json')
        write_file = open(output_filepath, 'w', encoding='utf-8')
        json_object = json.dumps(json_output_data)
        write_file.write(json_object)
        return output_json_filename