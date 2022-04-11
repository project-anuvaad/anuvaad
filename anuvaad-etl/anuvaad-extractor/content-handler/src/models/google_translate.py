import six
from google.cloud import translate_v2 as translate
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import AppContext

translate_client   = translate.Client()
class GoogleTranslate:
    def __init__(self):
        pass

    def translate_text(self, target_language, text):
        try:
            if isinstance(text, six.binary_type):
                text = text.decode("utf-8")

            result = translate_client.translate(text, target_language=target_language)
            return result["input"], result["translatedText"], result["detectedSourceLanguage"]
        except Exception as e:
            result=[]
            log_exception("google translate exception ",  AppContext.getContext(), e)
            return None, None, None