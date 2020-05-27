from flask import jsonify
import enum

class Status(enum.Enum):
    SUCCESS = {
        "status": "SUCCESS",
        "state": "SENTENCE-TOKENISED",
        "taskStarttime": "",
        "taskendTime": ""
    }
    ERR_EMPTY_FILE = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "taskStarttime": "",
        "taskendTime": "",
        "error": "File do not have any content"
    }
    ERR_FILE_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "taskStarttime": "",
        "taskendTime": "",
        "error": "File not found."
    }
    ERR_DIR_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "taskStarttime": "",
        "taskendTime": "",
        "error": "There is no Directory."
    }
    ERR_EXT_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "taskStarttime": "",
        "taskendTime": "",
        "error": "This file type is not allowed."
    }
    ERR_locale_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "taskStarttime": "",
        "taskendTime": "",
        "error": "No language input"
    }
    ERR_jobid_NOT_FOUND = {
        "status": "FAILED",
        "state": "SENTENCE-TOKENISED",
        "taskStarttime": "",
        "taskendTime": "",
        "error": "jobID is not given."
    }


class CustomResponse():
    def __init__(self, status_code,jobid, taskid, input_filepath,output_filepath,in_file_type,out_file_type,in_locale,out_locale):
        self.status_code = status_code
        self.status_code['jobID'] = jobid
        self.status_code['taskID'] = taskid
        self.input_filepath = input_filepath
        self.output_filepath = output_filepath
        self.in_file_type = in_file_type
        self.in_locale = in_locale
        self.out_file_type = out_file_type
        self.out_locale = out_locale

    def get_response(self):
        self.status_code['input'] = self.res_input()
        self.status_code['output'] = self.res_output()
        return jsonify(self.status_code)

    def res_input(self):
        input_res = {
            "filepath": self.input_filepath,
            "type": self.in_file_type,
            "locale": self.in_locale
        }
        return input_res

    def res_output(self):
        output_res = {
            "filepath": self.output_filepath,
            "type": self.out_file_type,
            "locale": self.out_locale
        }
        return output_res
