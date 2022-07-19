#!/bin/python

from anuvaad_auditor.errorhandler import post_error
from configs.translatorconfig import suggestion_statuses
from tmx.tmxservice import TMXService

tmx_service = TMXService()


class TranslatorValidator:
    def __init__(self):
        pass

    def validate_block_translate(self, data):
        if 'jobID' not in data.keys():
            return post_error("JOBID_NOT_FOUND", "jobID is mandatory", None)
        else:
            if 'metadata' not in data.keys():
                return post_error("METADATA_NOT_FOUND", "Metadata is mandatory", None)
            else:
                metadata = data["metadata"]
                if 'userID' not in metadata.keys():
                    return post_error("USER_ID_NOT_FOUND", "Bearer token is mandatory", None)
            if 'input' not in data.keys():
                return post_error("INPUT_NOT_FOUND", "Input key is mandatory", None)
            else:
                api_input = data["input"]
                if 'textBlocks' not in api_input.keys():
                    return post_error("TEXT_BLOCKS_NOT_FOUND", "Text blocks is mandatory", None)
                else:
                    if not api_input["textBlocks"]:
                        return post_error("TEXT_BLOCKS_EMPTY", "Text blocks cannot be empty", None)
                    if 'recordID' not in api_input.keys():
                        return post_error("RECORD_ID_NOT_FOUND", "Record id is mandatory", None)
                    if 'locale' not in api_input.keys():
                        return post_error("LOCALE_NOT_FOUND", "Locale is mandatory", None)
                    if 'model' not in api_input.keys():
                        return post_error("MODEL_NOT_FOUND", "Model details are mandatory for this wf.", None)
                    else:
                        model = api_input["model"]
                        if 'model_id' not in model.keys():
                            return post_error("MODEL_ID_NOT_FOUND", "Model Id is mandatory.", None)
                        if 'source_language_code' not in model.keys():
                            return post_error("SRC_LANG_NOT_FOUND", "Source language code is mandatory.", None)
                        if 'target_language_code' not in model.keys():
                            return post_error("TGT_LANG_NOT_FOUND", "Target language code is mandatory.", None)

    def validate_text_translate(self, data):
        if 'input' not in data.keys():
            return post_error("INPUT_NOT_FOUND", "Input key is mandatory", None)
        else:
            api_input = data["input"]
            if 'textList' not in api_input.keys():
                return post_error("TEXT_LIST_NOT_FOUND", "Text List is mandatory", None)
            else:
                if not api_input["textList"]:
                    return post_error("TEXT_LIST_EMPTY", "Text list cannot be empty", None)
                else:
                    for text in api_input["textList"]:
                        if 's_id' not in text.keys():
                            return post_error("SENTENCE_ID_NOT_FOUND", "s_id is mandatory", None)
                        if 'src' not in text.keys():
                            return post_error("TEXT_NOT_FOUND", "src is mandatory", None)
                        if 'taggedPrefix' not in text.keys():
                            return post_error("TAGGED_PREFIX_NOT_FOUND", "taggedPrefix is mandatory", None)
            if 'model' not in api_input.keys():
                return post_error("MODEL_NOT_FOUND", "Model details are mandatory for this wf.", None)
            else:
                model = api_input["model"]
                if 'model_id' not in model.keys():
                    return post_error("MODEL_ID_NOT_FOUND", "Model Id is mandatory.", None)
                if 'source_language_code' not in model.keys():
                    return post_error("SRC_LANG_NOT_FOUND", "Source language code is mandatory.", None)
                if 'target_language_code' not in model.keys():
                    return post_error("TGT_LANG_NOT_FOUND", "Target language code is mandatory.", None)

    def validate_sentences_translate(self, data):
        if 'input' not in data.keys():
            return post_error("INPUT_NOT_FOUND", "Input key is mandatory", None)
        else:
            api_input = data["input"]
            if 'sentences' not in api_input.keys():
                return post_error("SENTENCES_NOT_FOUND", "Sentences is mandatory", None)
            else:
                if not api_input["sentences"]:
                    return post_error("TEXT_LIST_EMPTY", "Text list cannot be empty", None)
                else:
                    for text in api_input["sentences"]:
                        if 's_id' not in text.keys():
                            return post_error("SENTENCE_ID_NOT_FOUND", "s_id is mandatory", None)
                        if 'src' not in text.keys():
                            return post_error("TEXT_NOT_FOUND", "src is mandatory", None)
            if 'model_id' not in api_input.keys():
                return post_error("MODEL_NOT_FOUND", "Model ID is mandatory for this wf.", None)

    # Validator that validates the input request for initiating translation through wf
    def validate_wf(self, data, is_api):
        if 'jobID' not in data.keys():
            return post_error("JOBID_NOT_FOUND", "jobID is mandatory", None)
        else:
            error = self.validate_input_files(data, is_api)
            if error is not None:
                return error

    # Validator that validates the input request for translation
    def validate_input_files(self, data, is_api):
        if not is_api:
            if 'metadata' not in data.keys():
                return post_error("METADATA_NOT_FOUND", "Metadata is mandatory", None)
            else:
                metadata = data["metadata"]
                if 'userID' not in metadata.keys():
                    return post_error("USER_ID_NOT_FOUND", "Bearer token is mandatory", None)
        if 'input' not in data.keys():
            return post_error("INPUT_NOT_FOUND", "Input key is mandatory", None)
        else:
            data = data["input"]
            if 'files' not in data.keys():
                return post_error("FILES_NOT_FOUND", "files are mandatory", None)
            else:
                if len(data["files"]) == 0:
                    return post_error("FILES_NOT_FOUND", "Input files are mandatory", None)
                else:
                    for file in data["files"]:
                        if 'path' not in file.keys():
                            return post_error("FILES_PATH_NOT_FOUND", "Path is mandatory for all files in the input",
                                              None)
                        if 'type' not in file.keys():
                            return post_error("FILES_TYPE_NOT_FOUND", "Type is mandatory for all files in the input",
                                              None)
                        if 'locale' not in file.keys():
                            return post_error("FILES_LOCALE_NOT_FOUND",
                                              "Locale is mandatory for all files in the input",
                                              None)
                        if 'model' not in file.keys():
                            return post_error("MODEL_NOT_FOUND", "Model details are mandatory for this wf.", None)
                        else:
                            model = file["model"]
                            if 'model_id' not in model.keys():
                                return post_error("MODEL_ID_NOT_FOUND", "Model Id is mandatory.", None)
                            if 'source_language_code' not in model.keys():
                                return post_error("SRC_LANG_NOT_FOUND", "Source language code is mandatory.", None)
                            if 'target_language_code' not in model.keys():
                                return post_error("TGT_LANG_NOT_FOUND", "Target language code is mandatory.", None)

    def validate_tmx_search(self, input_req):
        user_roles = str(input_req["metadata"]["roles"]).split(",")
        if 'SUPERADMIN' in user_roles:
            if 'orgID' not in input_req.keys() and 'userID' not in input_req.keys() and 'keys' not in input_req.keys():
                return post_error("MAND_IP_MISSING", "User ID or Org ID or Keys is mandatory for this search", None)
        else:
            if 'getAll' in input_req.keys():
                input_req["getAll"] = None
            if 'ADMIN' in user_roles:
                if 'orgID' in input_req.keys():
                    if input_req["orgID"] != input_req["metadata"]["orgID"]:
                        return post_error("ORG_MISMATCH", "This user can only search Glossary from his/her Org.", None)
                else:
                    return post_error("ORG_MISSING", "Org ID is mandatory for this search", None)
            if 'TRANSLATOR' in user_roles:
                if 'orgID' in input_req.keys():
                    if input_req["orgID"] != input_req["metadata"]["orgID"]:
                        return post_error("ORG_MISMATCH", "This user can only search Glossary from his/her Org.", None)
                else:
                    return post_error("ORG_MISSING", "Org ID is mandatory for this search", None)
                if 'userID' in input_req.keys():
                    if input_req["userID"] != input_req["metadata"]["userID"]:
                        return post_error("USER_MISMATCH", "This user can only search Glossary from his/her account.", None)
                else:
                    return post_error("USER_MISSING", "User ID is mandatory for this search", None)
        return None

    def validate_tmx_delete(self, input_req):
        user_roles = str(input_req["metadata"]["roles"]).split(",")
        if "ADMIN" not in user_roles and "SUPERADMIN" not in user_roles:
            if 'orgID' in input_req.keys():
                return {"message": "Only an ADMIN or SUPERADMIN can delete ORG-level TMX", "status": "FAILED"}
        if 'orgID' in input_req.keys() and 'userID' in input_req.keys():
            return {"message": "Either user TMX or org TMX can be deleted at a time", "status": "FAILED"}
        return None

    def validate_suggestion_box_create(self, input_req):
        if 'orgID' not in input_req.keys():
            return post_error("ORG_NOT_FOUND", "org is mandatory", None)
        if 'context' not in input_req.keys():
            return post_error("CONTEXT_NOT_FOUND", "context is mandatory", None)
        else:
            if 'translations' not in input_req.keys():
                return post_error("TRANSLATIONS_NOT_FOUND", "Translations are mandatory", None)
            else:
                if not input_req["translations"]:
                    return post_error("TRANSLATIONS_EMPTY", "Translations cannot be empty", None)
                else:
                    for translation in input_req["translations"]:
                        if 'src' not in translation.keys():
                            return post_error("SRC_NOT_FOUND", "src is mandatory for every translation", None)
                        if 'tgt' not in translation.keys():
                            return post_error("TGT_NOT_FOUND", "tgt is mandatory for every translation", None)
                        if 'locale' not in translation.keys():
                            return post_error("LOCALE_NOT_FOUND", "locale is mandatory for every translation", None)
                        search_req = {"src": translation["src"], "tgt": translation["tgt"], "orgIDs": input_req["orgID"]}
                        search_res = tmx_service.suggestion_box_get(search_req)
                        if search_res:
                            return post_error("DUPLICATE_RECORD", "This suggestion has already been submitted for this Org.", None)
        return None

    def validate_suggestion_box_update(self, input_req):
        if 'ids' not in input_req.keys():
            return post_error("IDS_NOT_FOUND", "ids mandatory", None)
        elif not input_req["ids"]:
            return post_error("IDS_NOT_FOUND", "ids mandatory", None)
        if 'status' not in input_req.keys():
            return post_error("STATUS_NOT_FOUND", "status is mandatory", None)
        elif input_req["status"] not in suggestion_statuses:
            return post_error("STATUS_INVALID", "status is invalid", None)
        return None





