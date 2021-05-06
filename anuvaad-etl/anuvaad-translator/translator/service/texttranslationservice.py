import os
import time

from anuvaad_auditor.loghandler import log_exception, log_info
from anuvaad_auditor.errorhandler import post_error
from configs.translatorconfig import nmt_it_url, sentence_fetch_url, nmt_translate_url, nmt_fetch_models_url
from utilities.translatorutils import TranslatorUtils

utils = TranslatorUtils()


class TextTranslationService:

    def __init__(self):
        pass

    # Method to accept text list and return translations for SYNC flow.
    def interactive_translate(self, text_translate_input):
        text_translate_input["jobID"] = utils.generate_task_id()
        text_translate_input["startTime"] = eval(str(time.time()).replace('.', '')[0:13])
        log_info("Text Translation started....", text_translate_input)
        output = text_translate_input
        output["status"], output["output"] = "FAILED", None
        try:
            text_for_nmt, ch_res = self.get_stored_hypothesis_ch(text_translate_input["input"]["textList"], text_translate_input)
            if text_for_nmt:
                url, body = self.get_nmt_data_interactive(text_translate_input, text_for_nmt)
                log_info("NMT IT URI - " + str(url), text_translate_input)
                nmt_response = utils.call_api(url, "POST", body, None, text_translate_input["metadata"]["userID"])
                if nmt_response:
                    if 'status' in nmt_response.keys():
                        if 'statusCode' in nmt_response["status"].keys():
                            if nmt_response["status"]["statusCode"] != 200:
                                output["error"] = post_error("TRANSLATION_FAILED", "Error while translating: " + str(
                                    nmt_response["status"]["message"]), None)
                                return output
                    ch_res.extend(nmt_response["data"])
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
                    if str(translation["tgt"]).startswith(str(sent_map[translation["s_id"]]["taggedPrefix"])):
                        tgt_list.append(translation["tgt"])
                    if str(translation["s0_tgt"]).startswith(str(sent_map[translation["s_id"]]["taggedPrefix"])):
                        tgt_list.append(translation["s0_tgt"])
                    if tgt_list:
                        translation["tgt"] = tgt_list
                        ch_res[translation["s_id"]] = translation
        for s_id in sent_map.keys():
            if s_id not in ch_res.keys():
                text_for_nmt.append(sent_map[s_id])
        log_info("Translation fetched from CH! Count: " + str(len(ch_res.keys())), text_translate_input)
        return text_for_nmt, list(ch_res.values())


    # Method to get body and url based on Model for interactive translation
    def get_nmt_data_interactive(self, text_translate_input, text_for_nmt):
        model = text_translate_input["input"]["model"]
        text_nmt = []
        for text in text_for_nmt:
            text_nmt.append({"s_id": text["s_id"], "id": model["model_id"], "src": text["src"],
                             "target_prefix": text["taggedPrefix"]})
        try:
            host = model["connection_details"]["interactive"]["host"]
            api_host = os.environ.get(host, 'NA')
            endpoint = model["connection_details"]["interactive"]["api_endpoint"]
            api_endpoint = os.environ.get(endpoint, 'NA')
            if api_host == "NA" or api_endpoint == "NA":
                log_info("Falling back to Anuvaad NMT translate URL....", text_translate_input)
                return nmt_it_url, text_nmt
            url = api_host + api_endpoint
            return url, text_nmt
        except Exception as e:
            log_exception("Exception while fetching API conn details: {}".format(str(e)), text_translate_input, None)
            log_info("Falling back to Anuvaad NMT translate URL....", text_translate_input)
        return nmt_it_url, text_nmt

    # Finds if there are duplicate predicitions and de-duplicates it.
    def dedup_hypothesis(self, hypothesis_list):
        predictions = []
        for response in hypothesis_list:
            prediction = response
            prediction["tgt"] = list(set(response["tgt"]))
            predictions.append(prediction)
        return predictions

    # Method to translate plain sentences
    def translate_sentences(self, sentence_translation_input):
        sentence_translation_input["taskID"] = utils.generate_task_id()
        sentence_translation_input["taskStartTime"] = eval(str(time.time()).replace('.', '')[0:13])
        sentence_translation_input["state"] = "TRANSLATED"
        output = sentence_translation_input
        try:
            log_info("Translating Sentences...", sentence_translation_input)
            model_id = sentence_translation_input["input"]["model_id"]
            url = f'{nmt_fetch_models_url}/{model_id}'
            log_info("Fetching Model.....", sentence_translation_input)
            model_response = utils.call_api(url, "GET", None, None, sentence_translation_input["metadata"]["userID"])
            model, error = None, None
            if model_response:
                if 'status' in model_response.keys():
                    if 'statusCode' in model_response["status"].keys():
                        if model_response["status"]["statusCode"] == 200:
                            if model_response["data"]:
                                model = model_response["data"][0]
            if not model:
                error = post_error("TRANSLATION_FAILED", "Error while fetching models: {} ".format(model_response["status"]["message"]), None)
                output["status"], output["error"] = "FAILED", error
                return output
            log_info("Done!", sentence_translation_input)
            log_info("Fetching Translations.....", sentence_translation_input)
            nmt_url, nmt_body = self.get_nmt_data_sent_translation(sentence_translation_input, model)
            nmt_response = utils.call_api(nmt_url, "POST", nmt_body, None, sentence_translation_input["metadata"]["userID"])
            translations = []
            if nmt_response:
                if 'status' in nmt_response.keys():
                    if 'statusCode' in nmt_response["status"].keys():
                        if nmt_response["status"]["statusCode"] != 200:
                            error = post_error("TRANSLATION_FAILED", "Error while translating: {} ".format(nmt_response["status"]["message"]), None)
                            output["status"], output["error"] = "FAILED", error
                            return output
                        else:
                            translations = nmt_response["data"]
                            if not translations:
                                log_info("NMT returned zero translations!", sentence_translation_input)
            log_info("Done!", sentence_translation_input)
            output["status"], output["translations"] = "SUCCESS", translations
            return output
        except Exception as e:
            log_exception("Exception while translating: {}".format(e), sentence_translation_input, None)
            error = post_error("TRANSLATION_FAILED", "Exception while translating: {}".format(e), None)
            output["status"], output["error"] = "FAILED", error
            return output

    # Method to get body and url based on Model for sentence translation
    def get_nmt_data_sent_translation(self, sentence_translation_input, model):
        text_nmt = []
        for text in sentence_translation_input["sentences"]:
            text_nmt.append({"s_id": text["s_id"], "src": text["src"]})
        nmt_in = {"src_list": text_nmt, "source_language_code": model["source_language_code"],
                  "target_language_code": model["target_language_code"], "model_id": model["model_id"]}
        try:
            host = model["connection_details"]["translation"]["host"]
            api_host = os.environ.get(host, 'NA')
            endpoint = model["connection_details"]["translation"]["api_endpoint"]
            api_endpoint = os.environ.get(endpoint, 'NA')
            if api_host == "NA" or api_endpoint == "NA":
                log_info("Falling back to Anuvaad NMT translate URL....", sentence_translation_input)
                return nmt_translate_url, nmt_in
            url = api_host + api_endpoint
            return url, nmt_in
        except Exception as e:
            log_exception("Exception while fetching API conn details: {}".format(str(e)), sentence_translation_input, None)
            log_info("Falling back to Anuvaad NMT translate URL....", sentence_translation_input)
        return nmt_it_url, nmt_in
