import uuid
from indicnlp.tokenize import sentence_tokenize

from repositories.eng_sentence_tokeniser import AnuvaadEngTokenizer
from repositories.hin_sentence_tokeniser import AnuvaadHindiTokenizer
from repositories.kannada_sentence_tokeniser import AnuvaadKannadaTokenizer
from repositories.tamil_sentence_tokeniser import AnuvaadTamilTokenizer
from repositories.malayalam_sentence_tokeniser import AnuvaadMalayalamTokenizer
from repositories.telugu_senetence_tokeniser import AnuvaadTeluguTokenizer
from repositories.bengali_sentence_tokeniser import AnuvaadBengaliTokenizer
from repositories.odia_sentence_tokeniser import AnuvaadOdiaTokenizer
from repositories.gujarati_sentence_tokeniser import AnuvaadGujaratiTokenizer
from repositories.punjabi_sentence_tokenizer import AnuvaadPunjabiTokenizer
from repositories.urdu_sentence_tokenizer import AnuvaadUrduTokenizer

from repositories.general_tokeniser import AnuvaadTokenizer
from errors.errors_exception import ServiceError
from utilities.utils import FileOperation
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_exception
import copy
import re
import json
import requests
import config

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
                    elif text_locale == 'te':
                        tokenised_sentence_data = AnuvaadTeluguTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'bn' or text_locale == 'as':
                        tokenised_sentence_data = AnuvaadBengaliTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'or':
                        tokenised_sentence_data = AnuvaadOdiaTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'gu':
                        tokenised_sentence_data = AnuvaadGujaratiTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'pa':
                        tokenised_sentence_data = AnuvaadPunjabiTokenizer().tokenize(paragraph)
                        tokenised_text.extend(tokenised_sentence_data)
                    elif text_locale == 'ur':
                        tokenised_sentence_data = AnuvaadUrduTokenizer().tokenize(paragraph)
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

    # calling core tokenisation service function to convert paragragh into tokenised sentences for their respective language for txt files
    def tokenisation_response(self, input_file_data, in_locale, index):
        try:
            log_info("txt file tokenisation started.", self.input_json_data)
            output_filepath , output_filename = file_ops.output_path(index, self.DOWNLOAD_FOLDER, '.txt')
            tokenised_data = self.tokenisation_core(input_file_data, in_locale)
            self.writing_tokenised_sentence_in_file(tokenised_data, output_filepath)
            return output_filename 
        except:
            log_exception("tokenisation_response : Error occured during output file creation", self.input_json_data, None)
            raise ServiceError(400, "Tokenisation failed. Something went wrong during output file creation.")

    # tokenising each block text of pagewise data of document with their respective languages.
    def adding_tokenised_text_blockmerger(self, input_json_data_pagewise, in_locale, page_id):
        try:
            log_info("text block tokenisation started for page : %s"%(page_id+1), self.input_json_data)
            if not input_json_data_pagewise.get('valid_page', False):
                log_info("::INVALID PAGE:: text block tokenization skipped because for Invalid page : %s" %(page_id), self.input_json_data)
                return input_json_data_pagewise
            blocks = input_json_data_pagewise['regions']
            if blocks is not None:
                for block_id, item in enumerate(blocks):
                    if item.get('class') in ['PARA'] and item.get('valid_para', False):
                        text_data = item['text']
                        tokenised_text = self.tokenisation_core([text_data], in_locale)
                        item['tokenized_sentences'] = [self.making_object_for_tokenised_text(text) for i, text in enumerate(tokenised_text)]
                    elif item.get('class') in ['TABLE'] and item.get('valid_para', False):
                        table_data = item['text']
                        cell_data = table_data.split('<END_OF_CELL>')
                        tokenised_text = []
                        for text_data in cell_data:
                            tokenised_text.extend(self.tokenisation_core([text_data], in_locale))
                        item['tokenized_sentences'] = [self.making_object_for_tokenised_text(text) for i, text in enumerate(tokenised_text)]
                    elif item.get('class') in ['HEADER', 'FOOTER'] and item.get('valid_para', False):
                        data = item['text']
                        item['tokenized_sentences'] = [self.making_object_for_tokenised_text(data)]
                    elif not item.get('valid_para', False):
                        log_info("::INVALID PARA:: text block tokenization skipped because for Invalid para: %s page: %s" %(block_id, page_id), self.input_json_data)
                        continue

            return input_json_data_pagewise
        except:
            log_error("Keys in block merger response changed or tokenisation went wrong.", self.input_json_data, None) 
            raise ServiceError(400, "Tokenisation failed. Keys in block merger response changed or tokenisation went wrong.")

    # unit element of tokenised sentences output for block level text 
    def making_object_for_tokenised_text(self, text):
        object_text = {
            "src" : text,
            "s_id" : str(uuid.uuid4()),
            "word_count" : len(text.split())
        }
        return object_text
    
    # precleaning before tokenisation
    def remove_extra_spaces(self,text):
        text = text.strip()
        text = text.replace("\\", '')
        text = re.sub('\u200d|\u200c|\n|\r\n', '', text)
        text = re.sub('[\s]{1,}', ' ', text)
        return text

    # merging incomplete sentence of last block to next text block
    def getting_incomplete_text_merging_blocks(self, input_data_file):
        try:
            log_info("incomplete sentence identification and merging across pages started", self.input_json_data)
            for page_idx, page_data in enumerate(input_data_file):
                log_info("Current Page: {}".format(page_idx), self.input_json_data)
                # page_width = page_data.get("page_width")
                # page_height = page_data.get("page_height")
                # if (page_height is not None) and (page_width is not None):
                #     if page_height < page_width: #If this condition is true means this is a PPT file where width will be more than the height
                #         log_info("Skipping logic for the merging incomplete sentence of last block to next text block", self.input_json_data)
                #         continue
                if not page_data.get('valid_page', False):
                    log_info("::SKIPPED:: Incomplete text merging because of invalid page for page: %s"%(page_idx), self.input_json_data)
                    continue
                page_data_blocks = page_data['regions']
                if page_idx+1 < len(input_data_file):
                    last_text_block_idx = self.get_last_text_block_with_text(page_data_blocks)
                    first_text_block_next_page = self.get_first_text_block_with_text(input_data_file[page_idx+1])
                    log_info("index of, last text block of current page: {}, first text block of next page: {}".format(last_text_block_idx, \
                        first_text_block_next_page), self.input_json_data)
                    try:
                        if last_text_block_idx != None and first_text_block_next_page != None:
                            if not page_data_blocks[last_text_block_idx]['text'].strip().endswith(('.',':','!','?','”',')')) \
                            and input_data_file[page_idx+1]['regions'][first_text_block_next_page]['text'] != None \
                            and len(page_data_blocks[last_text_block_idx]['tokenized_sentences']) >= 1\
                            and len(input_data_file[page_idx+1]['regions'][first_text_block_next_page]['tokenized_sentences']) != 0:

                                last_tokenised_sentence_idx = len(page_data_blocks[last_text_block_idx]['tokenized_sentences']) - 1
                                last_sen = page_data_blocks[last_text_block_idx]['tokenized_sentences'][last_tokenised_sentence_idx]['src']
                                first_sen = input_data_file[page_idx+1]['regions'][first_text_block_next_page]['tokenized_sentences'][0]['src']

                                if len(last_sen) < len(first_sen):
                                    input_data_file[page_idx+1]['regions'][first_text_block_next_page]['tokenized_sentences'][0]['src'] = \
                                        page_data_blocks[last_text_block_idx]['tokenized_sentences'][last_tokenised_sentence_idx]['src'] + ' ' + \
                                            input_data_file[page_idx+1]['regions'][first_text_block_next_page]['tokenized_sentences'][0]['src']
                                    del page_data_blocks[last_text_block_idx]['tokenized_sentences'][last_tokenised_sentence_idx]
                                else:
                                    page_data_blocks[last_text_block_idx]['tokenized_sentences'][last_tokenised_sentence_idx]['src'] = \
                                        page_data_blocks[last_text_block_idx]['tokenized_sentences'][last_tokenised_sentence_idx]['src'] + ' ' + \
                                            input_data_file[page_idx+1]['regions'][first_text_block_next_page]['tokenized_sentences'][0]['src']
                                    del input_data_file[page_idx+1]['regions'][first_text_block_next_page]['tokenized_sentences'][0]
                    except:
                        log_exception("core logic of merging failed", self.input_json_data, None)
                        raise ServiceError(400, "core logic of merging failed")
            return input_data_file
        except:
            log_error("Merging across pages failed.", self.input_json_data, None) 
            raise ServiceError(400, "Merging across pages failed.")

    # If for a paragraph the attribute is not in FOOTER, "", TABLE it is a valid paragraph
    def is_valid_paragraph(self, block):
        try:
            if block['class'] is not None and type(block['class']) is str and block.get('valid_para', False):
                if block.get('class') in ['PARA']:
                    if len(block.get('text', '')) != 0:
                        return True
            return False
        except:
            log_exception("Finding if valid paragraph failed", self.input_json_data, None)
            raise ServiceError(400, "Finding if valid paragraph failed")

    # getting last text block of a page other than footer, header, table

    def get_last_text_block_with_text(self, page_data):
        try:
            last_text_block_idx = None
            for block_idx, block in enumerate(page_data):
                if self.is_valid_paragraph(block):
                    last_text_block_idx = block_idx

            return last_text_block_idx
        except:
            log_exception("Finding last text block failed", self.input_json_data, None)
            raise ServiceError(400, "Finding last text block failed")

    # getting first text block of a page other than footer, header, table 
    def get_first_text_block_with_text(self, page_data):
        try:
            for block_idx, block in enumerate(page_data['regions']):
                if self.is_valid_paragraph(block):
                    return block_idx
        except:
            log_exception("Finding First text block failed", self.input_json_data, None)
            raise ServiceError(400, "Finding first text block failed")

    def get_all_the_paragraphs(self, page_data):
        try:
            log_info(":: TOKENIZATION OCR GET ALL PARA PROCESS STARTED::", self.input_json_data)
            pages = page_data['outputs'][0]['pages']
            for page_id, page in enumerate(pages):
                page['valid_page'] = True
                log_info(":: GET ALL PARA PROCESS STARTED For >>>>>>>>>> PAGE: %s"%(page_id), self.input_json_data)
                try:
                    for para_id, PARA in enumerate(page['regions']):
                        PARA['valid_para'] = True
                        log_info(":: GET ALL PARA PROCESS STARTED For >>>PAGE: %s  >>> PARA: %s" %(page_id, para_id), self.input_json_data)
                        if PARA.get('class') in ['PARA', 'TABLE', 'HEADER', 'FOOTER']:
                            txt = ''
                            try:
                                for line_no, LINE in enumerate(PARA['regions']):
                                    if LINE.get('class') in ['LINE', 'CELL']:
                                        for word_no, WORD in enumerate(LINE['regions']):
                                            if WORD.get('class') in ['WORD']:
                                                if len(str(WORD['text'])) == 0:
                                                    continue
                                                if txt.endswith('<END_OF_CELL>'):
                                                    txt = txt + str(WORD['text'])
                                                elif len(str(WORD['text'])) == 1:
                                                    if str(WORD['text']) in ('.', ':', '!', '?', ',', '|', '||', ';', '%', '*', '-', '/', '}', ')', ']'): #EX: 100%, following table:, Supreme Court (SC)
                                                        txt = txt + str(WORD['text'])
                                                    else:
                                                        txt = txt + ' ' + str(WORD['text'])
                                                else:
                                                    if txt.endswith(('-', '/', '{', '[', '(')): #EX: fifty-eight, dates: 07/08/1993, Supreme Court (SC)
                                                        txt = txt + str(WORD['text'])
                                                    else:
                                                        txt = txt + ' ' + str(WORD['text'])

                                        if LINE.get('class') in ['CELL']:
                                            txt = txt + '<END_OF_CELL>'
                                PARA['text'] = txt.strip()
                            except Exception as para_exception:
                                PARA['valid_para'] = False
                                log_exception("RETRIVING PARA ERROR:: Retriving data failed for PAGE: %s , PARA: %s" %(page_id, para_id),
                                          self.input_json_data, para_exception)
                except Exception as page_exception:
                    page['valid_page'] = False
                    log_exception("RETRIVING PAGE EXCEPTION:: Retriving data failed for PAGE: %s"%(page_id), self.input_json_data, page_exception)

            return pages
        except:
            log_exception("Retriving paragraphs from input failed", self.input_json_data, None)
            raise ServiceError(400, "Retriving paragraphs from input failed")

    def save_page_res(self, res, file_name):
        try:
            tmp_file = copy.deepcopy(res)
            del tmp_file['input']
            tmp_file['files'] = res['outputs']
            del tmp_file['outputs']
            json_file_name = file_name
            for file in [tmp_file]:
                recordID = file['jobID'] + '|' + json_file_name
                page_idx = 0
                total_pages = len(file['files'][0]['pages'])
                file['files'][0]['config'] = copy.deepcopy(file['files'][0]['config']['OCR'])
                save_file = copy.deepcopy(file)
                save_file['recordID'] = recordID
                log_info("started saving data to database with record id: " + str(recordID),
                         self.input_json_data)
                while page_idx < total_pages:
                    pages = file['files'][0]['pages'][page_idx:page_idx + config.SAVE_NO_PAGE]
                    save_file['files'][0]['pages'] = pages
                    page_idx = page_idx + config.SAVE_NO_PAGE
                    rsp = requests.post(config.SAVE_URL, json=save_file)
                log_info("successfully saved data to database with record id: " + str(recordID), self.input_json_data)
        except Exception as e:
            log_exception("Error occured during saving page response", self.input_json_data, e)
