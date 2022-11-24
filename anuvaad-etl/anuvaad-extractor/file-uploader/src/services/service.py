
import os
import uuid

import config
import pandas as pd
from flask import request
from pathlib import Path

from datetime import datetime
import PyPDF2

from models.user_files import UserFiles
from PyPDF2 import PdfFileReader, PdfFileWriter
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

##check for private users


# value = 2

# def private_user(filename, file_path):
#     file = filename
#     file_path = os.path.join(config.download_folder, filename)
#     userfile = UserFiles(created_by=request.headers.get('x-user-id'),
#                             filename=filename, file_real_name=file_real_name + file_extension,
#                             created_on=datetime.now())

def page_restrictions_pdf(filename):
    # file = open(config.download_folder + filename) 
    file = open(config.download_folder +'/'+ filename, "rb")
    pdfReader = PyPDF2.PdfFileReader(file)
    page_number = pdfReader.numPages
    return page_number

# def upload_per_day(filename):
    

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