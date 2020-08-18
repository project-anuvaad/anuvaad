

from configs.wfmconfig import tool_blockmerger

class BlockMerger:

    def __init__(self):
        pass

    # Method to validate if the wf-input contains all the fields reqd by Block merger.
    def validate_bm_input(self, wf_input):
        for file in wf_input["files"]:
            if file["path"] is None:
                return False
            if file["type"] is None:
                return False
            if file["locale"] is None:
                return False
        return True

    # Returns a json of the format accepted by Block merger.
    def get_bm_input_wf(self, wf_input):
        tool_input = {
            "files": wf_input["input"]["files"]
        }
        bm_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_blockmerger,
            "input": tool_input
        }
        return bm_input

    # Returns a json of the format accepted by Block merger.
    def get_bm_input(self, task_output):
        return None