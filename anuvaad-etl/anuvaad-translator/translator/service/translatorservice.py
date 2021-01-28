import multiprocessing
import time

import uuid
from functools import partial
from multiprocessing import Process
from utilities.translatorutils import TranslatorUtils
from kafkawrapper.translatorproducer import Producer
from repository.translatorrepository import TranslatorRepository
from tmx.tmxrepo import TMXRepository
from tmx.tmxservice import TMXService
from anuvaad_auditor.loghandler import log_exception, log_error, log_info
from anuvaad_auditor.errorhandler import post_error, post_error_wf
from configs.translatorconfig import nmt_max_batch_size
from configs.translatorconfig import anu_translator_output_topic
from configs.translatorconfig import tool_translator
from configs.translatorconfig import anu_nmt_input_topic_mx
from configs.translatorconfig import tmx_enabled
from configs.translatorconfig import tmx_global_enabled
from configs.translatorconfig import no_of_process

current_nmt = 0
topics_map = {}

utils = TranslatorUtils()
producer = Producer()
repo = TranslatorRepository()
tmx_repo = TMXRepository()
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
        error, error_list = None, []
        for file in translate_wf_input["input"]["files"]:
            try:
                dumped = self.dump_file_to_db(file["path"], translate_wf_input)
                if not dumped:
                    error_list.append({"inputFile": str(file["path"]), "outputFile": "FAILED",
                                       "error": "File received couldn't be downloaded"})
                    error = post_error("FILE_DOWNLOAD_FAILED", "File received couldn't be downloaded!", None)
                else:
                    translation_process = Process(target=self.push_sentences_to_nmt, args=(file, translate_wf_input))
                    translation_process.start()
                    log_info("Worker process forked..", translate_wf_input)
                    #self.push_sentences_to_nmt(file, translate_wf_input)
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
                    "totalSentences": -1, "translatedSentences": -2, "skippedSentences": -2, "batches": 0, "data": data, "active": True
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
                log_exception("File content from DB couldn't be fetched, jobID: " + str(translate_wf_input["jobID"]),
                          translate_wf_input, None)
            content_from_db = content_from_db[0]
            data = content_from_db["data"]
            if not data:
                log_exception("No data for file, jobID: " + str(translate_wf_input["jobID"]), translate_wf_input, None)
                repo.update({"totalSentences": 0}, {"recordID": record_id})
            pages = data["result"]
            total_sentences, total_tmx, total_batches = 0, 0, 0
            tmx_file_cache = {}
            log_info("TMX File Cache Size (Start) : " + str(len(tmx_file_cache.keys())), translate_wf_input)
            tmx_present = self.is_tmx_present(file, translate_wf_input)
            topic = self.nmt_router()
            pool = multiprocessing.Pool(no_of_process)
            func = partial(self.page_processor, record_id=record_id, file=file, tmx_present=tmx_present,
                           tmx_file_cache=tmx_file_cache, topic=topic, translate_wf_input=translate_wf_input)
            page_processors = pool.map_async(func, pages).get()
            for page_result in page_processors:
                total_batches += page_result[0]
                total_sentences += page_result[1]
                total_tmx += page_result[2]
            if total_sentences > 0:
                repo.update({"totalSentences": total_sentences, "batches": total_batches}, {"recordID": record_id})
                log_info("recordID: " + record_id + " | PAGES: " + str(len(pages)) + " | BATCHES: " + str(total_batches)
                         + " | SENTENCES: " + str(total_sentences) + " | TMX: " + str(total_tmx), translate_wf_input)
                log_info("TMX File Cache Size (End) : " + str(len(tmx_file_cache.keys())), translate_wf_input)
            else:
                repo.update({"totalSentences": 0}, {"recordID": record_id})
                log_exception("No sentences sent to NMT, recordID: " + record_id, translate_wf_input, None)
        except Exception as e:
            log_exception("Exception while pushing sentences to NMT: " + str(e), translate_wf_input, e)
            post_error_wf("TRANSLATION_FAILED", "Exception while pushing sentences to NMT: " + str(e), translate_wf_input, e)

    # Computes batches for every page and pushes to NMT for translation.
    def page_processor(self, page, record_id, file, tmx_present, tmx_file_cache, topic, translate_wf_input):
        batches, pw_dict, bw_data = self.fetch_batches_of_sentences(file, record_id, page, tmx_present, tmx_file_cache,
                                                                    translate_wf_input)
        batches_count, sentences_count, tmx_count = 0, 0, 0
        if not batches:
            log_error("No batches obtained for page: " + str(page["page_no"]), translate_wf_input, None)
            return batches_count, sentences_count
        batches_count, tmx_count = len(batches), pw_dict["tmx_count"]
        for batch_id in batches.keys():
            batch = batches[batch_id]
            record_id_enhanced = record_id + "|" + str(len(batch))
            nmt_in = {"record_id": record_id_enhanced, "id": file["model"]["model_id"], "message": batch}
            producer.produce(nmt_in, topic)
            log_info("B_ID: " + batch_id + " | SENTENCES: " + str(len(batch)) +
                     " | COMPUTED: " + str(bw_data[batch_id]["computed"]) + " | TMX: " + str(
                bw_data[batch_id]["tmx_count"]), translate_wf_input)
            sentences_count += len(batch)
        return batches_count, sentences_count, tmx_count

    # Method to fetch batches for sentences from the file for a page.
    def fetch_batches_of_sentences(self, file, record_id, page, tmx_present, tmx_file_cache, translate_wf_input):
        try:
            sentences_for_trans, pw_dict, bw_data = {}, {}, {}
            page_no = page["page_no"]
            text_blocks = page["text_blocks"]
            if text_blocks:
                sentences_for_trans, pw_dict, bw_data = self.fetch_batches_of_blocks(record_id, page_no, text_blocks, file,
                                                                              tmx_present,  tmx_file_cache, translate_wf_input)
            else:
                log_error("There are no text blocks for this page: " + str(page_no), translate_wf_input, None)
            return sentences_for_trans, pw_dict, bw_data
        except Exception as e:
            log_exception("Exception while fetching batch of sentences: " + str(e), translate_wf_input, e)
            return None

    # Iterates through the blocks and creates batches of sentences for translation
    def fetch_batches_of_blocks(self, record_id, page_no, text_blocks, file, tmx_present, tmx_file_cache, translate_wf_input):
        batch_id, tmx_count, computed = str(uuid.uuid4()), 0, 0
        sentences_for_trans, batch_wise_tmx, bw_tmx_count, bw_computed_count = {}, {}, 0, 0
        for block in text_blocks:
            block_id = block["block_id"]
            if 'tokenized_sentences' in block.keys():
                for sentence in block["tokenized_sentences"]:
                    tmx_phrases = []
                    if tmx_present:
                        tmx_phrases, res_dict = self.fetch_tmx(sentence["src"], file, tmx_present, tmx_file_cache, translate_wf_input)
                        bw_tmx_count += len(tmx_phrases)
                        bw_computed_count += res_dict["computed"]
                    node_id = str(record_id) + "|" + str(page_no) + "|" + str(block_id)
                    sent_nmt_in = {"src": sentence["src"], "s_id": sentence["s_id"], "n_id": node_id,
                                   "batch_id": batch_id, "tmx_phrases": tmx_phrases}
                    if batch_id in sentences_for_trans.keys():
                        sentence_list = sentences_for_trans[batch_id]
                        sentence_list.append(sent_nmt_in)
                        sentences_for_trans[batch_id] = sentence_list
                    else:
                        sentence_list = [sent_nmt_in]
                        sentences_for_trans[batch_id] = sentence_list
                    batch_wise_tmx[batch_id] = {"tmx_count": bw_tmx_count, "computed": bw_computed_count}
                    if len(sentences_for_trans[batch_id]) == nmt_max_batch_size:
                        batch_id, bw_tmx_count, bw_computed_count = str(uuid.uuid4()), 0, 0
            else:
                log_error("There are no tokenised sentences in block: " + str(block_id), translate_wf_input, None)
                continue
        for batch in batch_wise_tmx.keys():
            tmx_count += batch_wise_tmx[batch]["tmx_count"]
        return sentences_for_trans, {"tmx_count": tmx_count}, batch_wise_tmx

    # Checks if org level or user level TMX is applicable to the file under translation.
    def is_tmx_present(self, file, translate_wf_input):
        if tmx_enabled:
            if 'context' not in file.keys():
                return False
            user_id = translate_wf_input["metadata"]["userID"]
            org_id = translate_wf_input["metadata"]["orgID"]
            locale = file["model"]["source_language_code"] + "|" + file["model"]["target_language_code"]
            tmx_entries = tmx_repo.search_tmx_db(user_id, org_id, locale)
            if tmx_entries:
                if tmx_entries == "USER":
                    log_info("Only USER level TMX available for this user!", translate_wf_input)
                elif tmx_entries == "ORG":
                    log_info("Only ORG level TMX available for this user!", translate_wf_input)
                else:
                    log_info("USER and ORG level TMX available for this user!", translate_wf_input)
                return tmx_entries
            else:
                log_info("No USER or ORG TMX entries available for this user!", translate_wf_input)
                return tmx_global_enabled
        return False

    # Fetches tmx phrases
    def fetch_tmx(self, sentence, file, tmx_level, tmx_file_cache, translate_wf_input):
        context = file["context"]
        user_id = translate_wf_input["metadata"]["userID"]
        org_id = translate_wf_input["metadata"]["orgID"]
        locale = file["model"]["source_language_code"] + "|" + file["model"]["target_language_code"]
        if tmx_level not in ["USER", "ORG", "BOTH"]:
            tmx_level = None
        tmx_phrases, res_dict = tmxservice.get_tmx_phrases(user_id, org_id, context, locale, sentence, tmx_level,
                                                           tmx_file_cache, translate_wf_input)
        return tmx_phrases, res_dict

    # Distributes the NMT traffic across machines.
    def nmt_router(self):
        global current_nmt
        global topics_map
        if not topics_map:
            input_topics = list(str(anu_nmt_input_topic_mx).split(","))
            topics_map = {}
            for i, topic in enumerate(input_topics):
                topics_map[i] = topic
        topic = topics_map[current_nmt]
        current_nmt += 1
        if current_nmt == len(topics_map.keys()):
            current_nmt = 0
        return topic

    # Consumer record handler
    def process_nmt_output(self, nmt_output):
        job_id = str(nmt_output["out"]["record_id"]).split("|")[0]
        translate_wf_input = {"jobID": job_id, "metadata": {"module": tool_translator}}
        nmt_consume_process = Process(target=self.process_translation, args=nmt_output)
        nmt_consume_process.start()
        log_info("NMT Translation Process forked...", translate_wf_input)
        return

    # Method to process the output received from the NMT
    def process_translation(self, nmt_output):
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
            file, skip_count, trans_count, batch_id = file[0], 0, 0, None
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
                    batch_id = response["batch_id"]
                    sentences_of_the_batch.append(response)
                try:
                    self.update_sentences(record_id, sentences_of_the_batch,
                                          translate_wf_input)  # Find a way to do batch update directly on MongoDB
                    trans_count += len(sentences_of_the_batch)
                except Exception as e:
                    log_exception("Exception while saving translations to DB: " + str(e), translate_wf_input, e)
                    skip_count += len(sentences_of_the_batch)
            self.update_translation_status(record_id, batch_id, trans_count, skip_count, translate_wf_input)
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
    def update_translation_status(self, record_id, batch_id, trans_count, skip_count, translate_wf_input):
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
        log_info("Status -- B_ID: " + str(batch_id) + " (T: " + str(trans_count) + ", S: " + str(skip_count) + ")" +
                 " | TT: " + str(total_trans) + " | TS: " + str(total_skip) + " | recordID: " + translate_wf_input["recordID"], translate_wf_input)

    # Back up method to update sentences from DB.
    def update_sentences(self, record_id, nmt_res_batch, translate_wf_input):
        job_details = self.get_content_from_db(record_id, None, translate_wf_input)[0]
        sentence_ids = []
        for nmt_res_sentence in nmt_res_batch:
            node = str(nmt_res_sentence["n_id"]).split("|")
            if nmt_res_sentence["tmx_phrases"]:
                log_info("PAGE NO: " + str(node[2]) + " BATCH ID: " + nmt_res_sentence["batch_id"] + " | SRC: " + nmt_res_sentence["src"] +
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
            if p_index is not None and b_index is not None and s_index is not None:
                job_details["data"]["result"][p_index]["text_blocks"][b_index]["tokenized_sentences"][
                    s_index] = nmt_res_sentence
        query = {"recordID": record_id}
        object_in = {"data.result": job_details["data"]["result"]}
        repo.update(object_in, query)
