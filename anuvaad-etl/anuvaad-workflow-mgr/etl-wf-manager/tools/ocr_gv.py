

from configs.wfmconfig import tool_ocrgooglevision

class OCRGV:

    def __init__(self):
        pass

    # Returns a json of the format accepted by OCR-GV
    def get_ogv_input_wf(self, wf_input):
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
        ogv_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_ocrgooglevision,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        ogv_input["metadata"]["module"] = tool_ocrgooglevision
        return ogv_input

    # Returns a json of the format accepted by OCR-GV based on a predecessor.
    def get_ogv_input(self, task_output, predecessor):
        return None