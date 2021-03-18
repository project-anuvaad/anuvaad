from models import DigitalDocumentModel
from utilities import ObjectValidation
import datetime
import uuid
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
import json

validator=ObjectValidation()

class DigitalDocumentRepositories:
    
    def __init__(self):
        self.docModel=DigitalDocumentModel()

    def store(self, userID, jobID, files):
        
        blocks = []
        for file in files:
            block_info={}
            block_info['userID']=userID
            block_info['jobID']=jobID
            block_info['recordID'] = file['file']['name']
            block_info['file_identifier']=file['file']['identifier']
            block_info['file_locale']=file['config']['language']
            block_info['file_type']=file['file']['type']
            block_info['created_on']=datetime.datetime.utcnow()

            pages =file['pages']
            log_info("DigitalDocumentRepo save document for user: {}| record: {}| count of pages received: {}".format(userID,block_info['recordID'],str(len(pages))), AppContext.getContext())#str(page)
                    
            
            try:
                for page in pages:
                    AppContext.addRecordID(block_info['recordID'])
                    log_info("DigitalDocumentRepo for user: {}| record: {}| request: {}".format(userID,block_info['recordID'],"page"), AppContext.getContext())#str(page)
                    page_info                        = {}
                    page_info['page_no']             = page['page_no'] + 1
                    page_info['page_identifier']     = page['identifier']
                    page_info['page_boundingBox']    = page['boundingBox']
                    page_info['page_resolution']     = page['resolution']
                    
                    block_info['page_info'] = page_info
                    block_info['regions'] =None

                    if page['regions']:
                        block_info['regions'] = page['regions']
                        if '_id' in block_info.keys():
                            del block_info['_id']

                        result=self.docModel.store_bulk_blocks(block_info)
                        if result == False:
                            return False                   
            except Exception as e:
                AppContext.addRecordID(block_info['recordID'])
                log_exception('Exception on save document | DigitalDocumentRepo :{}'.format(str(e)), AppContext.getContext(), e)
                pass
       


    def update_words(self, user_id, words):

        for word in words:
            Validation= validator.update_word_validation(word)
            if Validation is not None:
                return Validation

            # data_region_id=word['data_region_id']
            region_id=word['region_id']
            word_id=word['word_id']
            record_id=word['record_id']
            user_word = word['updated_word']

            AppContext.addRecordID(record_id)
            log_info("DigitalDocumentRepo update word request", AppContext.getContext())#str(page)
            region_to_update= self.docModel.get_word_region(user_id,record_id,region_id)

            if region_to_update:
                if region_to_update['identifier']== region_id :

                    region_to_update['updated']=True
                    for data in region_to_update['regions']:
                        for word in data['regions']:
                            if word['identifier']==word_id:
                                print("yesssssss")
                                word['ocr_text']=word['text']
                                word['text']=user_word
                            else:
                                pass
            else:
                return None

            AppContext.addRecordID(record_id)
            log_info("DigitalDocumentRepo update word region :{}".format(str(region_to_update)), AppContext.getContext())
            print(region_to_update)
            if self.docModel.update_word(user_id,record_id,region_id,region_to_update) == False:
                return None
        return True


    def get_pages(self, record_id, start_page=1, end_page=5):

        total_page_count    = self.docModel.get_document_total_page_count(record_id)
        if start_page == 0 and end_page == 0:
            start_page  = 1
            end_page    = total_page_count
        
        if start_page == 0:
            start_page  = 1
        if end_page == 0:
            end_page   = 5
        if start_page > end_page:
            return False

        AppContext.addRecordID(record_id)
        log_info("DigitalDocumentRepo fetching doc by pages for record_id:{}".format(str(record_id)), AppContext.getContext())
        data            = {}
        data['pages']   = []
        for i in range(start_page, end_page+1):
            page_blocks = self.docModel.get_record_by_page(record_id, i)
            data['pages'].append(page_blocks)

        data['start_page']  = start_page
        data['end_page']    = end_page
        data['total']       = total_page_count
        return data