import time

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
        block_translate_input["taskStartTime"] = eval(str(time.time()).replace('.', ''))
        block_translate_input["state"] = "TRANSLATED"
        log_info("Block Translation started....", block_translate_input)
        output = block_translate_input
        is_successful, fail_msg, record_id = False, None, None
        try:
            nmt_in_txt = self.get_blocks_for_translation(block_translate_input)
            nmt_response = utils.call_api(nmt_translate_url, "POST", nmt_in_txt, None, block_translate_input["metadata"]["userID"])
            output["taskEndTime"] = eval(str(time.time()).replace('.', ''))
            if nmt_response:
                ch_input = self.get_translations_ip_ch(nmt_response, block_translate_input)
                if ch_input:
                    ch_response = utils.call_api(update_content_url, "POST", ch_input, None, block_translate_input["metadata"]["userID"])
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
            output["error"] = post_error("TRANSLATION_FAILED", fail_msg, None)
        else:
            output["input"] = None
            output["status"] = "SUCCESS"
            output["output"] = {"recordID": record_id}
        return output

    # Method to fetch blocks from input and add it to list for translation
    def get_blocks_for_translation(self, block_translate_input):
        nmt_in_txt = []
        record_id, model_id = block_translate_input["input"]["recordID"], block_translate_input["input"]["modelID"]
        for block in block_translate_input["input"]["textBlocks"]:
            sentences = block["tokenized_sentences"]
            for sentence in sentences:
                n_id = str(record_id) + "|" + str(block["block_identifier"]) + "|" + str(sentence["sentence_id"])
                sent_nmt_in = {"s_id": sentence["sentence_id"], "id": model_id, "n_id": n_id}
                if 'src_text' in sentence.keys():
                    sent_nmt_in["src"] = sentence["src_text"]
                else:
                    sent_nmt_in["src"] = sentence["src"]
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
                        if str(sentence["sentence_id"]) == str(sentence_id):
                            s_index = k
                            break
                    translation["sentence_id"] = translation["s_id"]
                    block_translate_input["input"]["textBlocks"][b_index]["tokenized_sentences"][s_index] = translation
                ch_input = {"blocks": block_translate_input["input"]["textBlocks"]}
        return ch_input
