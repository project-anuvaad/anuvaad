

from configs.wfmconfig import tool_fileconverter


class FileConverter:

    def __init__(self):
        pass

    # Returns a json of the format accepted by File converter.
    def get_fc_input_wf(self, wf_input):
        tool_input = {
            "files": wf_input["input"]["files"]
        }
        fc_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_fileconverter,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        fc_input["metadata"]["module"] = tool_fileconverter
        return fc_input

    # Returns a json of the format accepted by File converter.
    def get_fc_input(self, task_output):
        return None
