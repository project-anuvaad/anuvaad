from repositories.document_converter import DocumentConversion
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from common.errors import ServiceError

def document_saving(record_id, user_id, download_folder, file_type):
    try:
        log_info("document type %s formation started"%file_type, MODULE_CONTEXT)
        doc_conversion = DocumentConversion(download_folder)
        json_data = doc_conversion.get_data_from_content_handler(record_id, user_id)
        dataframes, page_layout = doc_conversion.convert_page_data_into_dataframes(json_data['data'])
        if file_type == 'docx':
            output_filename = doc_conversion.document_creation(dataframes, page_layout, record_id)
            return output_filename
        elif file_type == 'xlsx':
            xlsx_filename = doc_conversion.generate_xlsx_file(record_id, json_data)
            return xlsx_filename
        elif file_type == 'txt':
            txt_filename = doc_conversion.create_translated_txt_file(record_id, dataframes, page_layout)
            return txt_filename
    except:
        log_exception("Document type %s saving failed"%file_type, MODULE_CONTEXT, None)
        raise ServiceError(400, "Document type %s saving failed"%file_type)