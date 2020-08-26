

from configs.wfmconfig import tool_aligner
from configs.wfmconfig import tool_tokeniser

class Aligner:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Aligner based on the wf-input.
    def get_aligner_input_wf(self, wf_input):
        source = {
            "filepath": wf_input["input"]["files"][0]["path"],
            "locale": wf_input["input"]["files"][0]["locale"],
            "type": wf_input["input"]["files"][0]["type"]
        }
        target = {
            "filepath": wf_input["input"]["files"][1]["path"],
            "locale": wf_input["input"]["files"][1]["locale"],
            "type": wf_input["input"]["files"][1]["type"]
        }
        tool_input = {
                "source": source,
                "target":  target
            }
        tok_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_aligner,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        tok_input["metadata"]["module"] = tool_tokeniser
        return tok_input

    # Returns a json of the format accepted by Aligner based on the predecessor.
    def get_aligner_input(self, task_output, predecessor):
        if predecessor == tool_tokeniser:
            source = {
                "filepath": task_output["output"]["files"][0]["outputFile"],
                "locale": task_output["output"]["files"][0]["outputLocale"],
                "type": task_output["output"]["files"][0]["outputType"]
            }
            target = {
                "filepath": task_output["output"]["files"][1]["outputFile"],
                "locale": task_output["output"]["files"][1]["outputLocale"],
                "type": task_output["output"]["files"][1]["outputType"]
            }
        else:
            return None

        tool_input = {
                "source": source,
                "target":  target
            }

        tok_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_aligner,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        tok_input["metadata"]["module"] = tool_tokeniser
        return tok_input
