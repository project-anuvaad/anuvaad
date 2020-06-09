



class Tokeniser:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Tokeniser.
    def get_tokeniser_input_wf(self, wf_input):
        tool_input = {
            "files": wf_input["input"]["files"]
        }
        tok_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder" : wf_input["stepOrder"],
            "tool": "TOKENISER",
            "input": tool_input
        }
        return tok_input

    # Returns a json of the format accepted by Tokeniser based on the predecessor.
    def get_tokeniser_input(self, task_output, predecessor):
        if predecessor == "EXTRACTOR":
            files = task_output["output"]["files"]

        tool_input = {
            "files": files
        }
        tok_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": "TOKENISER",
            "input": tool_input
        }
        return tok_input

