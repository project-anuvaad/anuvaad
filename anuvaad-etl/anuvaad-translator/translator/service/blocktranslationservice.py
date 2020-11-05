import time

import uuid
from anuvaad_auditor.loghandler import log_exception, log_error, log_info
from anuvaad_auditor.errorhandler import post_error
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
        is_successful, fail_msg, record_id, ch_input = False, None, block_translate_input["input"]["recordID"], None
        try:
            nmt_in_txt = self.get_sentences_for_translation(block_translate_input)
            if not nmt_in_txt:
                fail_msg = "ERROR: there are no tokenized sentences for translation in these blocks"
                log_error(fail_msg, block_translate_input, None)
            else:
                log_info("API call to NMT...", block_translate_input)
                nmt_response = utils.call_api(nmt_translate_url, "POST", nmt_in_txt, None, block_translate_input["metadata"]["userID"])
                log_info("Response received from NMT!", block_translate_input)
                if nmt_response:
                    ch_input = self.get_translations_ip_ch(nmt_response, block_translate_input)
                    if ch_input:
                        log_info("API call to CH...", block_translate_input)
                        ch_response = utils.call_api(update_content_url, "POST", ch_input, None, block_translate_input["metadata"]["userID"])
                        log_info("Response received from CH!", block_translate_input)
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
            output["output"] = {"textBlocks": ch_input["blocks"]}
        log_info("Block Translation Completed!", block_translate_input)
        return output

    # Method to fetch blocks from input and add it to list for translation
    def get_sentences_for_translation(self, block_translate_input):
        sent_for_nmt = []
        record_id, model_id = block_translate_input["input"]["recordID"], block_translate_input["input"]["modelID"]
        for block in block_translate_input["input"]["textBlocks"]:
            if 'tokenized_sentences' in block.keys():
                for sentence in block["tokenized_sentences"]:
                    n_id = str(record_id) + "|" + str(block["block_identifier"]) + "|" + str(sentence["s_id"])
                    sent_nmt_in = {"s_id": sentence["s_id"], "src": sentence["src"], "id": model_id,
                                   "n_id": n_id}
                    if 'save' in sentence.keys():
                        if not sentence["save"]:
                            sent_for_nmt.append(sent_nmt_in)
                    else:
                        sent_for_nmt.append(sent_nmt_in)
        log_info("Sentences fetched for NMT!", block_translate_input)
        return sent_for_nmt

    # Parses the nmt response and builds input for ch
    def get_translations_ip_ch(self, nmt_response, block_translate_input):
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
        log_info("Input for CH update generated!", block_translate_input)
        return {"blocks": block_translate_input["input"]["textBlocks"], "workflowCode": block_translate_input["workflowCode"]}
