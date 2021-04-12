from repositories import DocumentExporterRepository
from utilities import MODULE_CONTEXT,FileUtilities
import config
from anuvaad_auditor.loghandler import log_info, log_exception
from common.errors import ServiceError,DataEmptyError
import os
import time
from random import randint

output_file_folder  = config.DATA_OUTPUT_DIR

class DocumentExporterService:
    def __init__(self):
        pass
        
    def export_document(self,record_id, user_id, file_type):
        exportRepo=DocumentExporterRepository()
        try:
            log_info("document type %s formation started"%file_type, MODULE_CONTEXT)
            record = exportRepo.get_data_from_ocr_content_handler(record_id,user_id)
            if "data" in record.keys():
                data=record['data']
            else:
                return False
            
            if file_type == 'pdf':
                output_filename=os.path.join(output_file_folder,record_id+'_'+str(randint(100, 999))+".pdf") 
                export_result=exportRepo.create_pdf(data,output_filename,'arial-unicode-ms',34, 4)
                zip_file= FileUtilities.zipfile_creation(export_result)
                log_info("docx file formation done!! filename: %s"%zip_file, MODULE_CONTEXT)
                return zip_file

            if file_type == 'txt':
                log_info("document type %s formation started"%file_type, MODULE_CONTEXT)
                output_filename=os.path.join(output_file_folder,record_id+'_'+str(randint(100, 999))+".pdf")
                export_result=exportRepo.create_pdf(data,output_filename,'arial-unicode-ms',34, 4)
                convert_to_txt= exportRepo.create_pdf_to_text(export_result)
                zip_file= FileUtilities.zipfile_creation(convert_to_txt)
                log_info("docx file formation done!! filename: %s"%zip_file, MODULE_CONTEXT)
                return zip_file

        except Exception as e:
            log_exception("Document type {} saving failed due to exception | {}".format(file_type,str(e)), MODULE_CONTEXT, None)
            raise ServiceError(400, "Document type %s saving failed"%file_type)

    