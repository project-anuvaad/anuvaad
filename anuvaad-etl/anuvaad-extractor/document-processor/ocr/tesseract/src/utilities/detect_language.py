import pytesseract
import os
from collections import Counter
import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception



def most_frequent(List):
    occurence_count = Counter(List)
    return occurence_count.most_common(1)[0][0]

def pdf_language_detect(page_file):
    try :
        osd = pytesseract.image_to_osd(page_file)
        language_script = osd.split('\nScript')[1][2:]
        print('Language detected {0}'.format(language_script))
        return language_script
    except :
        return None

def detect(pages):
    to_check = pages[:5]
    langs = []

    for page in to_check:
        lang = pdf_language_detect(page)
        if lang != None :
            langs.append(lang)
    try:
        language = most_frequent(langs)
        return language
    except Exception as e:
        log_exception("unable to detect language fo ", app_context.application_context, e)
        return None

