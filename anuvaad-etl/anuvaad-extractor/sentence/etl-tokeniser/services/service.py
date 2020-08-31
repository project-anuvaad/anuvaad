from repositories.eng_sentence_tokeniser import AnuvaadEngTokenizer
from repositories.hin_sentence_tokeniser import AnuvaadHinTokenizer
from errors.errors_exception import ServiceError
from utilities.utils import FileOperation
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
import json

file_ops = FileOperation()
class Tokenisation(object):
    def __init__(self, DOWNLOAD_FOLDER):
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER      

    # after successful tokenisation writting tokenised sentences into a text file
    def eng_tokenisation(self,data, output_filepath):
        log_info("eng_tokenisation","File write for english tokenised sentence started", None)
        write_file = open(output_filepath, 'w', encoding='utf-16')
        for item in data:
            sentence_data = AnuvaadEngTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()
        log_info("eng_tokenisation","File write for english tokenised sentence completed", None)

    # after successful tokenisation writting tokenised sentences into a text file
    def hin_tokenisation(self, data, output_filepath):
        log_info("hin_tokenisation","File write for english tokenised sentence started", None)
        write_file = open(output_filepath, 'w', encoding='utf-16')
        for item in data:
            sentence_data = AnuvaadHinTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()
        log_info("hin_tokenisation","File write for english tokenised sentence completed", None)

    # calling service function to convert paragragh into tokenised sentences for their respective language
    def tokenisation_response(self, input_file_data, in_locale, index):
        if in_locale == "en":
            try:
                output_filepath , output_en_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER, '.txt')
                self.eng_tokenisation(input_file_data, output_filepath)
                return output_en_filename 
            except:
                log_exception("eng_tokenisation","Error occured during File write for english tokenisation", None, None)
                raise ServiceError(400, "Tokenisation failed. Something went wrong during tokenisation.")
        elif in_locale == "hi":
            try:
                output_filepath , output_hi_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER, '.txt')
                self.hin_tokenisation(response_input_file_data, output_filepath)
                return output_hi_filename
            except:
                log_exception("hin_tokenisation","Error occured during File write for Hindi tokenisation", None, None)
                raise ServiceError(400, "Tokenisation failed. Something went wrong during tokenisation.")

    def adding_tokenised_text_blockmerger(self, input_json_data_pagewise):
        blocks = input_json_data_pagewise['text_blocks']
        for item in blocks:
            text_data = item['text']
            tokenised_text = AnuvaadEngTokenizer().tokenize(text_data)
            item['tokenised_text'] = tokenised_text
        return input_json_data_pagewise

    def writing_json_file_blockmerger(self, index, json_output_data):
        output_filepath , output_json_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER, '.json')
        write_file = open(output_filepath, 'w', encoding='utf-8')
        json_object = json.dumps(json_output_data)
        write_file.write(json_object)
        return output_json_filename