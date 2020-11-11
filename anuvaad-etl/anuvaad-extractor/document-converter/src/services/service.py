from repositories.document_converter import DocumentConversion
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from common.errors import ServiceError

def document_saving(record_id, user_id, download_folder):
    try:
        log_info("document formation started", MODULE_CONTEXT)
        doc_conversion = DocumentConversion(download_folder)
        json_data = doc_conversion.get_data_from_content_handler(record_id, user_id)
        print(json_data)
        dataframes, page_layout = doc_conversion.convert_page_data_into_dataframes(json_data['data'])
        output_filename = doc_conversion.document_creation(dataframes, page_layout, record_id)
        xlsx_filename = doc_conversion.generate_xlsx_file(record_id, json_data)
        #output_filename = doc_conversion.dummy_doc(record_id)
        log_info("document saving completed: %s"%output_filename, MODULE_CONTEXT)
        log_info("xlsx file saving completed: %s"%xlsx_filename, MODULE_CONTEXT)
        return output_filename, xlsx_filename
    except:
        log_exception("Document saving failed", MODULE_CONTEXT, None)
        raise ServiceError(400, "Document saving failed")