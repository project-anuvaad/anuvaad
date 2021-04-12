

from configs.wfmconfig import tool_worddetector
from configs.wfmconfig import tool_fileconverter

class WordDetector:

    def __init__(self):
        pass

    # Returns a json of the format accepted by Word Detector
    def get_wd_input_wf(self, wf_input):
        files = wf_input["input"]["files"]
        inputs = []
        for file in files:
            obj = {
                "file": {
                    "identifier": file["path"],
                    "name": file["path"],
                    "type": file["type"]
                },
                "config": file["config"]
            }
            inputs.append(obj)
        tool_input = {
            "inputs": inputs
        }
        wd_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_worddetector,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        wd_input["metadata"]["module"] = tool_worddetector
        return wd_input

    # Returns a json of the format accepted by Block merger based on a predecessor.
    def get_wd_input(self, task_output, predecessor):
        files = []
        if predecessor == tool_fileconverter:
            output = task_output["output"]
            for op_file in output:
                obj = {
                    "file": {
                        "identifier": op_file["outputFile"],
                        "name": op_file["outputFile"],
                        "type": op_file["outputType"]
                    }
                }
                files.append(obj)
        else:
            return None
        tool_input = {
            "inputs": files
        }
        wd_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_worddetector,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        wd_input["metadata"]["module"] = tool_worddetector
        return wd_input