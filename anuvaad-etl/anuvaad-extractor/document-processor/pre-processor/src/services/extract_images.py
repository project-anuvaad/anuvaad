from src.utilities.filesystem import create_directory,extract_image_paths_from_pdf
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import src.utilities.app_context as app_context
import time
import os
import uuid
import config
import cv2
import math

from src.utilities.request_parse import get_files, File

def create_pdf_processing_paths(filepath, base_dir):

    filename    = os.path.basename(filepath)
    working_dir = os.path.join(base_dir, os.path.splitext(filename)[0] + '_' + str(uuid.uuid4()))
    ret         = create_directory(working_dir)

    if ret == False:
        log_error('unable to create working directory {}'.format(working_dir), app_context.application_context, None)
        return None, False
    log_info('created processing directories successfully {}'.format(working_dir), app_context.application_context)
    return working_dir, True

def extract_pdf_images(filename, base_dir):
    start_time = time.time()

    working_dir, ret = create_pdf_processing_paths(filename, base_dir)
    pdf_filepath        = os.path.join(base_dir, filename)
    log_info('filepath {}, working_dir {}'.format(pdf_filepath, working_dir), app_context.application_context)

    try:
        pdf_image_paths         = extract_image_paths_from_pdf(pdf_filepath, working_dir)
        log_info('Extracting images of {}'.format(pdf_filepath), app_context.application_context)
    except Exception as e:
        log_error('error extracting images of {}'.format(pdf_filepath), app_context.application_context, e)
        return None
    end_time            = time.time()
    extraction_time     = end_time - start_time
    log_info('Extraction of {} completed in {}'.format(pdf_filepath, extraction_time), app_context.application_context)

    return pdf_image_paths



def resize_image(image_paths):
    '''
    Google ocr will not process an image if it has more than 65M pixels
    '''
    max_res  = 65_000_000
    try:
        if image_paths is not None and len(image_paths) > 0:
            for path in image_paths:
                img = cv2.imread(path)
                img_res = img.shape[0] * img.shape[1]
                
                
                if img_res >= max_res:
                    log_info("Resolution of pdf too high scaling down to enable OCR" ,app_context.application_context)
                    scaling_factor = math.sqrt(max_res / img_res)
                    img = cv2.resize(img,None,fx= scaling_factor,fy=scaling_factor,interpolation=cv2.INTER_AREA)
                    cv2.imwrite(path,img)
    except Exception as e :
        log_error('error in resizing images ' + str(e), app_context.application_context, e)


def extract_images(app_context,base_dir):

    files = get_files(app_context.application_context)
    file_images =[]
    print('extracting images')
    try :
        for file in files:
            file_properties = File(file)
            file_format     = file_properties.get_format()
            if file_format in ['PDF' ,'pdf']:
                filename = file_properties.get_name()
                image_paths = extract_pdf_images(filename,base_dir)
                resize_image(image_paths)
                file_images.append(image_paths)
                
            else:
                if file_format in ['PNG', 'JPEG', 'BMP','jpg','png','bmp','jpeg' ] :
                    filename = file_properties.get_name()
                    image_paths = [os.path.join(base_dir, filename)]
                    resize_image(image_paths)
                    file_images.append(image_paths)
                else:
                    log_info("currently we do not support {} files .".format(file_format) ,app_context.application_context)
                    return None
    except Exception as e:
        log_error('error extracting images of' + str(e), app_context.application_context, e)
        return None

    return file_images



