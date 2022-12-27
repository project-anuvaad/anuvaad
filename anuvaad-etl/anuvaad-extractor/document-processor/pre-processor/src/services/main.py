from src.services.orientation_correction import Orientation
from anuvaad_auditor.loghandler import log_debug
from anuvaad_auditor.loghandler import log_exception
from anuvaad_auditor.loghandler import log_info
import copy
import uuid
import os
import cv2
import config
from src.utilities import app_context
from src.utilities.model_response import FileOutput, Page
from src.services.remove_watermark import clean_image
from src.services.extract_images import extract_images
from src.utilities.request_parse import get_files, File
from flask import jsonify


def tilt_align(files, file_index, img):
    # Orientation correction
    # files = get_files(app_context.application_context)
    # PDF to image
    # images = extract_images(app_context, base_dir)
    # if align_img is not None and align_img == 'True' :

    image, angle = Orientation(img, File(files[file_index]),).re_orient_east()
    image_id = str(uuid.uuid4())
    base_dir = config.download_folder+'/'+img.split('/')[1]
    cv2.imwrite(os.path.join(base_dir, f"images/tilt-aligned_{image_id}.jpg"), image)
    # print(image,"***",angle)
    return image


def watermark(image_path):
    # print(image_paths)
    # for image_path in image_paths:
    #     print(image_path)
    # print(image_path)
    # if type(image_path) == str:
    base_dir = config.download_folder+'/'+image_path.split('/')[1]
    print(base_dir)
    image = cv2.imread(image_path)
    # else:
    #     image = image_path

    image = clean_image(image)
    image_id = str(uuid.uuid4())
    cv2.imwrite(os.path.join(base_dir, f"images/watermark-removed_{image_id}.jpg"), image)
    return image


def get_response(files, images):

    output = []
    # files = get_files(app_context.application_context)
    for file_index, file in enumerate(files):
        file_prperties = FileOutput(file)
        try:
            for page_index, page in enumerate(images[file_index]):
                if page:
                    path = images[file_index][page_index]
                    filename = path.split('/')[-1]
                else:
                    path = []
                    filename = []
                page_properties = Page(page)
                print(page_properties.get_page())
                file_prperties.set_page(page_properties.get_page())
                file_prperties.set_page_info(page)
            file_prperties.set_staus(True)

        except Exception as e:
            file_prperties.set_staus(False)
            log_exception("Error occured during response generation" +
                          str(e), app_context.application_context, e)
            return None

        output.append(file_prperties.get_file())

    app_context.application_context['outputs'] = output

    return app_context.application_context


def preprocess(app_context, base_dir):
    try:
        log_debug('pre-processing started {}'.format(
            app_context.application_context), app_context.application_context)
        files = get_files(app_context.application_context)
        file_properties = File(files[0])
        images = extract_images(app_context, base_dir)
        align_img = file_properties.get_tilt_align_config()
        watermark_img = file_properties.get_watermark_remove_config()
        for file_index, file_imgs in enumerate(images):
            for img in file_imgs:
                if align_img:
                    tilt_align(files, file_index, img)
                if watermark_img:
                    watermark(img)
        return {
            'code': 200,
            'message': 'request completed',
            'rsp':  get_response(files, images)
        }

    except Exception as e:
        print(e)
