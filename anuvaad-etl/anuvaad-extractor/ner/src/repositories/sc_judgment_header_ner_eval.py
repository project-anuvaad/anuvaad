from __future__ import unicode_literals, print_function

import random
import spacy
from spacy.util import minibatch, compounding
from ast import literal_eval
import os.path
import logging

log = logging.getLogger('file')

class ScNerAnnotation(object):
    # model paths for judgment order and mix of both
    def __init__(self, model_dir_judgment, model_dir_order, mix_model_dir, page_text):
        self.model_dir_judgment = model_dir_judgment
        self.model_dir_order = model_dir_order
        self.mix_model_dir = mix_model_dir
        self.page_text = page_text

    # model loading 
    def loading_model(self, model_dir):
        try:
            if model_dir is not None and os.path.exists(model_dir) is True:
                nlp = spacy.load(model_dir)
                return nlp
        except FileExistsError:
            raise FileExistsError
    
    # entity tagging of page for document model seggregation
    def pagewise_entity_tags(self, doc):
        pagewise_tags = list()
        for ent in doc.ents:
            pagewise_tags.append(ent.label_)
        return pagewise_tags

    # condition check to choose model
    def condition_check(self, sub_list_tag, full_list_tag):
        for x in sub_list_tag:
            if x in full_list_tag:
                return True

    # order document model upload and and tag data
    def order_tagged_data(self):
        nlp = self.loading_model(self.model_dir_order)
        doc = nlp(self.page_text)
        result_order_ner = list()
        for ent in doc.ents:
            annotation_json={
                "annotation_tag" : ent.label_,
                "tagged_value" : ent.text
            }
            result_order_ner.append(annotation_json)
        return {
            "page_ner" : result_order_ner,
            "document_type" : "order_doc"
        }
    # judgment document model upload and and tag data
    def judgment_tagged_data(self):
        nlp = self.loading_model(self.model_dir_judgment)
        doc = nlp(self.page_text)
        result_judgment_ner = list()
        for ent in doc.ents:
            annotation_json={
                "annotation_tag" : ent.label_,
                "tagged_value" : ent.text
            }
            result_judgment_ner.append(annotation_json)
        return {
            "page_ner" : result_judgment_ner,
            "document_type" : "judgment_doc"
        }

    def main(self):
        try:
            nlp = self.loading_model(self.mix_model_dir)
            doc = nlp(self.page_text)
            pagewise_tags = self.pagewise_entity_tags(doc)
            first_page_tag = ['O_ITEM_NO', 'O_COURT_NO', 'O_SECTION']
            last_page_tag = ['O_ORDER_OFFICER','O_ORDER_OFFICER_NAME']
            middle_page_tag = ['O_CORAM','O_HEARING_DATE','O_CONDONATION_DELAY_EXEMPTION','O_COURT_COUNSEL_HEARING','O_COUNSEL_NAME']
            if self.condition_check(first_page_tag, pagewise_tags) is True or self.condition_check(middle_page_tag, pagewise_tags) is True or self.condition_check(last_page_tag, pagewise_tags):
                result_ner = self.order_tagged_data()
                log.info("NER done!!")
                return result_ner
            else:
                result_ner = self.judgment_tagged_data()
                log.info("NER done!!")
                return result_ner
        except Exception as e:
            log.error("error occured during ner operation %s"%e)
