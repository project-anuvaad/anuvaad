import six
from google.cloud import translate_v2 as translate

class GoogleTranslate:
    def __init__(self):
        self.translate_client   = translate.Client()

    def translate_text(self, target_language, text):
        if isinstance(text, six.binary_type):
            text = text.decode("utf-8")

        result = self.translate_client.translate(text, target_language=target_language)
        return result["input"], result["translatedText"], result["detectedSourceLanguage"]
