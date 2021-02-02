
from configs.wfmconfig import tool_blocksegmenter
from configs.wfmconfig import tool_layoutdetector


class BlockSegmenter:

    def __init__(self):
        pass

    # Returns a json of the format accepted by Word Detector
    def get_bs_input_wf(self, wf_input):
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
        bs_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_blocksegmenter,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        bs_input["metadata"]["module"] = tool_blocksegmenter
        return bs_input

    # Returns a json of the format accepted by Block Segmenter based on a predecessor.
    def get_bs_input(self, task_output, predecessor):
        files = []
        if predecessor == tool_layoutdetector:
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
        bs_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_blocksegmenter,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        bs_input["metadata"]["module"] = tool_blocksegmenter
        return bs_input
