
import os
import uuid

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
from PyPDF2 import PdfFileReader, PdfFileWriter
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
    file = open(filepath +'/'+ filename, "rb")
    pdfReader = PyPDF2.PdfFileReader(file)
    page_number = pdfReader.numPages
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