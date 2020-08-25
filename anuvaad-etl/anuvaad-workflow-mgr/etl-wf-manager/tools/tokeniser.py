

from configs.wfmconfig import tool_blockmerger
from configs.wfmconfig import tool_tokeniser

class Tokeniser:
    def __init__(self):
        pass

    # Method to validate if the wf-input contains all the fields reqd by Tokeniser.
    def validate_tokeniser_input(self, wf_input):
        for file in wf_input["files"]:
            if not file["path"]:
                return False
            if not file["type"]:
                return False
            if not file["locale"]:
                return False
        return True


    # Returns a json of the format accepted by Tokeniser.
    def get_tokeniser_input_wf(self, wf_input):
        tool_input = {
            "files": wf_input["input"]["files"]
        }
        tok_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder" : 0,
            "tool": tool_tokeniser,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        tok_input["metadata"]["module"] = tool_tokeniser
        return tok_input

    # Returns a json of the format accepted by Tokeniser based on the predecessor.
    def get_tokeniser_input(self, task_output, predecessor):
        if predecessor == tool_blockmerger:
            files = task_output["output"]["files"]
        else:
            return None
        tool_input = {
            "files": files
        }
        tok_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_tokeniser,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        tok_input["metadata"]["module"] = tool_tokeniser
        return tok_input

