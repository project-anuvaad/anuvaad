

from configs.wfmconfig import tool_ocrtesseract
from configs.wfmconfig import tool_blocksegmenter


class OCRTESS:

    def __init__(self):
        pass

    # Returns a json of the format accepted by Word Detector
    def get_octs_input_wf(self, wf_input):
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
        octs_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_ocrtesseract,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        octs_input["metadata"]["module"] = tool_ocrtesseract
        return octs_input

    # Returns a json of the format accepted by OCR Tesseract based on a predecessor.
    def get_octs_input(self, task_output, predecessor):
        files = []
        if predecessor == tool_blocksegmenter:
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
        octs_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_ocrtesseract,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        octs_input["metadata"]["module"] = tool_ocrtesseract
        return octs_input