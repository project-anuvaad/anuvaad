import time

from anuvaad_auditor.loghandler import log_exception, log_info
from anuvaad_auditor.errorhandler import post_error
from configs.translatorconfig import nmt_interactive_translate_url
from configs.translatorconfig import sentence_fetch_url
from utilities.translatorutils import TranslatorUtils

utils = TranslatorUtils()


class TextTranslationService:

    def __init__(self):
        pass

    # Method to accept text list and return translations for SYNC flow.
    def text_translate(self, text_translate_input):
        text_translate_input["jobID"] = utils.generate_task_id()
        text_translate_input["startTime"] = eval(str(time.time()).replace('.', '')[0:13])
        log_info("Text Translation started....", text_translate_input)
        output = text_translate_input
        output["status"], output["output"] = "FAILED", None
        try:
            text_nmt = []
            text_for_nmt, ch_res = self.get_stored_hypothesis_ch(text_translate_input["input"]["textList"], text_translate_input)
            if text_for_nmt:
                for text in text_for_nmt:
                    text_nmt.append({"s_id": text["s_id"], "id": text["modelID"], "src": text["src"], "target_prefix": text["taggedPrefix"]})
                log_info("NMT IT URI - " + str(nmt_interactive_translate_url), text_translate_input)
                nmt_response = utils.call_api(nmt_interactive_translate_url, "POST", text_nmt, None, text_translate_input["metadata"]["userID"])
                if nmt_response:
                    if 'status' in nmt_response.keys():
                        if 'statusCode' in nmt_response["status"].keys():
                            if nmt_response["status"]["statusCode"] != 200:
                                output["error"] = post_error("TRANSLATION_FAILED", "Error while translating: " + str(
                                    nmt_response["status"]["why"]), None)
                                return output
                    ch_res.extend(nmt_response["response_body"])
                    nmt_predictions = self.dedup_hypothesis(ch_res)
                    output["input"], output["status"] = None, "SUCCESS"
                    output["taskEndTime"], output["output"] = eval(str(time.time()).replace('.', '')[0:13]), {"predictions": nmt_predictions}
                else:
                    output["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
                    output["error"] = post_error("TRANSLATION_FAILED", "Error while translating", None)
            else:
                ch_predictions = self.dedup_hypothesis(ch_res)
                output["input"], output["status"] = None, "SUCCESS"
                output["taskEndTime"], output["output"] = eval(str(time.time()).replace('.', '')[0:13]), {"predictions": ch_predictions}
            log_info("Text Translation completed!", text_translate_input)
            return output
        except Exception as e:
            log_exception("Exception while translating: " + str(e), text_translate_input, None)
            output["error"] = post_error("TRANSLATION_FAILED", "Exception while translating: " + str(e), None)
            output["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
            return output

    # Checks and returns stored sentence translation from ch if available.
    def get_stored_hypothesis_ch(self, text_list, text_translate_input):
        sent_map, ch_res, text_for_nmt, ch_response = {}, {}, [], []
        for text in text_list:
            sent_map[text["s_id"]] = text
        api_input = {"sentences": list(sent_map.keys())}
        api_res = utils.call_api(sentence_fetch_url, "POST", api_input, None, text_translate_input["metadata"]["userID"])
        if api_res:
            if api_res["data"]:
                ch_response = api_res["data"]
        if ch_response:
            for translation in ch_response:
                if translation["s_id"] in sent_map.keys():
                    tgt_list = []
                    if sent_map[translation["s_id"]]["taggedPrefix"] in translation["tgt"]:
                        tgt_list.append(translation["tgt"])
                    if sent_map[translation["s_id"]]["taggedPrefix"] in translation["s0_tgt"]:
                        tgt_list.append(translation["s0_tgt"])
                    if tgt_list:
                        translation["tgt"] = tgt_list
                        ch_res[translation["s_id"]] = translation
        for s_id in sent_map.keys():
            if s_id not in ch_res.keys():
                text_for_nmt.append(sent_map[s_id])
        log_info("Translation fetched from CH! Count: " + str(len(ch_res.keys())), text_translate_input)
        return text_for_nmt, list(ch_res.values())

    # Finds if there are duplicate predicitions and de-duplicates it.
    def dedup_hypothesis(self, hypothesis_list):
        predictions = []
        for response in hypothesis_list:
            prediction = response
            prediction["tgt"] = list(set(response["tgt"]))
            predictions.append(prediction)
        return predictions
