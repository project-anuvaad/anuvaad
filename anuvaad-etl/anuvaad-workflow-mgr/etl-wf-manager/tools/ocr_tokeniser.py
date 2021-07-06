from configs.wfmconfig import tool_ocrdd10googlevision, tool_ocrdd15googlevision, tool_ocrtokeniser, tool_ocrdd20tesseract


class OCRTokeniser:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Tokeniser for SYNC and ASYNC
    def get_ocr_tokeniser_input_wf(self, wf_input, is_sync):
        if not is_sync:
            tool_input = {
                "files": wf_input["input"]["files"]
            }
        else:
            tool_input = {
                "record_id": wf_input["input"]["recordID"],
                "model_id": wf_input["input"]["model"]["model_id"],
                "locale": wf_input["input"]["locale"],
                "text_blocks": wf_input["input"]["textBlocks"]
            }
        tok_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_ocrtokeniser,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        tok_input["metadata"]["module"] = tool_ocrtokeniser
        return tok_input

    # Returns a json of the format accepted by Tokeniser based on the predecessor.
    def get_ocr_tokeniser_input(self, task_output, predecessor):
        predecessors = [tool_ocrdd10googlevision, tool_ocrdd15googlevision, tool_ocrdd20tesseract]
        if predecessor in predecessors:
            files = []
            op_files = task_output["output"]
            for file in op_files:
                file = {
                    "path": file["outputFile"],
                    "locale": file["outputLocale"][0],
                    "type": file["outputType"]
                }
                files.append(file)
        else:
            return None
        tool_input = {
            "files": files
        }
        tok_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_ocrtokeniser,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        tok_input["metadata"]["module"] = tool_ocrtokeniser
        return tok_input
