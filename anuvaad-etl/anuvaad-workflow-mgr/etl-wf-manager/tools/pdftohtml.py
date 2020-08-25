

from configs.wfmconfig import tool_pdftohtml
from configs.wfmconfig import tool_fileconverter


class PDFTOHTML:
    def __init__(self):
        pass

    # Method to validate if the wf-input contains all the fields reqd by Pdf2html.
    def validate_pdftohtml_input(self, wf_input):
        for file in wf_input["files"]:
            if not file["path"]:
                return False
            if not file["type"]:
                return False
            if not file["locale"]:
                return False
        return True



    # Returns a json of the format accepted by Pdf2html based on the wf-input.
    def get_pdftohtml_input_wf(self, wf_input):
        tool_input = {
            "files": wf_input["input"]["files"]
        }
        p2h_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_pdftohtml,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        p2h_input["metadata"]["module"] = tool_pdftohtml
        return p2h_input

    # Returns a json of the format accepted by Pdf2html based on the predecessor.
    def get_pdftohtml_input(self, task_output, predecessor):
        files = []
        if predecessor == tool_fileconverter:
            output = task_output["output"]
            for op_file in output:
                file = {
                    "path": op_file["outputFile"],
                    "locale": op_file["outputLocale"],
                    "type": op_file["outputType"]
                }
                files.append(file)
        else:
            return None
        tool_input = {
            "files": files
        }
        p2h_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_pdftohtml,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        p2h_input["metadata"]["module"] = tool_pdftohtml
        return p2h_input
