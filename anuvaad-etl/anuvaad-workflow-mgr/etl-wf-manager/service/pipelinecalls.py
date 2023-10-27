from anuvaad_auditor import log_info, log_error
import json
import requests
from configs.wfmconfig import app_context
from configs.wfmconfig import DOCUMENT_CONVERTER_SERVER_URL, ZUUL_ROUTES_FU_URL
import traceback

class PipelineCalls:

    def document_export(self,user_id,record_id,filetype,headers):
        log_info("Performing Document Export",app_context)
        payload = json.dumps({
        "record_id": record_id,
        "user_id": user_id,
        "file_type": filetype
        })
        headers = {
            'Content-Type': 'application/json'
        }
        try:
            url = DOCUMENT_CONVERTER_SERVER_URL + "anuvaad-etl/document-converter/v0/document-exporter"
            response = requests.request("POST", url, headers=headers, data=payload)
            log_info(f"Document Export Response {response.status_code}")
            if response.status_code >=200 and response.status_code <=204:
                log_info("Document Export Response ",response.json())
                return response.json()["translated_document"]
        except Exception as e:
            log_error(f"Error during document conversion : {traceback.format_exc()}",app_context,e)

    def download_file(self,download_path):
        log_info("Performing File Download",app_context)
        url = ZUUL_ROUTES_FU_URL + "anuvaad-api/file-uploader/v0/serve-file?filename=" + download_path
        try:
            response = requests.request("GET", url)
            if response.status_code >=200 and response.status_code <=204:
                return response.content
        except Exception as e:
            log_error(f"Error during file download : {traceback.format_exc()}",app_context,e)
