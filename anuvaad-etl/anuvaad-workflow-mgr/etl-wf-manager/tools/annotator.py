from configs.wfmconfig import tool_annotator


class Annotator:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Annotator for SYNC and ASYNC
    def get_annotator_input_wf(self, wf_input):
        tool_input = wf_input["input"]["files"][0]
        ano_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_annotator,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        ano_input["metadata"]["module"] = tool_annotator
        return ano_input
