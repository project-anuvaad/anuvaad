import logging
import time

from utilities.translatorutils import TranslatorUtils
from kafkawrapper.translatorproducer import Producer
from repository.translatorrepository import TranslatorRepository
from anuvaad_auditor.loghandler import log_exception, log_error, log_info
from anuvaad_auditor.errorhandler import post_error_wf
from configs.translatorconfig import nmt_max_batch_size
from configs.translatorconfig import anu_nmt_input_topic

log = logging.getLogger('file')
utils = TranslatorUtils()
producer = Producer()
repo = TranslatorRepository()


class TranslatorService:
    def __init__(self):
        pass

    # Service method to begin translation for document translation flow.
    def start_file_translation(self, translate_wf_input):
        translate_wf_input["taskID"] = utils.generate_task_id()
        translate_wf_input["taskStartTime"] = eval(str(time.time()).replace('.', ''))
        translate_wf_input["state"] = "TRANSLATED"
        log_info("Translator process initiated... jobID: " + str(translate_wf_input["jobID"]), translate_wf_input)
        for file in translate_wf_input["input"]["files"]:
            try:
                dumped = self.dump_file_to_db(file["path"], translate_wf_input)
                if not dumped:
                    translate_wf_input["status"] = "FAILED"
                    return post_error_wf("CONTENT_DUMP_FAILED", "Error while dumping file content to DB", translate_wf_input, None)
                pushed = self.push_sentences_to_nmt(file, translate_wf_input)
                if not pushed:
                    translate_wf_input["status"] = "FAILED"
                    return post_error_wf("BATCH_PUSH_FAILED", "Error while pushing batches to nmt", translate_wf_input, None)
            except Exception as e:
                translate_wf_input["status"] = "FAILED"
                log_exception("Exception while posting sentences to NMT: " + str(e), translate_wf_input, e)
                return post_error_wf("NMT_PUSH_FAILED", "Exception while posting sentences to NMT: " + str(e), translate_wf_input, e)

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
                batches = self.fetch_batches_of_sentences(file, record_id, page, translate_wf_input)
                if not batches:
                    log_error("No batches obtained for page: " + str(page["page_no"]), translate_wf_input, None)
                    continue
                for batch_no in batches.keys():
                    batch = batches[batch_no]
                    record_id = record_id + "|" + str(len(batch))
                    nmt_in = {
                        "url_end_point": file["model"]["url_end_point"],
                        "record_id": record_id, "message": batch
                    }
                    producer.produce(nmt_in, anu_nmt_input_topic)
                    total_sentences += len(batch)
                    log_info("PAGE NO: " + str(page["page_no"]) + " | BATCH NO: " + str(batch_no)
                             + " | BATCH SIZE: " + str(len(batch)) + " | OVERALL SENTENCES: " + str(total_sentences), translate_wf_input)
            if total_sentences > 0:
                repo.update({"totalSentences": total_sentences}, {"recordID": record_id})
                log_info("All sentences sent to NMT, recordID: " + record_id + " | count: " + str(total_sentences), translate_wf_input)
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
                                "id": file["model"]["_id"],
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
            job_id, file_id, batch_size = recordid_split[0], recordid_split[1], recordid_split[2]
            record_id = str(recordid_split[0]) + "|" + str(recordid_split[1])
            translate_wf_input = {"jobID": job_id}
            log_info("Data received from NMT..", translate_wf_input)
            file = self.get_content_from_db(record_id, None, translate_wf_input)
            if file is None:
                log_error("There is no file under translation for this job: " + str(job_id) + " and file: " + str(file_id), translate_wf_input, nmt_output["status"]["errorObj"])
                return None
            file = file[0]
            skip_count = 0
            trans_count = 0
            translate_wf_input = file["transInput"]
            if 'status' in nmt_output.keys():
                if 'statusCode' in nmt_output["status"].keys():
                    if nmt_output["status"]["statusCode"] != 200:
                        skip_count += batch_size
                        log_error("Error from NMT: " + str(nmt_output["status"]["why"]), translate_wf_input, None)
                        if 'errorObj' in nmt_output["status"].keys():
                            log_error("Error from NMT: " + str(nmt_output["status"]["why"]), translate_wf_input, nmt_output["status"]["errorObj"])
            if 'response_body' in nmt_output.keys():
                for response in nmt_output["response_body"]:
                    try:
                        node_id = response["n_id"]
                        if not node_id:
                            log_error("Node ID missing!", translate_wf_input, None)
                            skip_count += 1
                            continue
                        node = str(node_id).split("|")
                        job_id, file_id, page_no, block_id = node[0], node[1], node[2], node[3]
                        query = {
                            "recordID": record_id, "data.result.$.page_no": page_no,
                            "data.page_no.$.block_id": block_id, "data.page_no.$.block_id.$.tokenised_sentences.$.sentence_id": response["s_id"]
                        }
                        object_in = {"data.page_no.block_id.tokenised_sentences.$": response}
                        repo.update(object_in, query)
                        trans_count += 1
                    except Exception as e:
                        log_exception("Exception while saving translations: " + str(e), translate_wf_input, e)
                        skip_count += 1
                        continue
            query = {"recordID": record_id}
            object_in = {"skippedSentences": skip_count, "translatedSentences": trans_count}
            repo.update(object_in, query)
            log_info("Batch processed, translated: " + str(trans_count) + "and skipped: "+str(skip_count), translate_wf_input)
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
