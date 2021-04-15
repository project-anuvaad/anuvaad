from models import DigitalDocumentModel
from utilities import ObjectValidation
from anuvaad_auditor.errorhandler import post_error
from datetime import datetime
import uuid
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
import json

validator=ObjectValidation()

class DigitalDocumentRepositories:
    
    def __init__(self):
        self.docModel=DigitalDocumentModel()

    def store(self, userID, recordID, files):       
        try:
            for file in files:

                # recordID= recordID
                jobID= recordID.split('|')[0]
                fileID=file['file']['identifier']
                file_name=file['file']['name']
                locale=file['config']['language']
                file_type=file['file']['type']

                pages =file['pages']
                log_info("DigitalDocumentRepo save document for user: {}| record: {}| count of pages received: {}".format(userID,recordID,str(len(pages))), AppContext.getContext())
                
                blocks=[] 
            for page in pages:
                block=self.create_regions_from_page(userID,jobID,recordID,fileID,file_name,locale,file_type,page)
                if len(block.keys())>5:
                    blocks.append(block)
                else:
                    return block
            log_info('DigitalDocumentRepo page blocks created for insert, user_id:{}, record_id:{}, block length:{}'.format(userID, recordID,str(len(blocks))), AppContext.getContext())
            result=self.docModel.store_bulk_blocks(blocks)
            if result == False:
                return False                   
        except Exception as e:
            AppContext.addRecordID(recordID)
            log_exception('Exception on save document | DigitalDocumentRepo :{}'.format(str(e)), AppContext.getContext(), e)
            return post_error("Data Missing","Failed to store doc since :{}".format(str(e)),None)
       


    def update_words(self, user_id, words):

        for word in words:
            Validation= validator.update_word_validation(word)
            if Validation is not None:
                return Validation

            page=word['page_no']
            region_id=word['region_id']
            word_id=word['word_id']
            record_id=word['record_id']
            user_word = word['updated_word']

            AppContext.addRecordID(record_id)
            log_info("DigitalDocumentRepo update word request", AppContext.getContext())#str(page)
            region_to_update= self.docModel.get_word_region(user_id,record_id,region_id,page)
            if region_to_update:
                if region_to_update['identifier']== region_id :
                    region_to_update['updated']=True
                    for data in region_to_update['regions']:
                        for word in data['regions']:
                            if word['identifier']==word_id:
                                word['ocr_text']=word['text']
                                word['text']=user_word
                                break
                            else:
                                pass
                                # return post_error("Data Missing","No record with the given user_id,record_id and word_id",None)
            else:
                return post_error("Data Missing","No record with the given user_id,record_id and region_id",None)
            
                
            AppContext.addRecordID(record_id)
            log_info("DigitalDocumentRepo update word region :{}".format(str(region_to_update)), AppContext.getContext())
            print(region_to_update)
            if self.docModel.update_word(user_id,record_id,region_id,region_to_update,page) == False:
                return post_error("Data Missing","Failed to update word since data is missing",None)
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
        if start_page > total_page_count:
            return False

        AppContext.addRecordID(record_id)
        log_info("DigitalDocumentRepo fetching doc by pages for record_id:{}".format(str(record_id)), AppContext.getContext())
        pages           = []
        data            = {}
        data_page       = []
        for i in range(start_page, end_page+1):
            page_block = self.docModel.get_record_by_page(record_id, i)
            if page_block == False:
                return False
            else:
                data_page.append(page_block)
            
    
        pg_block_formated=self.format_page_data(data_page)

        data['pages']       = pg_block_formated
        data['start_page']  = start_page
        data['end_page']    = end_page
        data['total']       = total_page_count
        return data

    
    def create_regions_from_page(self,userID,jobID,recordID,fileID,file_name,locale,file_type,page):
        try:
            AppContext.addRecordID(recordID)
            log_info('DigitalDocumentRepo page blocks creation started for record_id:{}, page_number:{}'.format(recordID,str(page['page_no'])), AppContext.getContext())
            block_info = {}
            block_info['userID']=userID
            block_info['jobID']=jobID
            block_info['recordID']=recordID
            block_info['file_identifier']=fileID
            block_info['file_name']=file_name
            block_info['file_locale']=locale
            block_info['file_type']= file_type
            block_info['created_on']=datetime.utcnow()


            page_info                        = {}
            page_info['page_no']             = page['page_no'] + 1
            page_info['page_identifier']     = page['identifier']
            page_info['page_boundingBox']    = page['boundingBox']
            page_info['page_img_path']       = page['path']
            if 'resolution' in page.keys():
                page_info['page_resolution']     = page['resolution']

            block_info['page_info'] = page_info

            block_info['regions'] = page['regions']
            return block_info
        except Exception as e:
            AppContext.addRecordID(recordID)
            log_exception('Exception on save document | DigitalDocumentRepo :{}'.format(str(e)), AppContext.getContext(), e)
            return post_error("Data Missing","Failed to store doc since data is missing",None)


    def format_page_data(self,page_blocks):
        block1                      = page_blocks[0]
        pages                       = {}
        file                        = {}
        if "file_identifier" in block1:
            file["identifier"]      = block1["file_identifier"]
        file["name"]                = block1["file_name"]
        file["type"]                = block1["file_type"]
        config                      = {}
        config["language"]          = block1["file_locale"]

        pages["file"]               = file
        pages["config"]             = config
        pages["pages"]              = []
        for block in page_blocks:
            if block == None:
                pages["pages"].append(None)
                continue
            block_info              = {}
            block_info["identifier"]= block["page_info"]["page_identifier"]
            block_info["resolution"]= block["page_info"]["page_resolution"]
            block_info["path"]      = block["page_info"]["page_img_path"]
            block_info["boundingBox"]= block["page_info"]["page_boundingBox"]
            block_info["page_no"]   = block["page_info"]["page_no"]
            block_info["regions"]   = block["regions"]

            pages["pages"].append(block_info)
        return pages

            




