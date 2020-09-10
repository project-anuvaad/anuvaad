import os
import sys
import time
from pathlib import Path

nb_dir = os.path.split(os.getcwd())[0]

sys.path.append(nb_dir)
sys.path.append(os.path.split(nb_dir)[0])

from services.xml_document_info import (get_xml_info, get_xml_image_info)
from services.get_xml import  create_pdf_processing_paths, extract_pdf_metadata, process_input_pdf
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from src.services import main
from src.services.get_underline import get_underline
from services import get_xml
from src.services.child_text_unify_to_parent import ChildTextUnify
from services.preprocess import prepocess_pdf_regions
from services.get_tables import page_num_correction , get_text_table_line_df
from src.services.ocr_text_utilities import  tesseract_ocr
from src.services.get_response import process_image_df,  process_table_df, df_to_json, process_line_df

from utilities.filesystem import (create_directory, read_directory_files)
import config

import src.utilities.app_context as app_context
app_context.init()

from src.services import main

def run_test(document_directory):
    start_time = time.time()
    
    files = read_directory_files(document_directory, "*.pdf")
    for file in files:
        app_context.application_context = dict({'task_id': 'BM-DUMMY', 'filename': os.path.basename(file)})
        data       = main.DocumentStructure(app_context, os.path.basename(file), "hi", base_dir=document_directory)

    end_time         = time.time()
    elapsed_time     = end_time - start_time
    log_info('Processing files in {}/{}, average per page {}'.format(elapsed_time, len(files), (elapsed_time/len(files))), app_context.application_context)
    

def start():
    base_dir   = os.getcwd()
    input_dir  = os.path.join(base_dir, 'sample-data','input')
    run_test(input_dir)

# start the test
start()