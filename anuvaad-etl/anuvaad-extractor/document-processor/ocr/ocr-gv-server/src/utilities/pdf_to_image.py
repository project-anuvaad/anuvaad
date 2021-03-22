import config
import time
import pdf2image
import uuid, os
import pandas as pd
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import src.utilities.app_context as app_context

def create_directory(path):
    try:
        os.mkdir(path)
        return True
    except FileExistsError as fe_error:
        return True
    except OSError as error:
        log_info('unable to create directory : {}'.format(path), app_context.application_context)

    return False


def create_pdf_processing_paths(filename, base_dir):

    working_dir = os.path.join(base_dir, os.path.splitext(filename)[0] + '_' + str(uuid.uuid4()))
    ret         = create_directory(working_dir)

    if ret == False:
        log_error('unable to create working directory {}'.format(working_dir), app_context.application_context, None)
        return None, False

    log_info('created processing directories successfully {}'.format(working_dir), app_context.application_context)

    return working_dir, True

def extract_image_paths_from_pdf(filepath, workspace_output_dir):
    '''
        function extracts image per page of the given PDF file.
        return list of path of extracted images 
    '''
    working_dir     = os.path.join(workspace_output_dir, 'images')
    image_filename  = os.path.splitext(os.path.basename(filepath))[0]
    
    create_directory(working_dir)
    paths           = pdf2image.convert_from_path(filepath, dpi=config.EXRACTION_RESOLUTION, output_file=image_filename, output_folder=working_dir, fmt='jpg', paths_only=True)
    return paths

def extract_pdf_metadata(filename, working_dir, base_dir):
    start_time          = time.time()
    pdf_filepath        = os.path.join(base_dir, filename)

    log_info('filepath {}, working_dir {}'.format(pdf_filepath, working_dir), app_context.application_context)
    try:
        pdf_image_paths         = extract_image_paths_from_pdf(pdf_filepath, working_dir)
    except Exception as e:
        log_error('error in extracting images from {}'.format(pdf_filepath), app_context.application_context, e)
        return None
   
    end_time            = time.time()
    extraction_time     = end_time - start_time
    log_info('Extraction of images from {} completed in {}'.format(pdf_filepath, extraction_time), app_context.application_context)

    return  pdf_image_paths

def doc_pre_processing(filename, base_dir):
    '''
        Preprocessing on input pdf to get:
            - images

    '''

    log_info("image extraction started ===>", app_context.application_context)

    working_dir, ret = create_pdf_processing_paths(filename, base_dir)

    pdf_image_paths  = extract_pdf_metadata(filename, working_dir, base_dir)

    return pdf_image_paths



