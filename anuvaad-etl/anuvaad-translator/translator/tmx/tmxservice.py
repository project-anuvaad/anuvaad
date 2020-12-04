import hashlib
import json
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
            wb = xlrd.open_workbook(download_folder + api_input["filePath"])
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
                    if values[0] != "Source":
                        return {"message": "Source is Missing", "status": "FAILED"}
                    if values[1] != "Target":
                        return {"message": "Target is Missing", "status": "FAILED"}
                    if values[2] != "Locale":
                        return {"message": "Locale is Missing", "status": "FAILED"}
                else:
                    values_dict = {"src": values[0], "tgt": values[1], "locale": values[2]}
                    tmx_input.append(values_dict)
            self.push_to_tmx_store({"userID": api_input["userID"], "context": api_input["context"], "sentences": tmx_input})
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
                tmx_record = {"userID": tmx_input["userID"], "context": tmx_input["context"], "src": sentence["src"],
                              "nmt_tgt": [], "user_tgt": sentence["tgt"], "locale": sentence["locale"]}
                tmx_record["hash"] = self.get_hash_key(tmx_record)
                repo.upsert(tmx_record["hash"], tmx_record)
            log_info("Translations pushed to TMX!", None)
            return {"message": "created", "status": "SUCCESS"}
        except Exception as e:
            log_exception("Exception while pushing to TMX: " + str(e), None, e)
            return {"message": "creation failed", "status": "FAILED"}

    # Method to fetch tmx phrases for a given src
    def get_tmx_phrases(self, user_id, context, locale, sentence, ctx):
        tmx_record = {"userID": user_id, "context": context, "locale": locale, "src": sentence}
        return self.tmx_phrase_search(tmx_record)

    # Searches for all tmx phrases within a given sentence
    # Uses a custom implementation of the sliding window search algorithm.
    def tmx_phrase_search(self, tmx_record):
        sentence, tmx_phrases = tmx_record["src"], []
        start_pivot, sliding_pivot, i = 0, len(sentence), 1
        while start_pivot < len(sentence):
            phrase = sentence[start_pivot:sliding_pivot]
            tmx_record["src"] = phrase
            hash_key = self.get_hash_key(tmx_record)
            tmx_result = repo.search([hash_key])
            if tmx_result:
                tmx_phrases.append(tmx_result[0])
                phrase_list = phrase.split(" ")
                start_pivot += (1 + len(' '.join(phrase_list)))
                sliding_pivot = len(sentence)
                i = 1
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
        return tmx_phrases

    # Replaces TMX phrases in NMT tgt using TMX NMT phrases and LaBSE alignments
    def replace_nmt_tgt_with_user_tgt(self, tmx_phrases, tgt, ctx):
        log_info("Replacing TMX phrases of NMT tgt.......", ctx)
        tmx_without_nmt_phrases, tmx_tgt = [], None
        for tmx_phrase in tmx_phrases:
            if tmx_phrase["nmt_tgt"]:
                for nmt_tgt_phrase in tmx_phrase["nmt_tgt"]:
                    if nmt_tgt_phrase in tgt:
                        tgt = str(tgt).replace(nmt_tgt_phrase, tmx_phrase["user_tgt"])
                        break
            else:
                tmx_without_nmt_phrases.append(tmx_phrase)
        tmx_tgt = tgt
        log_info("tmx_phrases: " + str(len(tmx_phrases)) + " | tmx_without_nmt_phrases: " + str(len(tmx_without_nmt_phrases)), ctx)
        if tmx_without_nmt_phrases:
            log_info("Getting LaBSE alignments for TMX phrases.....", ctx)
            tmx_tgt = self.replace_with_labse_alignments(tmx_without_nmt_phrases, tgt, ctx)
        if tmx_tgt:
            return tmx_tgt
        else:
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
                            tgt = str(tgt).replace(nmt_aligned_phrases[aligned_phrase], phrase["user_tgt"])
                            modified_nmt_tgt = phrase["nmt_tgt"]
                            modified_nmt_tgt.append(nmt_aligned_phrases[aligned_phrase])
                            phrase["nmt_tgt"] = modified_nmt_tgt
                            repo.upsert({phrase["hash"]: phrase})
                    else:
                        log_info("No LaBSE alignments available!", ctx)
                    return tgt
            else:
                return None
        else:
            return None

    # Method to fetch all keys from the redis db
    def get_tmx_data(self, req):
        redis_records = repo.get_all_records(req["keys"])
        return redis_records

    # Creates a md5 hash using userID, context and src.
    def get_hash_key(self, tmx_record):
        key = tmx_record["userID"] + "__" + tmx_record["context"] + "__" + tmx_record["locale"] + "__" + tmx_record["src"]
        return hashlib.sha256(key.encode('utf-16')).hexdigest()
