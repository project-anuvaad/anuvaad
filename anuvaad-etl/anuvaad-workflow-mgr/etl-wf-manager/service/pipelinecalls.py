from anuvaad_auditor import log_info, log_error
import json
import requests
from configs.wfmconfig import app_context
from configs.wfmconfig import DOCUMENT_CONVERTER_SERVER_URL, ZUUL_ROUTES_FU_URL, ZUUL_ROUTES_WFM_URL
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
            log_info(f"Document Export Response {response.status_code}",app_context)
            if response.status_code >=200 and response.status_code <=204:
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


    def upload_files(self,filepath):
        # hit upload_file api and fetch file_id
        log_info("Performing Upload File",app_context)
        try:
            uploadfiles_body = {
                'file': open(filepath,'rb')
            }
            url = ZUUL_ROUTES_FU_URL + "anuvaad-api/file-uploader/v0/upload-file"
            req = requests.post(timeout=120,url=url,files=uploadfiles_body)
            if req.status_code >=200 and req.status_code <=204:
                file_id = req.json()["data"]
                return file_id
            else:
                return None
        except requests.exceptions.RequestException as e:
            log_error(f"Error during document conversion : {traceback.format_exc()}",app_context,e)

    def translate(self,file_name,file_id,payload,headers):

        request_headers = {
            "x-user-id": headers["userID"],
            "x-org-id": headers["orgID"],
            "x-roles": headers["roles"],
            "x-request-id": headers["requestID"],
            "x-session-id": headers["sessionID"]
        }
    
        payload["jobName"] = file_name
        payload["files"][0]["path"] = file_id
        payload["files"][0]["type"] = file_id.split()[-1]

        # Perform translation
        log_info(f"Performing Translation {file_id}",app_context)
        asyncwf_body = payload
        try:
            url = ZUUL_ROUTES_WFM_URL+"anuvaad-etl/wf-manager/v1/workflow/async/initiate"
            req = requests.post(timeout=120,url=url,json=asyncwf_body, headers=request_headers)
            if req.status_code >=200 and req.status_code <=204:
                resp = req.json()
                return resp
            else:
                return None
        except requests.exceptions.RequestException as e:
            log_error(f"Error during file download : {traceback.format_exc()}",app_context,e)

