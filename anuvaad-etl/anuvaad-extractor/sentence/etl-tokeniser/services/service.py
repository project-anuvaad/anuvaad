from repositories.eng_sentence_tokeniser import AnuvaadEngTokenizer
from repositories.hin_sentence_tokeniser import AnuvaadHindiTokenizer
from repositories.kannada_sentence_tokeniser import AnuvaadKannadaTokenizer
from repositories.tamil_sentence_tokeniser import AnuvaadTamilTokenizer
from repositories.malayalam_sentence_tokeniser import AnuvaadMalayalamTokenizer
from repositories.general_tokeniser import AnuvaadTokenizer
from errors.errors_exception import ServiceError
from utilities.utils import FileOperation
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_exception
import re
import json
import requests
import config
import uuid

file_ops = FileOperation()
class Tokenisation(object):
    def __init__(self, DOWNLOAD_FOLDER, input_json_data):
        self.DOWNLOAD_FOLDER = DOWNLOAD_FOLDER
        self.input_json_data = input_json_data 

    # tokenising text in respective language 
    def tokenisation_core(self, paragraph_data, text_locale):
        tokenised_text = []
        for paragraph in paragraph_data:
            if paragraph is not None:
                try:
                    paragraph = self.remove_extra_spaces(paragraph)
                    if text_locale == 'en':
                        tokenised_sentence_data = AnuvaadEngTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'hi' or text_locale == 'mr':
                        tokenised_sentence_data = AnuvaadHindiTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'kn':
                        tokenised_sentence_data = AnuvaadKannadaTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'ta':
                        tokenised_sentence_data = AnuvaadTamilTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'ml':
                        tokenised_sentence_data = AnuvaadMalayalamTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                except:
                    log_exception("Received error in this text :  %s"%(paragraph), self.input_json_data, None)
                    raise ServiceError(400, "Tokenisation failed. Something went wrong during tokenisation.")
        return tokenised_text
    
    # after successful tokenisation writting tokenised sentences into a text file
    def writing_tokenised_sentence_in_file(self, tokenised_data, output_path):
        log_info("writing_tokenised_sentence_in_file : File write for tokenised sentence started", self.input_json_data)
        write_file = open(output_path, 'w', encoding='utf-16')
        for item in tokenised_data:
            write_file.write("%s\n"%item)
        log_info("writing_tokenised_sentence_in_file : File write for tokenised sentence completed", self.input_json_data)

    # calling service function to convert paragragh into tokenised sentences for their respective language
    def tokenisation_response(self, input_file_data, in_locale, index):
        try:
            output_filepath , output_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER, '.txt')
            tokenised_data = self.tokenisation_core(input_file_data, in_locale)
            self.writing_tokenised_sentence_in_file(tokenised_data, output_filepath)
            return output_filename 
        except:
            log_exception("tokenisation_response : Error occured during output file creation", self.input_json_data, None)
            raise ServiceError(400, "Tokenisation failed. Something went wrong during output file creation.")

    def adding_tokenised_text_blockmerger(self, input_json_data_pagewise, in_locale, page_id):
        try:
            blocks = input_json_data_pagewise['text_blocks']
            if blocks is not None:
                for block_id, item in enumerate(blocks):
                    text_data = item['text']
                    tokenised_text = self.tokenisation_core([text_data], in_locale)
                    item['tokenized_sentences'] = [self.making_object_for_tokenised_text(text) for i, text in enumerate(tokenised_text)]
            return input_json_data_pagewise
        except:
            log_error("Keys in block merger response changed or tokenisation went wrong.", self.input_json_data, None) 
            raise ServiceError(400, "Tokenisation failed. Keys in block merger response changed or tokenisation went wrong.")

    def writing_json_file_blockmerger(self, index, json_output_data):
        output_filepath , output_json_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER, '.json')
        write_file = open(output_filepath, 'w', encoding='utf-8')
        json_object = json.dumps(json_output_data)
        write_file.write(json_object)
        log_info("Service : Json file write done!", self.input_json_data)
        return output_json_filename

    def making_object_for_tokenised_text(self, text):
        object_text = {
            "src" : text,
            "s_id" : str(uuid.uuid4())
        }
        return object_text

    def sending_data_to_content_handler(self, job_id, user_id, tokenised_block_json):
        try:
            json_data = {"job_id" : job_id, "pages" : tokenised_block_json['result'], "file_locale" : tokenised_block_json['file_locale']}
            headers = {"userid": user_id ,"Content-Type": "application/json"}
            log_info("Intiating request to save data", self.input_json_data)
            response = requests.post(config.internal_gateway_url_save_data, json = json_data, headers = headers)
            log_info("tokenised block merger response saved in db " + str(response.headers) + str(response.content), self.input_json_data)
        except Exception as e:
           log_exception("Can not save content in content handler.", self.input_json_data, e)
    
    # precleaning before tokenisation
    def remove_extra_spaces(self,text):
        text = text.strip()
        text = text.replace("\\", '')
        text = re.sub('\u200d|\u200c', '', text)
        text = re.sub('[\s]{1,}', ' ', text)
        return text

    # def getting_incomplete_text(self, input_data_file):
    #     for page_idx, page_data in enumerate(input_data_file):
    #         page_data_blocks = page_data['text_blocks']
    #         print("no. of blocks: ", len(page_data_blocks))
    #         for i, block in enumerate(page_data_blocks):
    #             tok_sentence = block['tokenized_sentences']
    #             if i < len(page_data_blocks) -1:
    #                 print("i    ",i, "same page")
    #                 next_block = page_data_blocks[i+1]
    #                 last_tok_object = tok_sentence[len(tok_sentence)-1]
    #                 if last_tok_object['src_text'][-1] != '.':
    #                     print(" --- last-----",last_tok_object ,last_tok_object['src_text'])
    #             else:
    #                 next_block = page_data_blocks[i]
    #                 print(i, "------NEED next page---------", len(page_data_blocks))
    #                 next_tok_sentence = next_block['tokenized_sentences'][0]['src_text']
    #                 print("next :::: ###    ", next_tok_sentence)
    #                 if page_idx < len(input_data_file) -1:
    #                     next_page_data = input_data_file[page_idx + 1]
    #                     first_block_tok_text = next_page_data['text_blocks'][0]['tokenized_sentences'][0]['src_text']
    #                     if re.match(r'[a-zA-z]', first_block_tok_text, re.IGNORECASE) is None:
    #                         second_block_tok = next_page_data['text_blocks'][1]['tokenized_sentences']
    #                         obj_added_to_be_last_page = second_block_tok.pop(0)
    #                         text_send_last_page_incomplete_text = obj_added_to_be_last_page['src_text']
    #                         print("text transfered  ---  ", text_send_last_page_incomplete_text)