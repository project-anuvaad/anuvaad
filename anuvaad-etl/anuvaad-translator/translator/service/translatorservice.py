import time

import uuid
from utilities.translatorutils import TranslatorUtils
from kafkawrapper.translatorproducer import Producer
from repository.translatorrepository import TranslatorRepository
from tmx.tmxservice import TMXService
from anuvaad_auditor.loghandler import log_exception, log_error, log_info
from anuvaad_auditor.errorhandler import post_error
from configs.translatorconfig import nmt_max_batch_size
from configs.translatorconfig import anu_nmt_input_topic
from configs.translatorconfig import anu_translator_output_topic
from configs.translatorconfig import tool_translator
from configs.translatorconfig import tmx_default_context

utils = TranslatorUtils()
producer = Producer()
repo = TranslatorRepository()
tmxservice = TMXService()


class TranslatorService:
    def __init__(self):
        pass

    # Service method to begin translation for document translation flow.
    def start_file_translation(self, translate_wf_input):
        duplicate_jobs = repo.search({"jobID": translate_wf_input["jobID"]}, {'_id': False})
        if duplicate_jobs:
            log_info("Duplicate Job, jobID: " + str(translate_wf_input["jobID"]), translate_wf_input)
            return None
        translate_wf_input["taskID"] = utils.generate_task_id()
        translate_wf_input["taskStartTime"] = eval(str(time.time()).replace('.', '')[0:13])
        translate_wf_input["state"] = "TRANSLATED"
        log_info("Translator process initiated... jobID: " + str(translate_wf_input["jobID"]), translate_wf_input)
        error_list = []
        error = None
        for file in translate_wf_input["input"]["files"]:
            try:
                dumped = self.dump_file_to_db(file["path"], translate_wf_input)
                if not dumped:
                    error_list.append({"inputFile": str(file["path"]), "outputFile": "FAILED",
                                       "error": "File received couldn't be downloaded"})
                    error = post_error("FILE_DOWNLOAD_FAILED", "File received couldn't be downloaded!", None)
                else:
                    pushed = self.push_sentences_to_nmt(file, translate_wf_input)
                    if not pushed:
                        error_list.append({"inputFile": str(file["path"]), "outputFile": "FAILED",
                                           "error": "Error while pushing sentences to NMT"})
                        error = post_error("NMT_PUSH_FAILED", "Error while pushing sentences to NMT", None)
            except Exception as e:
                log_exception("Exception while posting sentences to NMT: " + str(e), translate_wf_input, e)
                continue
        if error_list and error is not None:
            translate_wf_input["output"], translate_wf_input["status"] = error_list, "FAILED"
            translate_wf_input["error"] = error
            translate_wf_input["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
            producer.produce(translate_wf_input, anu_translator_output_topic)
            return {"status": "failed", "message": "Some/All files failed"}
        return {"status": "success", "message": "Sentences sent to NMT"}

    # Method to download and dump the content of the file present in the input
    def dump_file_to_db(self, file_id, translate_wf_input):
        try:
            log_info("Downloading File....", translate_wf_input)
            data = utils.download_file(file_id, translate_wf_input)
            if not data:
                log_error("File received on input couldn't be downloaded!", translate_wf_input, None)
                return False
            else:
                log_info("Dumping content to translator DB......", translate_wf_input)
                db_in = {
                    "jobID": translate_wf_input["jobID"], "taskID": translate_wf_input["taskID"],
                    "recordID": str(translate_wf_input["jobID"]) + "|" + str(file_id), "transInput": translate_wf_input,
                    "totalSentences": -1, "translatedSentences": -2, "skippedSentences": -2, "data": data
                }
                repo.create(db_in)
                return True
        except Exception as e:
            log_exception("Exception while dumping content to DB: " + str(e), translate_wf_input, e)
            return None

    # Method to push sentences of the file to nmt for translation
    def push_sentences_to_nmt(self, file, translate_wf_input):
        try:
            log_info("File translation started... " + str(translate_wf_input["jobID"]), translate_wf_input)
            record_id = str(translate_wf_input["jobID"]) + "|" + str(file["path"])
            content_from_db = self.get_content_from_db(record_id, None, translate_wf_input)
            if not content_from_db:
                log_error("File content from DB couldn't be fetched, jobID: " + str(translate_wf_input["jobID"]),
                          translate_wf_input, None)
                return None
            content_from_db = content_from_db[0]
            data = content_from_db["data"]
            if not data:
                log_error("No data for file, jobID: " + str(translate_wf_input["jobID"]), translate_wf_input, None)
                repo.update({"totalSentences": 0}, {"recordID": record_id})
                return None
            pages = data["result"]
            total_sentences, total_tmx = 0, 0
            for page in pages:
                sentences_per_page = 0
                batches, tmx_count = self.fetch_batches_of_sentences(file, record_id, page, translate_wf_input)
                if not batches:
                    log_error("No batches obtained for page: " + str(page["page_no"]), translate_wf_input, None)
                    continue
                for batch_no in batches.keys():
                    batch = batches[batch_no]
                    record_id_enhanced = record_id + "|" + str(len(batch))
                    nmt_in = {"record_id": record_id_enhanced, "message": batch}
                    producer.produce(nmt_in, anu_nmt_input_topic)
                    sentences_per_page += len(batch)
                    total_sentences += len(batch)
                total_tmx += tmx_count
                log_info("PAGE NO: " + str(page["page_no"]) + " | SENTENCES: " + str(sentences_per_page) + " | TMX: " + str(tmx_count), translate_wf_input)
            if total_sentences > 0:
                repo.update({"totalSentences": total_sentences}, {"recordID": record_id})
                log_info("recordID: " + record_id + " | SENTENCES: " + str(total_sentences) + " | TMX: " + str(total_tmx), translate_wf_input)
                return True
            else:
                log_error("No sentences sent to NMT, recordID: " + record_id, translate_wf_input, None)
                repo.update({"totalSentences": 0}, {"recordID": record_id})
                return None
        except Exception as e:
            log_exception("Exception while pushing sentences to NMT: " + str(e), translate_wf_input, e)
            return None

    # Method to fetch batches for sentences from the file for a page.
    def fetch_batches_of_sentences(self, file, record_id, page, translate_wf_input):
        try:
            log_info("Building batches of sentences for page: " + str(page["page_no"]), translate_wf_input)
            sentences_for_trans, tmx_count = {}, 0
            page_no = page["page_no"]
            text_blocks = page["text_blocks"]
            if text_blocks:
                sentences_for_trans, tmx_count = self.fetch_batches_of_blocks(record_id, page_no, text_blocks, file,
                                                                              sentences_for_trans, translate_wf_input)
            else:
                log_error("There are no text blocks for this page: " + str(page_no), translate_wf_input, None)
            return sentences_for_trans, tmx_count
        except Exception as e:
            log_exception("Exception while fetching batch of sentences: " + str(e), translate_wf_input, e)
            return None

    # Iterates through the blocks and creates batches of sentences for translation
    def fetch_batches_of_blocks(self, record_id, page_no, text_blocks, file, sentences_for_trans, translate_wf_input):
        batch_key, tmx_count = 0, 0
        for block in text_blocks:
            block_id = block["block_id"]
            if 'tokenized_sentences' in block.keys():
                for sentence in block["tokenized_sentences"]:
                    tmx_phrases = self.fetch_tmx(sentence["src"], file, translate_wf_input)
                    tmx_count += len(tmx_phrases)
                    node_id = str(record_id) + "|" + str(page_no) + "|" + str(block_id)
                    sent_nmt_in = {"src": sentence["src"], "s_id": sentence["s_id"], "id": file["model"]["model_id"],
                                   "n_id": node_id, "tmx_phrases": tmx_phrases}
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
        return sentences_for_trans, tmx_count

    # Fetches tmx phrases
    def fetch_tmx(self, sentence, file, translate_wf_input):
        if 'context' not in file.keys():
            return []
        context = file["context"]
        user_id = translate_wf_input["metadata"]["userID"]
        org_id = None
        if 'orgID' in file.keys():
            org_id = file["orgID"]
        locale = file["model"]["source_language_code"] + "|" + file["model"]["target_language_code"]
        return tmxservice.get_tmx_phrases(user_id, org_id, context, locale, sentence)

    # Method to process the output received from the NMT
    def process_nmt_output(self, nmt_output):
        try:
            nmt_output = nmt_output["out"]
            record_id = nmt_output["record_id"]
            recordid_split = str(record_id).split("|")
            job_id, file_id, batch_size = recordid_split[0], recordid_split[1], eval(recordid_split[2])
            record_id = str(recordid_split[0]) + "|" + str(recordid_split[1])
            translate_wf_input = {"jobID": job_id, "metadata": {"module": tool_translator}}
            file = self.get_content_from_db(record_id, None, translate_wf_input)
            if not file:
                log_error("There is no data for this recordID: " + str(record_id), translate_wf_input,
                          nmt_output["status"])
                return None
            file, skip_count, trans_count = file[0], 0, 0
            translate_wf_input = file["transInput"]
            translate_wf_input["recordID"] = record_id
            if 'status' in nmt_output.keys():
                if 'statusCode' in nmt_output["status"].keys():
                    if nmt_output["status"]["statusCode"] != 200:
                        skip_count += batch_size
                        log_error("Error from NMT: " + str(nmt_output["status"]["why"]), translate_wf_input,
                                  nmt_output["status"])
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
                    self.update_sentences(record_id, sentences_of_the_batch,
                                          translate_wf_input)  # Find a way to do batch update directly on MongoDB
                    trans_count += len(sentences_of_the_batch)
                except Exception as e:
                    log_exception("Exception while saving translations: " + str(e), translate_wf_input, e)
                    skip_count += len(sentences_of_the_batch)
            self.update_translation_status(record_id, trans_count, skip_count, translate_wf_input)
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

    # Updates the no of sentences translated after every iteration.
    def update_translation_status(self, record_id, trans_count, skip_count, translate_wf_input):
        content_from_db = self.get_content_from_db(record_id, None, translate_wf_input)[0]
        if content_from_db["translatedSentences"] < 0:
            total_trans = trans_count
        else:
            total_trans = content_from_db["translatedSentences"] + trans_count
        if content_from_db["skippedSentences"] < 0:
            total_skip = skip_count
        else:
            total_skip = content_from_db["skippedSentences"] + skip_count
        query = {"recordID": record_id}
        object_in = {"skippedSentences": total_skip, "translatedSentences": total_trans}
        repo.update(object_in, query)
        log_info("Batch processed, TRANSLATED: " + str(trans_count) + " | SKIPPED: " + str(skip_count) +
                 " | recordID: " + translate_wf_input["recordID"], translate_wf_input)

    # Back up method to update sentences from DB.
    def update_sentences(self, record_id, nmt_res_batch, translate_wf_input):
        job_details = self.get_content_from_db(record_id, None, translate_wf_input)[0]
        sentence_ids = []
        for nmt_res_sentence in nmt_res_batch:
            node = str(nmt_res_sentence["n_id"]).split("|")
            if nmt_res_sentence["tmx_phrases"]:
                log_info("PAGE NO: " + str(node[2]) + " | SRC: " + nmt_res_sentence["src"] +
                         " | TGT: " + nmt_res_sentence["tgt"] + " | TMX Count: " + str(len(nmt_res_sentence["tmx_phrases"])), translate_wf_input)
                nmt_res_sentence["tgt"] = tmxservice.replace_nmt_tgt_with_user_tgt(nmt_res_sentence["tmx_phrases"], nmt_res_sentence["tgt"], translate_wf_input)
            page_no, block_id = node[2], node[3]
            p_index, b_index, s_index = None, None, None
            sentence_id = nmt_res_sentence["s_id"]
            if sentence_id in sentence_ids:
                log_info("Repeated Sentence: " + str(sentence_id), translate_wf_input)
            else:
                sentence_ids.append(sentence_id)
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
                if str(sentence["s_id"]) == str(sentence_id):
                    s_index = k
                    break
            job_details["data"]["result"][p_index]["text_blocks"][b_index]["tokenized_sentences"][
                s_index] = nmt_res_sentence
        query = {"recordID": record_id}
        object_in = {"data.result": job_details["data"]["result"]}
        repo.update(object_in, query)
