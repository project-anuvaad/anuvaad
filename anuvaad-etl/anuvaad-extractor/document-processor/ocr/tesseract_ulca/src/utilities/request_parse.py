import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
import requests
import numpy as np
import cv2


def log_error(method):
    def wrapper(*args, **kwargs):
        try:
            output = method(*args, **kwargs)
            return output
        except Exception as e:
            log_exception('Invalid request, required key missing of {}'.format(
                e), app_context.application_context, e)
            return None
    return wrapper


class File:

    def __init__(self, file):
        self.file = file

    @log_error
    def get_language(self):
        return self.file['config']['OCR']['language']

    @log_error
    def get_image(self, im_index):
        im_url = self.file['imageUri'][im_index]
        resp = requests.get(im_url)
        image = np.asarray(bytearray(resp.content))
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        return image

    @log_error
    def get_images_len(self):
        return len(self.file['imageUri'])

    @log_error
    def get_coords(self, im_index):
        if 'regions' in self.file:
            return self.file['regions'][im_index]
        return None

    @log_error
    def get_config(self):
        return self.file['config']
