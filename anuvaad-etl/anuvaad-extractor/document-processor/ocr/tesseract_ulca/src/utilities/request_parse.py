import config
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
import requests
import numpy as np
import cv2
import base64
import hashlib
from html import escape


def log_error(method):
    def wrapper(*args, **kwargs):
        try:
            output = method(*args, **kwargs)
            return output
        except Exception as e:
            log_exception(
                "Invalid request, required key missing of {}".format(e),
                app_context.application_context,
                e,
            )
            return None

    return wrapper


class File:
    def __init__(self, file):
        self.file = self.remove_html(file)
        self.im_source = None

    @log_error
    def get_language(self):
        return self.file["config"]["OCR"]["language"]

    @log_error
    def set_image_source(self, im_index):
        if (
            "imageUri" in self.file["image"][im_index].keys()
            and self.file["image"][im_index]["imageUri"] is not None
        ):
            self.im_source = "imageUri"
        elif (
            "imageContent" in self.file["image"][im_index].keys()
            and self.file["image"][im_index]["imageContent"] is not None
        ):
            self.im_source = "imageContent"
        else:
            self.im_source = None

    @log_error
    def get_image(self, im_index):

        self.set_image_source(im_index)

        if self.im_source is "imageUri":
            im_url = self.file["image"][im_index][self.im_source]
            resp = requests.get(im_url)
            image = np.asarray(bytearray(resp.content))
            return cv2.imdecode(image, cv2.IMREAD_COLOR)
        elif self.im_source is "imageContent":
            jpg_original = base64.b64decode(
                self.file["image"][im_index][self.im_source]
            )
            jpg_as_np = np.frombuffer(jpg_original, dtype=np.uint8)
            return cv2.imdecode(jpg_as_np, flags=1)
        return None

    @log_error
    def get_images_len(self):
        return len(self.file["image"])

    @log_error
    def get_coords(self, im_index):
        if "regions" in self.file:
            return self.file["regions"][im_index]
        return None

    @log_error
    def get_config(self):
        return self.file["config"]

    @log_error
    def remove_html(self, inp):
        """
        input : can take a string or an arbitary JSON
        output : input with html encoded wherever present
        """
        if type(inp) is dict:
            for key in inp:
                inp[key] = self.remove_html(inp[key])
        elif type(inp) is list:
            for key, _ in enumerate(inp):
                inp[key] = self.remove_html(inp[key])

        elif type(inp) is str:
            inp = escape(inp)

        return inp

    @log_error
    def get_lang(self):
        return self.file["config"]["language"]["sourceLanguage"]

    @log_error
    def check_key(self):
        if "dev_key" in self.file:
            dev_key = self.file["dev_key"]
            k_hash = hashlib.sha3_512(str(dev_key).encode("utf-8")).hexdigest()
            if k_hash == config.KEY_HASH:
                print("Developer access granted!")
                return True
        return False
