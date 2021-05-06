#!/bin/python

from anuvaad_auditor.errorhandler import post_error


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