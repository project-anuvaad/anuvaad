#!/bin/python

from anuvaad_auditor.errorhandler import post_error


class TranslatorValidator:
    def __init__(self):
        pass

    def validate_text_translate(self, data):
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
                if 'textList' not in data["input"]:
                    return post_error("TEXT_LIST_NOT_FOUND", "Text list is mandatory", None)
                else:
                    if not data["input"]["textList"]:
                        return post_error("TEXT_LIST_EMPTY", "Text list cannot be empty", None)
                    else:
                        for text in data["input"]["textList"]:
                            if 'text' not in text.keys():
                                return post_error("TEXT_NOT_FOUND", "Text is mandatory", None)
                            if 'locale' not in text.keys():
                                return post_error("LOCALE_NOT_FOUND", "Locale is mandatory", None)
                            if 'model' not in text.keys():
                                return post_error("MODEL_NOT_FOUND", "Model details are mandatory for this wf.",
                                                  None)
                            else:
                                model = text["model"]
                                if 'model_id' not in model.keys():
                                    return post_error("MODEL_ID_NOT_FOUND", "Model Id is mandatory.", None)
                            if 'node' not in text.keys():
                                return post_error("NODE_NOT_FOUND", "Node is mandatory", None)
                            else:
                                node = text["node"]
                                if 'recordID' not in node.keys():
                                    return post_error("RECORD_ID_NOT_FOUND", "Record ID is mandatory", None)
                                if 'pageNo' not in node.keys():
                                    return post_error("PAGE_NO_NOT_FOUND", "Page no is mandatory", None)
                                if 'blockID' not in node.keys():
                                    return post_error("BLOCK_ID_NOT_FOUND", "Block ID is mandatory", None)
                                if 'sentenceID' not in node.keys():
                                    return post_error("SENTENCE_ID_NOT_FOUND", "sentence ID is mandatory", None)




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
                            if 'url_end_point' not in model.keys():
                                return post_error("MODEL_URLENDPOINT_NOT_FOUND", "Model url end point is mandatory.",
                                                  None)
