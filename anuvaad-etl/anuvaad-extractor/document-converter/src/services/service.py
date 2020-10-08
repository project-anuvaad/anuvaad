from repositories.document_converter import DocumentConversion
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from common.errors import ServiceError

def document_saving(record_id, user_id, download_folder):
    try:
        log_info("document formation started", MODULE_CONTEXT)
        doc_conversion = DocumentConversion(download_folder)
        pages = doc_conversion.get_data_from_content_handler(record_id, user_id)
        dataframes, page_layout = doc_conversion.convert_page_data_into_dataframes(pages)
        output_filename = doc_conversion.document_creation(dataframes, page_layout, record_id)
        #output_filename = doc_conversion.dummy_doc(record_id)
        log_info("document saving completed: %s"%output_filename, MODULE_CONTEXT)
        return output_filename
    except:
        log_exception("Document saving failed", MODULE_CONTEXT, None)
        raise ServiceError(400, "Document saving failed")