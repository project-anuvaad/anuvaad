import hashlib

from anuvaad_auditor.loghandler import log_exception, log_info
from configs.translatorconfig import anu_translator_tmx_in_topic
from configs.translatorconfig import tool_translator
from kafkawrapper.translatorproducer import Producer

from .tmxrepository import TMXRepository

repo = TMXRepository()
producer = Producer()

class TMXService:

    def __init__(self):
        pass

    # Transforms translator objects to TMX records and pushes it to the topic
    def push_to_tmx_topic(self, job_id, user_id, context, translations):
        obj = {"jobID": job_id, "metadata": {"module": tool_translator}}
        for translation in translations:
            trans = {"src": translation["src"], "tgt": translation["tgt"]}
            if not context:
                context = "JUDICIARY"
            tmx_trans = {"jobID": job_id, "userID": user_id, "ctx": context, "translations": trans}
            producer.produce(tmx_trans, anu_translator_tmx_in_topic)
        log_info("Translations pushed to TMX input topic...", obj)

    # Pushes translations to the tmx.
    def push_to_tmx_store(self, tmx_input):
        obj = {"jobID": tmx_input["jobID"], "metadata": {"module": tool_translator}}
        try:
            tmx_records = {}
            tmx_record = {"userID": tmx_input["userID"], "ctx": tmx_input["ctx"]}
            for translation in tmx_input["translations"]:
                tmx_record["src"] = translation["src"]
                tmx_record["tgt"] = translation["tgt"]
                key = self.get_hash_key(tmx_record)
                tmx_records[key] = tmx_record
            repo.upsert(tmx_records)
            log_info("Translations pushed to TMX...", obj)
            return {}
        except Exception as e:
            log_exception("Exception while pushing to TMX: " + str(e), obj, e)
            return None

    # Creates a md5 hash using userID, context and src.
    def get_hash_key(self, tmx_record):
        key = tmx_record["userID"] + "|" + tmx_record["context"] + "|" + tmx_record["src"]
        return hashlib.md5(key).hexdigest()

