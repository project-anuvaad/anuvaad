from repositories import DocumentExporterRepository
from utilities import MODULE_CONTEXT,FileUtilities
import config
from anuvaad_auditor.loghandler import log_info, log_exception
from common.errors import ServiceError,DataEmptyError
import os
import time
from random import randint
from .libre_converter import convert_to

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
                record_filename=os.path.join(output_file_folder,record_id.rsplit('.',1)[0],record_id+'_'+str(randint(100, 999))+".pdf") 
                os.makedirs(os.path.dirname(record_filename), exist_ok=True) # create extra directory
                export_result=exportRepo.create_pdf(data,record_filename,'arial-unicode-ms',34, 4)
                output_filename = convert_to(output_file_folder, export_result)
                # zip_file= FileUtilities.zipfile_creation(export_result)
                log_info("pdf file formation done!! file folder: %s"%output_filename, MODULE_CONTEXT)
                return os.path.basename(output_filename)

            if file_type == 'txt':
                log_info("document type %s formation started"%file_type, MODULE_CONTEXT)
                output_filename=os.path.join(output_file_folder,str(record_id).replace(".json","")+'_'+str(randint(100, 999))+".txt")
                export_result=exportRepo.write_to_txt(data,output_filename)
                # zip_file= FileUtilities.zipfile_creation(output_filename)
                log_info("txt file formation done!! file folder: %s"%output_filename, MODULE_CONTEXT)
                return os.path.basename(output_filename)

        except Exception as e:
            log_exception("Document type {} saving failed due to exception | {}".format(file_type,str(e)), MODULE_CONTEXT, None)
            raise ServiceError(400, "Document type %s saving failed"%file_type)

    