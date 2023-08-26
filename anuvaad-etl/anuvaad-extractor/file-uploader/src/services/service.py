
import os
import uuid
import io

import config
import pandas as pd
from flask import request
from pathlib import Path
# from docx2pdf import convert

# from libreoffice import LibreOffice

from datetime import datetime
import PyPDF2
import subprocess
from models.user_files import UserFiles
from PyPDF2 import PdfReader, PdfWriter

from anuvaad_auditor.loghandler import log_error
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_exception
from models.response import CustomResponse
from models.status import Status
import requests
import json
from urllib.parse import urljoin


ALLOWED_FILE_TYPES = config.ALLOWED_FILE_TYPES
ALLOWED_FILE_EXTENSIONS = config.ALLOWED_FILE_EXTENSIONS

from utilities.s3_utils import S3BucketUtils
from utilities.fetch_content import FetchContent
# from resources.file_handler import FileUploader
# from resources.file_handler import FileUploader

def is_file_empty(file_bfr, file_path):
    file = file_bfr
    file_name = file.filename
    mime_type = file.mimetype
    if mime_type in ['text/csv']:
        csv_file = pd.read_csv(file_path)
        return csv_file.empty
    elif mime_type in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
        xls_file = pd.read_excel(file, engine='openpyxl')
        return xls_file.empty
    else:
        return False



def page_restrictions_pdf(filename):
    # file = open(config.download_folder + filename) 
    filepath = config.download_folder
    with open(filepath+'/'+filename, 'rb') as pdf_file:
         # Create a PDF reader object
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file.read()))
        page_number = len(pdf_reader.pages)
        print(page_number)
    return page_number

# def upload_doc(filename): #, timeout=None
#     filepath = config.download_folder
#     file_Ext = filename.split('.')[1]
#     print(filepath+'/'+filename)
#     # args = ['unoconv','-f', 'pdf', filepath+'/'+filename]
#     # print('args',args)
#     args = ["libreoffice", '--headless', '--convert-to', 'pdf', '--outdir', filepath,
#                     filepath+'/'+filename]
#     s = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE) #, timeout=timeout
#     print("test5:",s)
#     print(filename)
#     filename = filename.split('.')[0]
#     filename = filename+'.pdf'
#     print('test7:',filepath+'/'+filename)
# #    if filename in filepath:
#     print('fi-------:', filename)
#     file = open(filepath + '/' + filename, "rb")
#     print(file)
#     pdfReader = PyPDF2.PdfFileReader(file)
#     page_number = pdfReader.numPages #len(pdfReader.pages)
#     print(page_number)
#     return page_number

## this function is to reduce the number of pages. currently not in use
def reduce_page(filenames,filepath,file_extension):
    # filepath = filepath
    print(f"check file ={filenames,filepath}")
    # filename = file_name
    input_pdf = PdfFileReader(filepath)
    i = 1
    page_limit = 20
    j = 0

    while (i+20<page_limit):
        j+=1
        pdf_writer = PdfFileWriter()
        for n in range(i, i+20):
            page = input_pdf.getPage(n)
            pdf_writer.addPage(page)
        filepath = config.download_folder + filenames + str(j) + '.' + file_extension
        print(f"my_path:={filepath}")
        with Path(filepath).open(mode="wb") as output_file:
            pdf_writer.write(output_file)
        filepath = filenames+ str(j) +"."+ file_extension
        # csvwriter.writerow([new_path, src_lng, tgt_lng, i, i+25, domain, col])
        i+=20
    j+=1
    pdf_writer = PdfFileWriter()
    # for the remaining last <25 pages.
    for n in range (i, page_limit):
        page = input_pdf.getPage(n)
        pdf_writer.addPage(page)
    filepath = config.download_folder +'/'+ filenames +file_extension
    with Path(filepath).open(mode="wb") as output_file:
        pdf_writer.write(output_file)
    filepath =  config.download_folder + '/'+ filenames +file_extension #filename.ilename+ str(j) +"."+filename.file_extension
    return filepath

def file_autoupload_s3(job_id,src_file,record_id,userid):
    try:
        headers = {"Content-Type": "application/json; charset=utf-8"}
        doc_converter = urljoin(config.DOC_CONVERTER, config.DOC_CONVERTER_ENDPOINT)
        body = json.dumps({"record_id":record_id,"user_id":userid,"file_type":"txt,xlsx"})
        doc = requests.post(doc_converter,data=body,headers=headers)
        if doc.status_code == 200:
            docs = doc.json()
            txt = docs['translated_document']['txt']
            xlsx = docs['translated_document']['xlsx']
            txt_path = os.path.join(config.download_folder, txt)
            xlsx_path =os.path.join(config.download_folder, xlsx)
            src_filename = str(src_file)
            src_file_path = os.path.join(config.download_folder, src_filename)
            if os.path.exists(txt_path) and os.path.exists(xlsx_path) :
                if os.path.exists(src_file_path):
                    file_names= [xlsx, txt,src_filename]
                else:
                    file_names= [xlsx, txt]
                zip_name =str(job_id)+".zip"
                s3_bucket = S3BucketUtils()
                s3_bucket.compress(file_names,zip_name)
                zip_path = os.path.join(config.download_folder, zip_name)
                upload_to_s3 = s3_bucket.upload_file(zip_path,None)
                fc_obj = FetchContent()
                fc_obj.store_reference_link(job_id=job_id, location=upload_to_s3)
                log_info("SUCCESS: File Uploaded to s3-- " ,None)
                os.remove(zip_path)
                res = CustomResponse(Status.SUCCESS.value, str(upload_to_s3))
                return res.getres()
            else:
                log_info("ERROR: file not found -- " ,None)
                res = CustomResponse(Status.ERROR_NOTFOUND_FILE.value, None)
                return res.getresjson(), 400
        else:
            log_info("ERROR: file not found -- " ,None)
            res = CustomResponse(Status.ERROR_NOTFOUND_FILE.value, None)
            return res.getresjson(), 400
    except Exception as e:
        log_exception("Exception while uploading the file: " ,None, str(e))
        res = CustomResponse(Status.FAILURE.value, None)
        return res.getresjson(), 500
    
def file_upload_s3(f,src_file,job_id):
    try:
        mime_type = f.mimetype
        log_info("Filename: " + str(f.filename),None)
        log_info("File MIME Type: " + str(mime_type),None)
        file_real_name, file_extension = os.path.splitext(f.filename)
        fileallowed = False
        # filename = str(uuid.uuid4()) + file_extension
        src_filename = str(src_file)
        src_file_path = os.path.join(config.download_folder, src_filename)
        if os.path.exists(src_file_path):
            filename = str(job_id) +"_user_target"+ file_extension
            filepath = os.path.join(config.download_folder, filename)
            for allowed_file_extension in ALLOWED_FILE_EXTENSIONS:
                if file_extension.endswith(allowed_file_extension):
                    fileallowed = True
                    break
            if fileallowed is False:
                if mime_type in ALLOWED_FILE_TYPES:
                    fileallowed = True

            if fileallowed:
                f.save(filepath)
                file_size = os.stat(filepath).st_size
                file_size_in_MB = file_size / (1024 * 1024)
                if file_size_in_MB > eval(str(config.MAX_UPLOAD_SIZE)):
                    os.remove(filepath)
                    res = CustomResponse(Status.ERROR_FILE_SIZE.value, None)
                    return res.getresjson(), 400
                # if is_file_empty(f, filepath) or file_size <= 0:
                if file_size <= 0:
                    os.remove(filepath)
                    res = CustomResponse(Status.FILE_BLANK_ERROR.value, None)
                    return res.getresjson(), 400

                # userfile = UserFiles(created_by=request.headers.get('x-user-id'),
                #                     filename=filename, file_real_name=file_real_name + file_extension,
                #                     created_on=datetime.now())
                # userfile.save()

                zip_name =str(job_id)+".zip"
                file_names= [src_filename, filename]
                s3_bucket = S3BucketUtils()
                s3_bucket.compress(file_names,zip_name)
                zip_path = os.path.join(config.download_folder, zip_name)
                upload_to_s3 = s3_bucket.upload_file(zip_path,None)
                fc_obj = FetchContent()
                fc_obj.store_reference_link(job_id=job_id, location=upload_to_s3)
                log_info("SUCCESS: File Uploaded -- " + str(f.filename),None)
                os.remove(zip_path)
                res = CustomResponse(Status.SUCCESS.value, str(upload_to_s3))
                return res.getres()
            else:
                log_info("ERROR: Unsupported File -- " + str(f.filename),None)
                res = CustomResponse(Status.ERROR_UNSUPPORTED_FILE.value, None)
                return res.getresjson(), 400
    except Exception as e:
        log_exception("Exception while uploading the file: " ,None, str(e))
        res = CustomResponse(Status.FAILURE.value, None)
        return res.getresjson(), 500
