import hashlib
import json
import time

import xlrd
from anuvaad_auditor.loghandler import log_exception, log_info
import requests
from .tmxrepo import TMXRepository
from configs.translatorconfig import nmt_labse_align_url
from configs.translatorconfig import download_folder

repo = TMXRepository()

class TMXService:

    def __init__(self):
        pass

    # Read a CSV and creates TMX entries.
    def push_csv_to_tmx_store(self, api_input):
        log_info("Bulk Create....", None)
        try:
            if 'context' not in api_input.keys() or 'filePath' not in api_input.keys():
                return {"message": "context and filePath are mandatory", "status": "FAILED"}
            extension = str(api_input["filePath"]).split(".")[1]
            if extension not in ["xls", "xlsx"]:
                return {"message": "Invalid file, TMX only supports - xls & xlsx", "status": "FAILED"}
            file_path = download_folder + api_input["filePath"]
            wb = xlrd.open_workbook(file_path)
            sheet = wb.sheet_by_index(0)
            number_of_rows = sheet.nrows
            number_of_columns = sheet.ncols
            tmx_input = []
            for row in range(2, number_of_rows):
                if row == 1:
                    continue
                values = []
                for col in range(number_of_columns):
                    values.append(sheet.cell(row, col).value)
                if row == 0:
                    if values[0] != "Source".strip() or values[1] != "Target".strip() or values[2] != "Locale".strip():
                        return {"message": "Source | Target | Locale - either of these columns is Missing", "status": "FAILED"}
                else:
                    values_dict = {"src": str(values[0]).strip(), "tgt": str(values[1]).strip(), "locale": str(values[2]).strip()}
                    tmx_input.append(values_dict)
            tmx_record = {"context": api_input["context"], "sentences": tmx_input}
            if 'userID' in api_input.keys():
                tmx_record["userID"] = api_input["userID"]
            if 'orgID' in api_input.keys():
                tmx_record["orgID"] = api_input["orgID"]
            res = self.push_to_tmx_store(tmx_record)
            if res["status"] == "FAILED":
                return {"message": "bulk creation failed", "status": "FAILED"}
            db_record = tmx_record
            db_record["sentences"], db_record["file"], db_record["timeStamp"] = len(tmx_input), file_path, eval(str(time.time()).replace('.', '')[0:13])
            repo.mongo_create(db_record)
            log_info("Bulk Create DONE!", None)
            return {"message": "bulk creation successful", "status": "SUCCESS"}
        except Exception as e:
            log_exception("Exception while pushing to TMX: " + str(e), None, e)
            return {"message": "bulk creation failed", "status": "FAILED"}

    # Pushes translations to the tmx.
    def push_to_tmx_store(self, tmx_input):
        log_info("Pushing to TMX......", None)
        try:
            for sentence in tmx_input["sentences"]:
                tmx_records = []
                sentence_types = self.fetch_diff_flavors_of_sentence(sentence["src"])
                for sent in sentence_types:
                    tmx_record_pair = {"src": sent, "locale": sentence["locale"], "nmt_tgt": [],
                                       "user_tgt": sentence["tgt"], "context": tmx_input["context"]}
                    if 'userID' in tmx_input.keys():
                        tmx_record_pair["userID"] = tmx_input["userID"]
                    if 'orgID' in tmx_input.keys():
                        tmx_record_pair["orgID"] = tmx_input["orgID"]
                    tmx_records.append(tmx_record_pair)
                reverse_locale_array = str(sentence["locale"]).split("|")
                reverse_locale = str(reverse_locale_array[1]) + "|" + str(reverse_locale_array[0])
                tmx_record_reverse_pair = {"src": sentence["tgt"], "locale": reverse_locale, "nmt_tgt": [],
                                   "user_tgt": sentence["src"], "context": tmx_input["context"]}
                if 'userID' in tmx_input.keys():
                    tmx_record_reverse_pair["userID"] = tmx_input["userID"]
                if 'orgID' in tmx_input.keys():
                    tmx_record_reverse_pair["orgID"] = tmx_input["orgID"]
                tmx_records.append(tmx_record_reverse_pair)
                for tmx_record in tmx_records:
                    hash_dict = self.get_hash_key(tmx_record, False)
                    for hash_key in hash_dict.keys():
                        tmx_record["hash"] = hash_dict[hash_key]
                        repo.upsert(tmx_record["hash"], tmx_record)
            log_info("Translations pushed to TMX!", None)
            return {"message": "created", "status": "SUCCESS"}
        except Exception as e:
            log_exception("Exception while pushing to TMX: " + str(e), None, e)
            return {"message": "creation failed", "status": "FAILED"}

    # Method to fetch tmx phrases for a given src
    def get_tmx_phrases(self, user_id, org_id, context, locale, sentence, ctx):
        tmx_record = {"context": context, "locale": locale, "src": sentence}
        if user_id:
            tmx_record["userID"] = user_id
        if org_id:
            tmx_record["orgID"] = org_id
        try:
            return self.tmx_phrase_search(tmx_record, ctx)
        except Exception as e:
            log_exception("Exception while searching tmx from redis: " + str(e), ctx, e)
            return []

    # Generates a 3 flavors for a sentence - title case, lowercase and uppercase.
    def fetch_diff_flavors_of_sentence(self, sentence):
        sentence = str(sentence)
        title = sentence.title()
        small = sentence.lower()
        caps = sentence.upper()
        return sentence, title, small, caps

    # Searches for all tmx phrases within a given sentence
    # Uses a custom implementation of the sliding window search algorithm.
    def tmx_phrase_search(self, tmx_record, ctx):
        sentence, tmx_phrases = tmx_record["src"], []
        start_pivot, sliding_pivot, i = 0, len(sentence), 1
        computed, tmx = 0, 0
        while start_pivot < len(sentence):
            phrase = sentence[start_pivot:sliding_pivot]
            tmx_record["src"] = phrase
            tmx_result = self.get_tmx_with_fallback(tmx_record)
            if tmx_result:
                tmx_phrases.append(tmx_result[0])
                phrase_list = phrase.split(" ")
                start_pivot += (1 + len(' '.join(phrase_list)))
                sliding_pivot = len(sentence)
                i = 1
                tmx += 1
            else:
                sent_list = sentence.split(" ")
                phrase_list = phrase.split(" ")
                reduced_phrase = ' '.join(sent_list[0: len(sent_list) - i])
                sliding_pivot = len(reduced_phrase)
                i += 1
                if start_pivot == sliding_pivot or (start_pivot - 1) == sliding_pivot:
                    start_pivot += (1 + len(' '.join(phrase_list)))
                    sliding_pivot = len(sentence)
                    i = 1
            computed += 1
        log_info("TMX-FETCH computed: " + str(computed) + " | tmx: " + str(tmx), ctx)
        return tmx_phrases

    # Fetches TMX phrases for a sentence from hierarchical cache
    def get_tmx_with_fallback(self, tmx_record):
        hash_dict = self.get_hash_key(tmx_record, True)
        if 'USER' in hash_dict.keys():
            tmx_result = repo.search([hash_dict["USER"]])
            if tmx_result:
                return tmx_result
        if 'ORG' in hash_dict.keys():
            tmx_result = repo.search([hash_dict["ORG"]])
            if tmx_result:
                return tmx_result
        if 'GLOBAL' in hash_dict.keys():
            tmx_result = repo.search([hash_dict["GLOBAL"]])
            if tmx_result:
                return tmx_result
        return None

    # Replaces TMX phrases in NMT tgt using TMX NMT phrases and LaBSE alignments
    def replace_nmt_tgt_with_user_tgt(self, tmx_phrases, tgt, ctx):
        tmx_without_nmt_phrases, tmx_tgt = [], None
        try:
            for tmx_phrase in tmx_phrases:
                if tmx_phrase["nmt_tgt"]:
                    for nmt_tgt_phrase in tmx_phrase["nmt_tgt"]:
                        if nmt_tgt_phrase in tgt:
                            log_info("(TMX - NMT) Replacing: " + str(nmt_tgt_phrase) + " with: " + str(tmx_phrase["user_tgt"]), ctx)
                            tgt = tgt.replace(nmt_tgt_phrase, tmx_phrase["user_tgt"])
                            break
                else:
                    tmx_without_nmt_phrases.append(tmx_phrase)
            tmx_tgt = tgt
            if tmx_without_nmt_phrases:
                tmx_tgt = self.replace_with_labse_alignments(tmx_without_nmt_phrases, tgt, ctx)
            if tmx_tgt:
                return tmx_tgt
            else:
                return tgt
        except Exception as e:
            log_exception("Exception while replacing nmt_tgt with user_tgt: " + str(e), ctx, e)
            return tgt

    # Replaces phrases in tgt with user tgts using labse alignments and updates nmt_tgt in TMX
    def replace_with_labse_alignments(self, tmx_phrases, tgt, ctx):
        tmx_phrase_dict = {}
        for tmx_phrase in tmx_phrases:
            tmx_phrase_dict[tmx_phrase["src"]] = tmx_phrase
        nmt_req = {"src_phrases": list(tmx_phrase_dict.keys()), "tgt": tgt}
        nmt_req = [nmt_req]
        api_headers = {'Content-Type': 'application/json'}
        nmt_response = requests.post(url=nmt_labse_align_url, json=nmt_req, headers=api_headers)
        if nmt_response:
            if nmt_response.text:
                nmt_response = json.loads(nmt_response.text)
            if 'status' in nmt_response.keys():
                if nmt_response["status"]["statusCode"] != 200:
                    return None
                else:
                    nmt_aligned_phrases = nmt_response["response_body"][0]["aligned_phrases"]
                    if nmt_aligned_phrases:
                        for aligned_phrase in nmt_aligned_phrases.keys():
                            phrase = tmx_phrase_dict[aligned_phrase]
                            log_info("(TMX - LaBSE) Replacing: " + str(nmt_aligned_phrases[aligned_phrase]) + " with: " + str(phrase["user_tgt"]), ctx)
                            tgt = tgt.replace(nmt_aligned_phrases[aligned_phrase], phrase["user_tgt"])
                            modified_nmt_tgt = phrase["nmt_tgt"]
                            modified_nmt_tgt.append(nmt_aligned_phrases[aligned_phrase])
                            phrase["nmt_tgt"] = modified_nmt_tgt
                            repo.upsert(phrase["hash"], phrase)
                    else:
                        log_info("No LaBSE alignments found!", ctx)
                        log_info("LaBSE - " + str(nmt_req), ctx)
                    return tgt
            else:
                return None
        else:
            return None

    # Method to fetch all keys from the redis db
    def get_tmx_data(self, req):
        redis_records = repo.get_all_records(req["keys"])
        return redis_records

    # Creates a md5 hash values using userID, orgID, context, locale and src for inserting and searching records.
    def get_hash_key(self, tmx_record, is_search):
        hash_dict = {}
        if is_search:
            global_hash = tmx_record["context"] + "__" + tmx_record["locale"] + "__" + tmx_record["src"]
            hash_dict["GLOBAL"] = hashlib.sha256(global_hash.encode('utf-16')).hexdigest()
        else:
            if 'orgID' not in tmx_record.keys() and 'userID' not in tmx_record.keys():
                global_hash = tmx_record["context"] + "__" + tmx_record["locale"] + "__" + tmx_record["src"]
                hash_dict["GLOBAL"] = hashlib.sha256(global_hash.encode('utf-16')).hexdigest()
        if 'orgID' in tmx_record.keys():
            org_hash = tmx_record["orgID"] + "__" + tmx_record["context"] + "__" + tmx_record["locale"] + "__" + tmx_record["src"]
            hash_dict["ORG"] = hashlib.sha256(org_hash.encode('utf-16')).hexdigest()
        if 'userID' in tmx_record.keys():
            user_hash = tmx_record["userID"] + "__" + tmx_record["context"] + "__" + tmx_record["locale"] + "__" + tmx_record["src"]
            hash_dict["USER"] = hashlib.sha256(user_hash.encode('utf-16')).hexdigest()
        return hash_dict
