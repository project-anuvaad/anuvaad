from repositories.document_converter import DocumentConversion
import logging

log = logging.getLogger()

def document_saving(record_id, user_id, download_folder):
    doc_conversion = DocumentConversion(download_folder)
    pages = doc_conversion.get_data_from_content_handler(record_id, user_id)
    dataframes, page_layout = doc_conversion.convert_page_data_into_dataframes(pages)
    doc_conversion.document_creation(dataframes, page_layout, record_id)
    log.info("doc saving done")