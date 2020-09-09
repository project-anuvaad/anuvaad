import logging

from utilities.translatorutils import TranslatorUtils
from kafkawrapper.translatorproducer import Producer
from anuvaad_auditor.loghandler import log_exception, log_error, log_info
from anuvaad_auditor.errorhandler import post_error_wf
from configs.translatorconfig import save_content_url
from configs.translatorconfig import nmt_max_batch_size
from configs.translatorconfig import anu_nmt_input_topic

log = logging.getLogger('file')
utils = TranslatorUtils()
producer = Producer()


class WFMService:
    def __init__(self):
        pass

    # Service method to begin translation for document translation flow.
    def start_file_translation(self, translate_wf_input):
        translate_wf_input["taskID"] = utils.generate_task_id()
        log_info("File Translation initiated....", translate_wf_input)
        for file in translate_wf_input["input"]["files"]:
            try:
                dumped = self.dump_file_to_db(file["path"], translate_wf_input)
                if not dumped:
                    post_error_wf("CONTENT_DUMP_FAILED", "Error while dumping file content to DB", translate_wf_input,
                                  None)
                pushed = self.push_sentences_to_nmt()
                if not pushed:
                    post_error_wf("BATCH_PUSH_FAILED", "Error while pushing batched to nmt", translate_wf_input,
                                  None)
            except Exception as e:
                log_exception("Exception while translating the files: " + str(e), translate_wf_input, e)
                post_error_wf("FILE_TRANSLATION_FAILED", "Exception while translating the file: " + str(e),
                              translate_wf_input, e)

    # Method to download and dump the content of the file present in the input
    def dump_file_to_db(self, file_id, translate_wf_input):
        log_info("Downloading File....", translate_wf_input)
        data = utils.download_file(file_id)
        if not data:
            log_error("File received on input couldn't be read!", translate_wf_input, None)
            return None
        else:
            log_info("Dumping content to translator DB......", translate_wf_input)
            res = utils.call_api(save_content_url, "POST", ch_input, None)
            if not res:
                log_error("Error while dumping file content to CH", translate_wf_input, None)
                return None
            return res

    # Method to push sentences of the file to nmt for translation
    def push_sentences_to_nmt(self, file_id, translate_wf_input):
        try:
            log_info("Translator process started......", translate_wf_input)
            content_from_db = self.get_content_from_db(file_id, translate_wf_input["jobID"])
            if not content_from_db:
                log_error("CONTENT_FETCH_FAILED",
                          "File content from DB couldn't be fetched, jobID: " + str(translate_wf_input["jobID"]),
                          translate_wf_input, None)
                return None
            data = content_from_db["data"]
            if not data:
                log_error("NO_DATA_DB", "No data for file, jobID: " + str(translate_wf_input["jobID"]),
                          translate_wf_input,
                          None)
                return None
            pages = data["result"]
            total_sentences = 0
            for page in pages:
                batches = self.fetch_batches_of_sentences(file_id, page["page_no"], translate_wf_input)
                if not batches:
                    log_error("No batches obtained for page: " + str(page["page_no"]), translate_wf_input, None)
                    continue
                for batch_no in batches.keys():
                    batch = batches[batch_no]
                    nmt_in = {
                        "url_end_point": translate_wf_input["input"]["model"]["url_end_point"],
                        "message": batch
                    }
                    producer.produce(nmt_in, anu_nmt_input_topic)
                    total_sentences += len(batch)
                    log_info("PAGE NO: " + str(page["page_no"]) + " | BATCH NO: " + str(batch_no) +
                             " | BATCH SIZE: " + str(len(batch)) + " | OVERALL SENTENCES: " + str(total_sentences))
            return True
        except Exception as e:
            log_exception("Exception while pushing sentences to NMT: " + str(e), translate_wf_input, e)
            return None

    # Method to fetch batches for sentences from the file
    def fetch_batches_of_sentences(self, file_id, page_no, translate_wf_input):
        try:
            log_info("Building batches of sentences for page: " + page_no, translate_wf_input)
            page = self.get_content_from_db(translate_wf_input["jobID"], file_id, page_no)
            sentences_for_trans = {}
            page_no = page["page_no"]
            text_blocks = page["text_blocks"]
            if text_blocks:
                for block in text_blocks:
                    block_id = block["block_id"]
                    if block["tokenized_sentences"]:
                        batch_key = 0
                        for sentence in block["tokenized_sentences"]:
                            node_id = str(translate_wf_input["jobID"]) + "|" + str(file_id) + "|" + str(
                                page_no) + "|" + str(block_id)
                            sent_nmt_in = {
                                "src": sentence["src"],
                                "s_id": sentence["sentence_id"],
                                "id": translate_wf_input["input"]["model"]["id"],
                                "n_id": node_id
                            }
                            if sentences_for_trans[batch_key]:
                                sentence_list = sentences_for_trans[batch_key]
                                sentence_list.append(sent_nmt_in)
                                sentences_for_trans[batch_key] = sentence_list
                            else:
                                sentence_list = [sent_nmt_in]
                                sentences_for_trans[batch_key] = sentence_list

                            if len(sentences_for_trans[batch_key]) == nmt_max_batch_size:
                                batch_key += 1
                        return sentences_for_trans
                    else:
                        log_error("There are no tokenised sentences in block: " + str(block_id), translate_wf_input,
                                  None)
                        continue
            else:
                log_error("There are no text blocks for this page: " + str(page_no), translate_wf_input, None)
                return None
        except Exception as e:
            log_exception("Exception while fetching batch of sentences: " + str(e), translate_wf_input, e)
            return None

    def get_content_from_db(self, job_id, file_id, pageNo):
        return None
