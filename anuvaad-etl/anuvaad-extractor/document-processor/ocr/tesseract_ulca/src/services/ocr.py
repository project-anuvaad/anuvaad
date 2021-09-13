
import os
import pytesseract
import config


class TextExtraction:

    def __init__(self, image, coords, cfg):
        self.image = image
        self.coords = coords
        self.lang = cfg['language']['sourceLanguage']
        self.detect = False
        if self.lang == 'detect':
            self.detect = True
        if self.lang not in config.LANG_MAPPING:
            self.detect = True

    def get_sentences(self):

        if self.image is None:
            return "Unable to access input image"

        # get/detect language
        if self.detect:
            self.lang = self.detect_language()
        if self.lang is None:
            return 'Unable to detect language'

        # check if weight file is avilabe if not then download best weight form tesseract repo.
        self.check_weights()

        # ocr
        if self.coords is None:
            return self.page_level_ocr()
        return self.region_level_ocr()

    def page_level_ocr(self):
        '''
        OCR at page_level with single tesseract weight
        '''
        try:
            if not self.detect:
                lang = config.LANG_MAPPING[self.lang][0]
            else:
                lang = self.lang
            text = pytesseract.image_to_string(self.image, lang=lang)

            return [ { 'source' : line} for line in  text.split('\n')]
        except Exception as e:
            return 'Error in tesseract ocr due to ' + str(e)

    def region_level_ocr(self):
        sentences = []
        '''
        Double OCR logic borrowed from anuvaad-ocr verison 2.0
        '''

        return sentences

    def detect_language(self):
        try:
            osd = pytesseract.image_to_osd(self.image)
            language_script = osd.split('\nScript')[1][2:]
            print('Language detected {0}'.format(language_script))
            return language_script
        except:
            return None

    def check_weights(self):
        if not self.detect:
            langs = config.LANG_MAPPING[self.lang]
        else:
            langs = [self.lang]

        for lang in langs:
            try:
                weight_path = '/usr/share/tesseract-ocr/4.00/tessdata/' + lang + '.traineddata'
                if not os.path.exists(weight_path):
                    download = 'curl -L -o ' + weight_path + \
                        ' https://github.com/tesseract-ocr/tessdata_best/raw/master/script/' + \
                        lang + '.traineddata'
                    os.system(download)
            except Exception as e:
                print("Error in downloading weights due to {}".format(e))
