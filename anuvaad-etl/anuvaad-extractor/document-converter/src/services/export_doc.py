from repositories import DocumentExporterRepository
from utilities import MODULE_CONTEXT
import config
from anuvaad_auditor.loghandler import log_info, log_exception
from common.errors import ServiceError
import os


class DocumentExporterService:
    def __init__(self):
        pass
        
    def export_document(self,record_id, output_filepath, file_type):
        
        exportRepo=DocumentExporterRepository(output_filepath)
        try:
            log_info("document type %s formation started"%file_type, MODULE_CONTEXT)

            page_data = exportRepo.get_data_from_ocr_content_handler(record_id)
            # print(page_data['data'],"******************")
            if file_type == 'pdf':
                output_filename=os.path.join(output_filepath,record_id+".pdf") 
                export_result=exportRepo.create_pdf(page_data['data'],output_filename,'arial-unicode-ms',34, 4)
                return export_result
            if file_type == 'txt':
                export_result=exportRepo.create_pdf_to_text(download_folder)
                return export_result

        except:
            log_exception("Document type %s saving failed"%file_type, MODULE_CONTEXT, None)
            raise ServiceError(400, "Document type %s saving failed"%file_type)

    