



class Aligner:
    def __init__(self):
        pass

    # Method to validate if the wf-input contains all the fields reqd by Aligner.
    def validate_aligner_input(self, wf_input):
        if len(wf_input["files"]) != 2:
            return False
        for file in wf_input["files"]:
            if file["path"] is None:
                return False
            if file["type"] is None:
                return False
            if file["locale"] is None:
                return False
        return True



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
                "filepath": task_output["output"]["files"][0]["outputFile"],
                "locale": task_output["output"]["files"][0]["outputLocale"],
                "type": task_output["output"]["files"][0]["outputType"]
            }
            target = {
                "filepath": task_output["output"]["files"][1]["outputFile"],
                "locale": task_output["output"]["files"][1]["outputLocale"],
                "type": task_output["output"]["files"][1]["outputType"]
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
