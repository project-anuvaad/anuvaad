



class Aligner:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Aligner based on the wf-input.
    def get_aligner_input_wf(self, wf_input):
        tool_input = {
                "source": wf_input["input"]["files"][0],
                "target":  wf_input["input"]["files"][1]
            }
        tok_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": wf_input["stepOrder"],
            "tool": "TOKENISER",
            "input": tool_input
        }
        return tok_input

    # Returns a json of the format accepted by Aligner based on the predecessor.
    def get_aligner_input(self, task_output, predecessor):
        source = {}
        target = {}
        if predecessor == "TOKENISER":
            source = {
                "filepath": task_output["output"]["files"][0]["path"],
                "locale": task_output["output"]["files"][0]["locale"],
                "type": task_output["output"]["files"][0]["type"]
            }
            target = {
                "filepath": task_output["output"]["files"][1]["path"],
                "locale": task_output["output"]["files"][1]["locale"],
                "type": task_output["output"]["files"][1]["type"]
            }

        tool_input = {
                "source": source,
                "target":  target
            }
        tok_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": "TOKENISER",
            "input": tool_input
        }
        return tok_input
