import json
import multiprocessing
import os
import random
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
from configs.translatorconfig import nmt_max_batch_size, anu_translator_output_topic, tool_translator, \
    anu_nmt_input_topic
from configs.translatorconfig import tmx_enabled, tmx_global_enabled, no_of_process, user_translation_enabled, \
    tmx_disable_roles, utm_disable_roles
from configs.translatorconfig import orgs_nmt_disable, total_no_of_partitions, anu_translator_nonmt_topic, \
    fetch_user_translation_url

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
                                       "error": "File is either empty or  couldn't be downloaded!"})
                    error = post_error("FILE_DUMP_FAILED", "File is either empty or  couldn't be downloaded!", None)
                else:
                    translation_process = Process(target=self.push_sentences_to_nmt, args=(file, translate_wf_input))
                    translation_process.start()
            except Exception as e:
                log_exception("Exception while posting sentences to NMT: " + str(e), translate_wf_input, e)
                continue
        if error_list and error is not None:
            translate_wf_input["output"], translate_wf_input["status"] = error_list, "FAILED"
            translate_wf_input["error"] = error
            translate_wf_input["taskEndTime"] = eval(str(time.time()).replace('.', '')[0:13])
            log_info("Input to kafka topic: "+translate_wf_input,translate_wf_input)
            producer.produce(translate_wf_input, anu_translator_output_topic, None)
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
                modified_pages = []
                pages = data["result"]
                for page in pages:
                    page["record_id"] = str(translate_wf_input["jobID"]) + "|" + str(file_id)
                    modified_pages.append(page)
                repo.write_pages(modified_pages)
                log_info("Pages dumped to Translator DB!", translate_wf_input)
                db_in = {
                    "jobID": translate_wf_input["jobID"], "taskID": translate_wf_input["taskID"],
                    "recordID": str(translate_wf_input["jobID"]) + "|" + str(file_id), "transInput": translate_wf_input,
                    "totalSentences": -1, "batches": -1, "active": True}
                repo.create(db_in)
                log_info("Translation status dumped to Translator DB!", translate_wf_input)
                return True
        except Exception as e:
            log_exception("Exception while dumping content to DB: " + str(e), translate_wf_input, e)
            return None

    # Method to push sentences of the file to nmt for translation
    def push_sentences_to_nmt(self, file, translate_wf_input):
        try:
            log_info("File translation started... " + str(translate_wf_input["jobID"]), translate_wf_input)
            record_id = str(translate_wf_input["jobID"]) + "|" + str(file["path"])
            content_from_db = self.get_content_from_db(record_id, None, None, translate_wf_input)
            if not content_from_db:
                log_exception("File content from DB couldn't be fetched, jobID: " + str(translate_wf_input["jobID"]),
                              translate_wf_input, None)
                post_error_wf("TRANSLATION_FAILED",
                              "File content from DB couldn't be fetched, jobID: " + str(translate_wf_input["jobID"]),
                              translate_wf_input, None)
                return
            pages = repo.fetch_pages({"record_id": record_id})
            total_sentences, total_tmx, total_batches, tmx_file_cache = 0, 0, 0, {}
            tmx_file_cache = {}
            tmx_present, nonmt_user = \
                utils.get_rbac_tmx_utm(translate_wf_input["metadata"]["roles"], translate_wf_input, True)[0], False
            if tmx_present:
                tmx_present = self.is_tmx_present(file, translate_wf_input)
            if translate_wf_input["metadata"]["orgID"] in list(str(orgs_nmt_disable).split(",")):
                log_info("NoNMT ORGS!"+str(orgs_nmt_disable),orgs_nmt_disable)
                log_info("Job belongs to NONMT type!"+str(orgs_nmt_disable), translate_wf_input)
                tmx_present, nonmt_user = False, True
            pool = multiprocessing.Pool(no_of_process)
            connection_details = file["model"]["connection_details"]
            if connection_details["kafka"]:
                log_info("Translating via Kafka....", translate_wf_input)
                func = partial(self.page_processor, record_id=record_id, file=file, tmx_present=tmx_present,
                               nonmt_user=nonmt_user, tmx_file_cache=tmx_file_cache,
                               translate_wf_input=translate_wf_input)
                page_processors = pool.map_async(func, pages).get()
                for page_result in page_processors:
                    total_batches += page_result[0]
                    total_sentences += page_result[1]
                    total_tmx += page_result[2]
            else:
                log_info("Translating via third-party API....", translate_wf_input)
                for page in pages:
                    page_result = self.page_processor_via_api(page, record_id, file, tmx_present, nonmt_user,
                                                              tmx_file_cache, translate_wf_input)
                    if not page_result:
                        break
                    total_batches += page_result[0]
                    total_sentences += page_result[1]
                    total_tmx += page_result[2]
            if total_sentences > 0:
                repo.update({"totalSentences": total_sentences, "batches": total_batches}, {"recordID": record_id})
                log_info("recordID: " + record_id + " | PAGES: " + str(len(pages)) + " | BATCHES: " + str(total_batches)
                         + " | SENTENCES: " + str(total_sentences) + " | TMX: " + str(total_tmx), translate_wf_input)
            else:
                repo.update({"totalSentences": 0, "batches": 0}, {"recordID": record_id})
                log_exception("No sentences sent to NMT, recordID: " + record_id, translate_wf_input, None)
        except Exception as e:
            log_exception("Exception while pushing sentences to NMT: " + str(e), translate_wf_input, e)
            post_error_wf("TRANSLATION_FAILED", "Exception while pushing sentences to NMT: " + str(e),
                          translate_wf_input, e)

    # Computes batches for every page and pushes to NMT for translation via the kafka queue.
    def page_processor(self, page, record_id, file, tmx_present, nonmt_user, tmx_file_cache, translate_wf_input):
        batches, pw_dict, bw_data = self.fetch_batches_of_sentences(file, record_id, page, tmx_present, tmx_file_cache,
                                                                    False, translate_wf_input)
        batches_count, sentences_count, tmx_count = 0, 0, 0
        if not batches:
            log_error("No batches obtained for page: " + str(page["page_no"]), translate_wf_input, None)
            return batches_count, sentences_count, tmx_count
        batches_count, tmx_count = len(batches), pw_dict["tmx_count"]
        partition = random.choice(
            list(range(0, total_no_of_partitions)))  # So that all batches of a page go to the same consumer
        topic = self.get_nmt_in_topic(translate_wf_input, file)
        for batch_id in batches.keys():
            batch = batches[batch_id]
            record_id_enhanced = record_id + "|" + str(len(batch))
            nmt_in = {"record_id": record_id_enhanced, "id": file["model"]["model_id"], "message": batch}
            nmt_in["source_language_code"] = translate_wf_input["input"]["files"]["model"]["source_language_code"]
            nmt_in["target_language_code"] = translate_wf_input["input"]["files"]["model"]["target_language_code"]
            log_info("NMT INPUT DATA"+str(nmt_in)+"TO TOPIC:"+str(topic),translate_wf_input)
            if nonmt_user:
                producer.produce(nmt_in, anu_translator_nonmt_topic, partition)
            else:
                producer.produce(nmt_in, topic, partition)
            log_info("B_ID: " + batch_id + " | SENTENCES: " + str(len(batch)) +
                     " | COMPUTED: " + str(bw_data[batch_id]["computed"]) + " | TMX: " + str(
                bw_data[batch_id]["tmx_count"]), translate_wf_input)
            sentences_count += len(batch)
        return batches_count, sentences_count, tmx_count

    # Mehod to process page by page translation using API calls
    def page_processor_via_api(self, page, record_id, file, tmx_present, nonmt_user, tmx_file_cache,
                               translate_wf_input):
        batches, pw_dict, bw_data = self.fetch_batches_of_sentences(file, record_id, page, tmx_present, tmx_file_cache,
                                                                    True, translate_wf_input)
        batches_count, sentences_count, tmx_count = 0, 0, 0
        if not batches:
            log_error("No batches obtained for page: " + str(page["page_no"]), translate_wf_input, None)
            return batches_count, sentences_count, tmx_count
        batches_count, tmx_count = len(batches), pw_dict["tmx_count"]
        for batch_id in batches.keys():
            tmx_phrase_dict = {}
            batch = batches[batch_id]
            for sentence in batch:
                tmx_phrase_dict[sentence["s_id"]] = sentence["tmx_phrases"]
            try:
                nmt_in = {"src_list": batch, "source_language_code": file["model"]["source_language_code"],
                          "target_language_code": file["model"]["target_language_code"]}
                if nonmt_user:
                    nmt_in = {"data": batch}
                    processed = self.process_api_translations(nmt_in, None, nonmt_user, translate_wf_input)
                    if not processed:
                        return None
                else:
                    api_host = os.environ.get(file["model"]["connection_details"]["translation"]["host"], "NA")
                    api_ep = os.environ.get(file["model"]["connection_details"]["translation"]["api_endpoint"], "NA")
                    if api_host == "NA" or api_ep == "NA":
                        log_error("No API URL found!", translate_wf_input, None)
                        post_error_wf("API_ERROR", "No API URL found!", translate_wf_input, None)
                        break
                    url = str(api_host) + str(api_ep)
                    log_info("NMT_INPUT : "+nmt_in,translate_wf_input)
                    response = utils.call_api(url, "POST", nmt_in, None, "userID")
                    if response["data"]:
                        log_info("B_ID: " + batch_id + " | SENTENCES: " + str(len(batch)) +
                                 " | COMPUTED: " + str(bw_data[batch_id]["computed"]) + " | TMX: " + str(
                            bw_data[batch_id]["tmx_count"]), translate_wf_input)
                        processed = self.process_api_translations(response, tmx_phrase_dict, nonmt_user,
                                                                  translate_wf_input)
                        if not processed:
                            return None
                    else:
                        log_error("Empty response from API -- {}".format(url), translate_wf_input, None)
                        post_error_wf("API_ERROR", "Empty response from API -- {}".format(url), translate_wf_input,
                                      None)
                        break
            except Exception as e:
                log_exception("Exception while while translating via API -- {}".format(e), translate_wf_input, e)
                post_error_wf("TRANSLATION_ERROR", "Exception while while translating via API -- {}".format(e),
                              translate_wf_input, e)
                break
            sentences_count += len(batch)
        return batches_count, sentences_count, tmx_count

    # Method to fetch topic from the connection details of the input object
    def get_nmt_in_topic(self, translate_wf_input, file):
        try:
            model = file["model"]
            kafka_details = model["connection_details"]["kafka"]
            topic = os.environ.get(kafka_details["input_topic"], anu_nmt_input_topic)
            return topic
        except Exception as e:
            log_exception("Exception while fetching topic from conn details: {}".format(str(e)), translate_wf_input, e)
        log_info("Falling back to default Anuvaad NMT topic......", translate_wf_input)
        return anu_nmt_input_topic

    # Method to fetch batches for sentences from the file for a page.
    def fetch_batches_of_sentences(self, file, record_id, page, tmx_present, tmx_file_cache, third_party,
                                   translate_wf_input):
        try:
            sentences_for_trans, pw_dict, bw_data = {}, {}, {}
            page_no = page["page_no"]
            text_blocks = page["text_blocks"]
            if text_blocks:
                sentences_for_trans, pw_dict, bw_data = self.fetch_batches_of_blocks(record_id, page_no, text_blocks,
                                                                                     file,
                                                                                     tmx_present, tmx_file_cache,
                                                                                     third_party, translate_wf_input)
            else:
                log_error("There are no text blocks for this page: " + str(page_no), translate_wf_input, None)
            return sentences_for_trans, pw_dict, bw_data
        except Exception as e:
            log_exception("Exception while fetching batch of sentences: " + str(e), translate_wf_input, e)
            return None

    # Iterates through the blocks and creates batches of sentences for translation
    def fetch_batches_of_blocks(self, record_id, page_no, text_blocks, file, tmx_present, tmx_file_cache, third_party,
                                translate_wf_input):
        batch_id, tmx_count, computed = str(uuid.uuid4()), 0, 0
        sentences_for_trans, batch_wise_tmx, bw_tmx_count, bw_computed_count = {}, {}, 0, 0
        for block in text_blocks:
            block_id = block["block_id"]
            if 'tokenized_sentences' in block.keys():
                for sentence in block["tokenized_sentences"]:
                    tmx_phrases = []
                    if tmx_present:
                        tmx_phrases, res_dict = self.fetch_tmx(sentence["src"], file, tmx_present, tmx_file_cache,
                                                               translate_wf_input)
                        bw_tmx_count += len(tmx_phrases)
                        bw_computed_count += res_dict["computed"]
                    node_id = str(record_id) + "|" + str(page_no) + "|" + str(block_id)
                    if not third_party:
                        sent_nmt_in = {"src": sentence["src"], "s_id": sentence["s_id"], "n_id": node_id,
                                       "batch_id": batch_id, "tmx_phrases": tmx_phrases}
                    else:
                        s_id = node_id + "xxx" + batch_id + "xxx" + sentence["s_id"]
                        sent_nmt_in = {"src": sentence["src"], "s_id": s_id, "tmx_phrases": tmx_phrases}
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
            #log_info(f"Test68 tmx_entries {tmx_entries}", None)
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

    # Consumer record handler
    def process_nmt_output(self, nmt_output):
        nmt_output = nmt_output["out"]
        self.process_translation(nmt_output)
        return

    # Method to process the output received from the NMT
    def process_translation(self, nmt_output):
        try:
            record_id = nmt_output["record_id"]
            recordid_split = str(record_id).split("|")
            job_id, file_id, batch_size = recordid_split[0], recordid_split[1], eval(recordid_split[2])
            record_id = str(job_id) + "|" + str(file_id)
            translate_wf_input = {"jobID": job_id, "metadata": {"module": tool_translator}}
            file = self.get_content_from_db(record_id, None, None, translate_wf_input)
            if not file:
                log_error("There is no data for this recordID: " + str(record_id), translate_wf_input,
                          nmt_output["status"])
                post_error_wf("TRANSLATION_FAILED",
                              "There is no data for this recordID: " + str(record_id), translate_wf_input, None)
                return
            file, skip_count, trans_count, batch_id = file[0], 0, 0, None
            translate_wf_input = file["transInput"]
            translate_wf_input["recordID"] = record_id
            if 'status' in nmt_output.keys():
                if nmt_output["status"]["statusCode"] != 200:
                    skip_count += batch_size
                    log_error("Error from NMT: " + str(nmt_output["status"]["message"]), translate_wf_input,
                              nmt_output["status"])
            if 'data' in nmt_output.keys():
                if not nmt_output["data"]:
                    log_error("NMT returned empty data!", translate_wf_input, None)
                    skip_count += batch_size
                sentences_of_the_batch = []
                for response in nmt_output["data"]:
                    if "n_id" not in response.keys():
                        log_error("Node ID missing! s_id: {}, b_id: {}".format(response["s_id"], batch_id),
                                  translate_wf_input, None)
                        skip_count += 1
                        continue
                    batch_id = response["batch_id"]
                    if 'tgt' not in response.keys():
                        log_info("TGT missing! s_id: {}, b_id: {}".format(response["s_id"], batch_id),
                                 translate_wf_input)
                    sentences_of_the_batch.append(response)
                if len(sentences_of_the_batch) == 0:
                    skip_count += batch_size
                    log_error("NMT returned empty response_body!", translate_wf_input, None)
                else:
                    try:
                        #log_info(f"Test68 Sentences of the batch {sentences_of_the_batch}",None)
                        self.update_sentences(record_id, sentences_of_the_batch, translate_wf_input)
                        trans_count += len(sentences_of_the_batch)
                    except Exception as e:
                        log_exception("Exception while saving translations to DB: " + str(e), translate_wf_input, e)
                        skip_count += len(sentences_of_the_batch)
            self.update_translation_status(batch_id, trans_count, skip_count, translate_wf_input)
            return
        except Exception as e:
            log_exception("Exception while processing NMT output: " + str(e), None, e)
            return

    # Processes the translations received via the API call
    def process_api_translations(self, api_response, tmx_phrase_dict, no_nmt, translate_wf_input):
        api_res_translations, record_id, batch_id, skip_count, trans_count = [], None, None, 0, 0
        try:
            for translation in api_response["data"]:
                if type(translation) == "str":
                    translation_formatted = json.loads(translation)
                else:
                    translation_formatted = translation
                if "s_id" not in translation_formatted.keys():
                    log_error("S_ID missing for SRC: {}".format(translation_formatted["src"]), translate_wf_input, None)
                    continue
                translation_obj = {"src": translation_formatted["src"],
                                   "n_id": translation_formatted["s_id"].split("xxx")[0],
                                   "batch_id": translation_formatted["s_id"].split("xxx")[1],
                                   "s_id": translation_formatted["s_id"].split("xxx")[2]}
                if not no_nmt:
                    if 'tgt' not in translation_formatted.keys():
                        log_error("TGT missing for SRC: {}".format(translation_formatted["src"]), translate_wf_input, None)
                    else:
                        translation_obj["tgt"] = translation_formatted["tgt"]
                if 'tmx_phrases' not in translation_formatted.keys():
                    translation_obj["tmx_phrases"] = []
                    if tmx_phrase_dict:
                        tmx = tmx_phrase_dict[translation_formatted["s_id"]]
                        translation_obj["tmx_phrases"] = tmx if tmx else []
                else:
                    translation_obj["tmx_phrases"] = translation_formatted["tmx_phrases"]
                record_id = translation_obj["n_id"].split("|")[0] + "|" + translation_obj["n_id"].split("|")[1]
                batch_id = translation_obj["batch_id"]
                api_res_translations.append(translation_obj)
            file = self.get_content_from_db(record_id, None, None, translate_wf_input)
            if not file:
                log_error("There is no data for this recordID: " + str(record_id), translate_wf_input, None)
                post_error_wf("TRANSLATION_FAILED",
                              "There is no data for this recordID: " + str(record_id), translate_wf_input, None)
                return False
            try:
                if no_nmt:
                    self.process_no_nmt_jobs({"recordID": record_id, "message": api_res_translations})
                    trans_count += len(api_res_translations)
                else:
                    self.update_sentences(record_id, api_res_translations, translate_wf_input)
                    trans_count += len(api_res_translations)
            except Exception as e:
                log_exception("Exception while saving translations to DB: " + str(e), translate_wf_input, e)
                skip_count += len(api_res_translations)
            self.update_translation_status(batch_id, trans_count, skip_count, translate_wf_input)
            return True
        except Exception as e:
            log_exception("Exception while processing the API output -- {}".format(e), translate_wf_input, e)
            log_exception("API Response -- {}".format(api_response), translate_wf_input, e)
            post_error_wf("TRANSLATION_ERROR", "Exception while processing the API output -- {}".format(e),
                          translate_wf_input, e)
            return False

    # Method to search data from db
    def get_content_from_db(self, record_id, job_id, page_no, translate_wf_input):
        try:
            query = {"recordID": record_id}
            if job_id:
                query["jobID"] = job_id
            if page_no:
                query['data.page_no'] = page_no
            exclude = {'_id': False}
            result = repo.search(query, exclude)
            return result
        except Exception as e:
            log_exception("Exception while searching from db: " + str(e), translate_wf_input, e)
            return None

    # Updates the no of sentences translated after every iteration.
    def update_translation_status(self, batch_id, trans_count, skip_count, translate_wf_input):
        batch_data = {"id": str(uuid.uuid4()), "jobID": translate_wf_input["jobID"], "batch_id": batch_id}
        repo.write_batches(batch_data)
        log_info("Status -- B_ID: " + str(batch_id) + " (T: " + str(trans_count) + ", S: " + str(skip_count) + ")",
                 translate_wf_input)

    # method to update sentences from DB after translation
    def update_sentences(self, record_id, nmt_res_batch, translate_wf_input):
        page_no = str(nmt_res_batch[0]["n_id"]).split("|")[2]
        page = repo.fetch_pages({"record_id": record_id, "page_no": eval(page_no)})[0]
        page_enriched = page
        utm_enabled = utils.get_rbac_tmx_utm(translate_wf_input["metadata"]["roles"], translate_wf_input, False)[1]
        for nmt_res_sentence in nmt_res_batch:
            if 'tgt' not in nmt_res_sentence.keys():
                nmt_res_sentence["tgt"] = None
            node = str(nmt_res_sentence["n_id"]).split("|")
            if user_translation_enabled and utm_enabled:
                user_id = translate_wf_input["metadata"]["userID"]
                file = translate_wf_input["input"]["files"][0]
                locale = file["model"]["source_language_code"] + "|" + file["model"]["target_language_code"]
                api_input = {"keys": [{"userID": user_id, "src": nmt_res_sentence["src"], "locale": locale}]}
                response = utils.call_api(fetch_user_translation_url, "POST", api_input, None, user_id)
                #log_info(f"Test68 Response of NMT {response}",None)
                if response:
                    if 'data' in response.keys():
                        if response["data"]:
                            if response["data"][0]["value"]:
                                tgt = json.loads(response["data"][0]["value"][0])
                                for translation in response["data"][0]["value"]:
                                    translation_obj = json.loads(translation)
                                    #log_info(f"Test68 translation_obj {translation_obj}, tgt {tgt}", None)
                                    if translation_obj["timestamp"] > tgt["timestamp"]:
                                        tgt = translation_obj
                                log_info("User Translation | TGT: " + str(nmt_res_sentence["tgt"]) +
                                         " | NEW TGT: " + tgt["tgt"], translate_wf_input)
                                nmt_res_sentence["tgt"] = tgt["tgt"]
                                nmt_res_sentence["tmx_phrases"] = []
            if nmt_res_sentence["tmx_phrases"]:
                log_info("PAGE NO: {} | BATCH ID: {} "
                         "| SRC: {} | TGT: {} | TMX Count: {}".format(page_no, nmt_res_sentence["batch_id"],
                          nmt_res_sentence["src"], nmt_res_sentence["tgt"], str(len(nmt_res_sentence["tmx_phrases"]))),
                         translate_wf_input)
                nmt_res_sentence["tgt"], nmt_res_sentence["tmx_replacement"] = tmxservice.replace_nmt_tgt_with_user_tgt(
                    nmt_res_sentence["tmx_phrases"], nmt_res_sentence["src"], nmt_res_sentence["tgt"], translate_wf_input)
                log_info(nmt_res_sentence["tmx_replacement"], translate_wf_input)
            block_id, b_index, s_index, sentence_id = node[3], None, None, nmt_res_sentence["s_id"]
            for b_in, block in enumerate(page["text_blocks"]):
                if block["block_id"] == block_id:
                    for s_in, sentence in enumerate(block["tokenized_sentences"]):
                        if str(sentence["s_id"]) == str(sentence_id):
                            s_index = s_in
                            b_index = b_in
                            break
            if s_index is not None:
                page_enriched["text_blocks"][b_index]["tokenized_sentences"][s_index] = nmt_res_sentence
            else:
                log_info(f'Replace failed for n_id: {str(nmt_res_sentence["n_id"])}, block_id received: {block_id}, '
                         f'sentence_id received: {sentence_id}, b_index: {b_index}, s_index: {s_index}, '
                         f'nmt_res_sentence: {nmt_res_sentence}', translate_wf_input)
        query = {"record_id": record_id, "page_no": eval(page_no)}
        repo.update_pages(query, page_enriched)

    # Saves sentences sent internally through Translator for NONMT jobs
    def process_no_nmt_jobs(self, no_nmt_input):
        record_id = no_nmt_input["record_id"]
        recordid_split = str(record_id).split("|")
        job_id, file_id, batch_size = recordid_split[0], recordid_split[1], eval(recordid_split[2])
        record_id = str(job_id) + "|" + str(file_id)
        translate_wf_input = {"jobID": job_id, "metadata": {"module": tool_translator}}
        try:
            file = self.get_content_from_db(record_id, None, None, translate_wf_input)[0]
            translate_wf_input = file["transInput"]
            translate_wf_input["recordID"] = record_id
            skip_count, trans_count, batch_id = 0, 0, None
            if 'message' in no_nmt_input.keys():
                for response in no_nmt_input["message"]:
                    batch_id = response["batch_id"]
                    page_no = str(response["n_id"]).split("|")[2]
                    page = repo.fetch_pages({"record_id": record_id, "page_no": eval(page_no)})[0]
                    page_enriched = page
                    node = str(response["n_id"]).split("|")
                    block_id = node[3]
                    b_index, s_index = None, None
                    sentence_id = response["s_id"]
                    for j, block in enumerate(page["text_blocks"]):
                        if str(block["block_id"]) == str(block_id):
                            b_index = j
                            break
                    block = page["text_blocks"][b_index]
                    for k, sentence in enumerate(block["tokenized_sentences"]):
                        if str(sentence["s_id"]) == str(sentence_id):
                            s_index = k
                            break
                    if b_index is not None and s_index is not None:
                        page_enriched["text_blocks"][b_index]["tokenized_sentences"][s_index] = response
                    else:
                        log_info("No b_index and s_index for n_id: {}".format(response["n_id"]), translate_wf_input)
                    query = {"record_id": record_id, "page_no": eval(page_no)}
                    repo.update_pages(query, page_enriched)
                    trans_count += 1
            else:
                skip_count += batch_size
            self.update_translation_status(batch_id, trans_count, skip_count, translate_wf_input)
            return
        except Exception as e:
            log_exception("Exception while processing batch of nonmt job: " + str(e), translate_wf_input, e)
            return
