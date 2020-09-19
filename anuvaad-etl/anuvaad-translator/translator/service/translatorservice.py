import logging
import time

from anuvaad_auditor import post_error
from utilities.translatorutils import TranslatorUtils
from kafkawrapper.translatorproducer import Producer
from repository.translatorrepository import TranslatorRepository
from anuvaad_auditor.loghandler import log_exception, log_error, log_info
from configs.translatorconfig import nmt_max_batch_size
from configs.translatorconfig import anu_nmt_input_topic
from configs.translatorconfig import nmt_translate_url

log = logging.getLogger('file')
utils = TranslatorUtils()
producer = Producer()
repo = TranslatorRepository()


class TranslatorService:
    def __init__(self):
        pass

    # Method to accept text list and return translations for SYNC flow.
    def text_translate(self, text_translate_input):
        text_translate_input["taskID"] = utils.generate_task_id()
        text_translate_input["taskStartTime"] = eval(str(time.time()).replace('.', ''))
        text_translate_input["state"] = "TRANSLATED"
        output = text_translate_input
        try:
            nmt_in_txt = []
            in_map = {}
            for text in text_translate_input["input"]["textList"]:
                s_id = str(text["node"]["pageNo"]) + "|" + str(text["node"]["blockID"]) + "|" + str(text["node"]["sentenceID"])
                in_map[s_id] = text
                sent_nmt_in = {"src": text["text"], "s_id": s_id, "id": text["model"]["model_id"], "n_id": s_id}
                nmt_in_txt.append(sent_nmt_in)
            res = utils.call_api(nmt_translate_url, "POST", nmt_in_txt, None, text_translate_input["metadata"]["userID"])
            output["taskEndTime"] = eval(str(time.time()).replace('.', ''))
            translations = []
            if res:
                if 'response_body' in res.keys():
                    for translation in res["response_body"]:
                        text = translation
                        text["node"] = in_map[translation["s_id"]]["node"]
                        translations.append(text)
            if len(translations) > 0:
                output["input"] = None
                output["status"] = "SUCCESS"
                output["output"] = {"translations": translations}
            else:
                output["status"] = "FAILED"
                output["output"] = None
                output["error"] = post_error("TRANSLATION_FAILED", "There was an error while translating!", None)
        except Exception as e:
            log_exception("Exception while translating: " + str(e), text_translate_input, None)
            output["status"] = "FAILED"
            output["output"] = None
            output["error"] = post_error("TRANSLATION_FAILED", "There was an exception while translating!", None)
        return output

    # Service method to begin translation for document translation flow.
    def start_file_translation(self, translate_wf_input):
        translate_wf_input["taskID"] = utils.generate_task_id()
        translate_wf_input["taskStartTime"] = eval(str(time.time()).replace('.', ''))
        translate_wf_input["state"] = "TRANSLATED"
        log_info("Translator process initiated... jobID: " + str(translate_wf_input["jobID"]), translate_wf_input)
        for file in translate_wf_input["input"]["files"]:
            try:
                self.dump_file_to_db(file["path"], translate_wf_input)
                self.push_sentences_to_nmt(file, translate_wf_input)
            except Exception as e:
                log_exception("Exception while posting sentences to NMT: " + str(e), translate_wf_input, e)
                continue
        return {"status": "success", "message": "Sentences sent to NMT"}

    # Method to download and dump the content of the file present in the input
    def dump_file_to_db(self, file_id, translate_wf_input):
        try:
            log_info("Downloading File....", translate_wf_input)
            data = utils.download_file(file_id, translate_wf_input)
            if not data:
                log_error("File received on input couldn't be downloaded!", translate_wf_input, None)
                return None
            else:
                log_info("Dumping content to translator DB......", translate_wf_input)
                db_in = {
                    "jobID": translate_wf_input["jobID"], "taskID": translate_wf_input["taskID"],
                    "recordID": str(translate_wf_input["jobID"]) + "|" + str(file_id), "transInput": translate_wf_input,
                    "totalSentences": 0, "translatedSentences": 0, "skippedSentences": 0, "data": data
                }
                repo.create(db_in)
                return True
        except Exception as e:
            log_exception("Exception while dumping content to DB: " + str(e), translate_wf_input, e)
            return None

    # Method to push sentences of the file to nmt for translation
    def push_sentences_to_nmt(self, file, translate_wf_input):
        try:
            log_info("File translation producer end.. jobID: " + str(translate_wf_input["jobID"]), translate_wf_input)
            record_id = str(translate_wf_input["jobID"]) + "|" + str(file["path"])
            content_from_db = self.get_content_from_db(record_id, None, translate_wf_input)
            if not content_from_db:
                log_error("CONTENT_FETCH_FAILED", "File content from DB couldn't be fetched, jobID: " + str(translate_wf_input["jobID"]), translate_wf_input, None)
                return None
            content_from_db = content_from_db[0]
            data = content_from_db["data"]
            if not data:
                log_error("NO_DATA_DB", "No data for file, jobID: " + str(translate_wf_input["jobID"]), translate_wf_input, None)
                return None
            pages = data["result"]
            total_sentences = 0
            for page in pages:
                sentences_per_page = 0
                batches = self.fetch_batches_of_sentences(file, record_id, page, translate_wf_input)
                if not batches:
                    log_error("No batches obtained for page: " + str(page["page_no"]), translate_wf_input, None)
                    continue
                for batch_no in batches.keys():
                    batch = batches[batch_no]
                    record_id_enhanced = record_id + "|" + str(len(batch))
                    nmt_in = {
                        "url_end_point": file["model"]["url_end_point"],
                        "record_id": record_id_enhanced, "message": batch
                    }
                    producer.produce(nmt_in, anu_nmt_input_topic)
                    sentences_per_page += len(batch)
                    total_sentences += len(batch)
                log_info("PAGE NO: " + str(page["page_no"]) + " | SENTENCES: " + str(sentences_per_page), translate_wf_input)
            if total_sentences > 0:
                repo.update({"totalSentences": total_sentences}, {"recordID": record_id})
                log_info("recordID: " + record_id + " | TOTAL NO. OF SENTENCES SENT TO NMT : " + str(total_sentences), translate_wf_input)
                return True
            else:
                log_error("No sentences sent to NMT, recordID: " + record_id, translate_wf_input, None)
                return None
        except Exception as e:
            log_exception("Exception while pushing sentences to NMT: " + str(e), translate_wf_input, e)
            return None

    # Method to fetch batches for sentences from the file
    def fetch_batches_of_sentences(self, file, record_id, page, translate_wf_input):
        try:
            log_info("Building batches of sentences for page: " + str(page["page_no"]), translate_wf_input)
            sentences_for_trans = {}
            page_no = page["page_no"]
            text_blocks = page["text_blocks"]
            if text_blocks:
                batch_key = 0
                for block in text_blocks:
                    block_id = block["block_id"]
                    if 'tokenized_sentences' in block.keys():
                        for sentence in block["tokenized_sentences"]:
                            node_id = str(record_id) + "|" + str(page_no) + "|" + str(block_id)
                            sent_nmt_in = {
                                "src": sentence["src_text"],
                                "s_id": sentence["sentence_id"],
                                "id": file["model"]["model_id"],
                                "n_id": node_id
                            }
                            if batch_key in sentences_for_trans.keys():
                                sentence_list = sentences_for_trans[batch_key]
                                sentence_list.append(sent_nmt_in)
                                sentences_for_trans[batch_key] = sentence_list
                            else:
                                sentence_list = [sent_nmt_in]
                                sentences_for_trans[batch_key] = sentence_list
                            if len(sentences_for_trans[batch_key]) == nmt_max_batch_size:
                                batch_key += 1
                    else:
                        log_error("There are no tokenised sentences in block: " + str(block_id), translate_wf_input, None)
                        continue
                return sentences_for_trans
            else:
                log_error("There are no text blocks for this page: " + str(page_no), translate_wf_input, None)
                return None
        except Exception as e:
            log_exception("Exception while fetching batch of sentences: " + str(e), translate_wf_input, e)
            return None


    # Method to process the output received from the NMT
    def process_nmt_output(self, nmt_output):
        try:
            nmt_output = nmt_output["out"]
            record_id = nmt_output["record_id"]
            recordid_split = str(record_id).split("|")
            job_id, file_id, batch_size = recordid_split[0], recordid_split[1], eval(recordid_split[2])
            record_id = str(recordid_split[0]) + "|" + str(recordid_split[1])
            translate_wf_input = {"jobID": job_id}
            file = self.get_content_from_db(record_id, None, translate_wf_input)
            if not file:
                log_error("There is no data for this recordID: " + str(record_id), translate_wf_input, nmt_output["status"])
                return None
            file = file[0]
            skip_count = 0
            trans_count = 0
            translate_wf_input = file["transInput"]
            if 'status' in nmt_output.keys():
                if 'statusCode' in nmt_output["status"].keys():
                    if nmt_output["status"]["statusCode"] != 200:
                        skip_count += batch_size
                        log_error("Error from NMT: " + str(nmt_output["status"]["why"]), translate_wf_input, nmt_output["status"])
            if 'response_body' in nmt_output.keys():
                sentences_of_the_batch = []
                for response in nmt_output["response_body"]:
                    node_id = response["n_id"]
                    if not node_id:
                        log_error("Node ID missing!", translate_wf_input, None)
                        skip_count += 1
                        continue
                    sentences_of_the_batch.append(response)
                try:
                    self.update_sentences(record_id, sentences_of_the_batch, translate_wf_input)  # Find a way to do batch update directly on MongoDB
                    trans_count += len(sentences_of_the_batch)
                except Exception as e:
                    log_exception("Exception while saving translations: " + str(e), translate_wf_input, e)
                    skip_count += len(sentences_of_the_batch)
            content_from_db = self.get_content_from_db(record_id, None, translate_wf_input)[0]
            total_trans = content_from_db["translatedSentences"] + trans_count
            total_skip = content_from_db["skippedSentences"] + skip_count
            query = {"recordID": record_id}
            object_in = {"skippedSentences": total_skip, "translatedSentences": total_trans}
            repo.update(object_in, query)
            log_info("Batch processed, TRANSLATED: " + str(trans_count) + " and SKIPPED: "+str(skip_count), translate_wf_input)
        except Exception as e:
            log_exception("Exception while processing NMT output: " + str(e), None, e)

    # Method to search data from db
    def get_content_from_db(self, record_id, page_no, translate_wf_input):
        try:
            query = {"recordID": record_id}
            if page_no:
                query['data.page_no'] = page_no
            exclude = {'_id': False}
            result = repo.search(query, exclude)
            return result
        except Exception as e:
            log_exception("Exception while searching from db: " + str(e), translate_wf_input, e)
            return None

    # Back up method to update sentences from DB.
    def update_sentences(self, record_id, nmt_res_batch, translate_wf_input):
        job_details = self.get_content_from_db(record_id, None, translate_wf_input)[0]
        for nmt_res_sentence in nmt_res_batch:
            node = str(nmt_res_sentence["n_id"]).split("|")
            page_no, block_id = node[2], node[3]
            p_index, b_index, s_index = None, None, None
            sentence_id = nmt_res_sentence["s_id"]
            pages = job_details["data"]["result"]
            for i, page in enumerate(pages):
                if str(page["page_no"]) == str(page_no):
                    p_index = i
                    break
            page = pages[p_index]
            for j, block in enumerate(page["text_blocks"]):
                if str(block["block_id"]) == str(block_id):
                    b_index = j
                    break
            block = page["text_blocks"][b_index]
            for k, sentence in enumerate(block["tokenized_sentences"]):
                if str(sentence["sentence_id"]) == str(sentence_id):
                    s_index = k
                    break
            nmt_res_sentence["sentence_id"] = nmt_res_sentence["s_id"]
            job_details["data"]["result"][p_index]["text_blocks"][b_index]["tokenized_sentences"][s_index] = nmt_res_sentence
        query = {"recordID": record_id}
        object_in = {"data.result": job_details["data"]["result"]}
        repo.update(object_in, query)





