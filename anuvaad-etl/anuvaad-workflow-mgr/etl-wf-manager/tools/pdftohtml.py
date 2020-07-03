



class PDFTOHTML:
    def __init__(self):
        pass

    # Method to validate if the wf-input contains all the fields reqd by Pdf2html.
    def validate_pdftohtml_input(self, wf_input):
        for file in wf_input["files"]:
            if file["path"] is None:
                return False
            if file["type"] is None:
                return False
            if file["locale"] is None:
                return False
        return True



    # Returns a json of the format accepted by Pdf2html based on the wf-input.
    def get_pdftohtml_input_wf(self, wf_input):
        tool_input = {
            "files": wf_input["input"]["files"]
        }
        tok_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": "PDFTOHTML",
            "input": tool_input
        }
        return tok_input

    # Returns a json of the format accepted by Pdf2html based on the predecessor.
    def get_pdftohtml_input(self, task_output, predecessor):
        return None
