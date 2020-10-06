import time

import uuid
from anuvaad_auditor.loghandler import log_exception, log_error, log_info
from anuvaad_auditor.errorhandler import post_error
from configs.translatorconfig import nmt_interactive_translate_url
from configs.translatorconfig import nmt_translate_url
from configs.translatorconfig import update_content_url
from utilities.translatorutils import TranslatorUtils

utils = TranslatorUtils()


class BlockTranslationService:

    def __init__(self):
        pass

    # Method to accept block list and return translations for SYNC flow.
    def block_translate(self, block_translate_input):
        block_translate_input["taskID"] = utils.generate_task_id()
        block_translate_input["taskStartTime"] = eval(str(time.time()).replace('.', '')[0:13])
        block_translate_input["state"] = "TRANSLATED"
        log_info("Block Translation started....", block_translate_input)
        output = block_translate_input
        is_successful, fail_msg, record_id = False, None, None
        try:
            nmt_in_txt = self.get_sentences_for_translation(block_translate_input)
            if not nmt_in_txt:
                fail_msg = "Error while translating, there are no tokenised sentences in these blocks"
                log_error(fail_msg, block_translate_input, None)
            else:
                nmt_response = utils.call_api(nmt_translate_url, "POST", nmt_in_txt, None,
                                              block_translate_input["metadata"]["userID"])
                output["taskEndTime"] = eval(str(time.time()).replace('.', ''))
                if nmt_response:
                    ch_input = self.get_translations_ip_ch(nmt_response, block_translate_input)
                    if ch_input:
                        ch_response = utils.call_api(update_content_url, "POST", ch_input, None,
                                                     block_translate_input["metadata"]["userID"])
                        if ch_response:
                            if ch_response["http"]["status"] == 200:
                                is_successful = True
                            else:
                                fail_msg = "Error while updating blocks to CH: " + ch_response["why"]
                                log_error(fail_msg, block_translate_input, None)
                    else:
                        fail_msg = "Error while translating from NMT: " + str(nmt_response["status"]["why"])
                        log_error(fail_msg, block_translate_input, None)
                else:
                    fail_msg = "Error while translating - empty/null res from NMT"
                    log_error(fail_msg, block_translate_input, None)
        except Exception as e:
            fail_msg = "Exception while translating: " + str(e)
            log_exception(fail_msg, block_translate_input, None)
        if not is_successful:
            output["status"] = "FAILED"
            output["output"] = None
            output["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
            output["error"] = post_error("TRANSLATION_FAILED", fail_msg, None)
        else:
            output["input"] = None
            output["status"] = "SUCCESS"
            output["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
            output["output"] = {"recordID": record_id}
        return output

    # Method to accept text list and return translations for SYNC flow.
    def text_translate(self, text_translate_input):
        text_translate_input["taskID"] = utils.generate_task_id()
        text_translate_input["taskStartTime"] = eval(str(time.time()).replace('.', '')[0:13])
        text_translate_input["state"] = "TRANSLATED"
        log_info("Text Translation started....", text_translate_input)
        output = text_translate_input
        output["status"], output["output"] = "FAILED", None
        try:
            text_nmt = []
            text_for_nmt, ch_res = self.get_stored_hypothesis_ch(text_translate_input["input"]["textList"], text_translate_input)
            if text_for_nmt:
                for text in text_for_nmt:
                    text_in = {"s_id": str(uuid.uuid4()), "id": text["modelID"], "src": text["src"],
                               "tagged_prefix": text["taggedPrefix"]}
                    text_nmt.append(text_in)
                nmt_response = utils.call_api(nmt_interactive_translate_url, "POST", text_nmt, None, text_translate_input["metadata"]["userID"])
                if nmt_response:
                    if 'status' in nmt_response.keys():
                        if 'statusCode' in nmt_response["status"].keys():
                            if nmt_response["status"]["statusCode"] != 200:
                                output["error"] = post_error("TRANSLATION_FAILED", "Error while translating: " + str(
                                    nmt_response["status"]["why"]), None)
                                return output
                    nmt_predictions = self.dedup_hypothesis(ch_res.extend(nmt_response["response_body"]))
                    output["input"] = None
                    output["status"] = "SUCCESS"
                    output["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
                    output["output"] = {"predictions": nmt_predictions}
                    return output
                else:
                    output["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
                    output["error"] = post_error("TRANSLATION_FAILED", "Error while translating", None)
                    return output
            else:
                output["input"] = None
                output["status"] = "SUCCESS"
                output["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
                output["output"] = {"predictions": ch_res}
                return output
        except Exception as e:
            log_exception("Exception while translating: " + str(e), text_translate_input, None)
            output["error"] = post_error("TRANSLATION_FAILED", "Exception while translating: " + str(e), None)
            output["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
            return output

    # Checks and returns stored sentence translation from ch if available.
    def get_stored_hypothesis_ch(self, text_list, text_translate_input):
        sent_map, ch_res, text_for_nmt, ch_response = {}, {}, [], []
        log_info("Text List Size: " + str(len(text_list)), text_translate_input)
        for text in text_list:
            sent_map[text["s_id"]] = text
        for s_id in sent_map.keys():
            ch_res_sent = utils.fetch_sentence_by_id(s_id, text_translate_input["metadata"]["userID"])
            if ch_res_sent:
                ch_response.append(ch_res_sent)
        log_info("CH Response size: " + str(len(ch_response)), text_translate_input)
        if ch_response:
            for translation in ch_response:
                if translation["s_id"] in sent_map.keys():
                    if sent_map[translation["s_id"]]["src"] in translation["src"]:
                        translation["tgt"] = [translation["tgt"]]
                        ch_res[translation["s_id"]] = translation
        for s_id in sent_map.keys():
            if s_id not in ch_res.keys():
                text_for_nmt.append(sent_map[s_id])
        log_info("Text for NMT Size: " + str(len(text_for_nmt)), text_translate_input)
        log_info("Translation fetched from CH! ", text_translate_input)
        return text_for_nmt, list(ch_res.values())

    # Finds if there are duplicate predicitions and de-duplicates it.
    def dedup_hypothesis(self, hypothesis_list):
        predictions = []
        for response in hypothesis_list:
            prediction = response
            prediction["tgt"] = list(set(response["tgt"]))
            predictions.append(prediction)
        return predictions

    # Method to fetch blocks from input and add it to list for translation
    def get_sentences_for_translation(self, block_translate_input):
        nmt_in_txt = []
        record_id, model_id = block_translate_input["input"]["recordID"], block_translate_input["input"]["modelID"]
        for block in block_translate_input["input"]["textBlocks"]:
            for sentence in block["tokenized_sentences"]:
                n_id = str(record_id) + "|" + str(block["block_identifier"]) + "|" + str(sentence["s_id"])
                sent_nmt_in = {"s_id": sentence["s_id"], "src": sentence["src"], "id": model_id, "n_id": n_id}
                nmt_in_txt.append(sent_nmt_in)
        return nmt_in_txt

    # Parses the nmt response and builds input for ch
    def get_translations_ip_ch(self, nmt_response, block_translate_input):
        ch_input = None
        if 'response_body' in nmt_response.keys():
            if nmt_response['response_body']:
                for translation in nmt_response["response_body"]:
                    b_index, s_index = None, None
                    block_id, sentence_id = str(translation["n_id"]).split("|")[2], str(translation["n_id"]).split("|")[
                        3]
                    blocks = block_translate_input["input"]["textBlocks"]
                    for j, block in enumerate(blocks):
                        if str(block["block_identifier"]) == str(block_id):
                            b_index = j
                            break
                    block = blocks[b_index]
                    for k, sentence in enumerate(block["tokenized_sentences"]):
                        if str(sentence["s_id"]) == str(sentence_id):
                            s_index = k
                            break
                    block_translate_input["input"]["textBlocks"][b_index]["tokenized_sentences"][s_index] = translation
                ch_input = {"blocks": block_translate_input["input"]["textBlocks"]}
        return ch_input
