

from configs.wfmconfig import tool_htmltojson
from configs.wfmconfig import tool_pdftohtml


class HTMLTOJSON:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Pdf2html based on the wf-input.
    def get_htmltojson_input_wf(self, wf_input):
        tool_input = {
            "files": wf_input["input"]["files"]
        }
        h2j_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_htmltojson,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        h2j_input["metadata"]["module"] = tool_htmltojson
        return h2j_input

    # Returns a json of the format accepted by Pdf2html based on the predecessor.
    def get_htmltojson_input(self, task_output, predecessor):
        files = []
        if predecessor == tool_pdftohtml:
            html_files = task_output["output"]
            for file in html_files:
                req_file = {
                    "htmlFolderPath": file["outputHtmlFilePath"],
                    "imageFolderPath": file["outputImageFilePath"],
                    "locale": file["outputLocale"],
                    "type": "folder"
                }
                files.append(req_file)
        else:
            return None

        tool_input = {"files": files}
        h2j_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_htmltojson,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        h2j_input["metadata"]["module"] = tool_htmltojson
        return h2j_input
