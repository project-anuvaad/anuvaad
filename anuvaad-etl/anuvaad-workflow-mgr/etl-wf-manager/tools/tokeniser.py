from configs.wfmconfig import tool_blockmerger, tool_tokeniser, tool_filetranslator


class Tokeniser:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Tokeniser for SYNC and ASYNC
    def get_tokeniser_input_wf(self, wf_input, is_sync):
        if not is_sync:
            tool_input = {
                "files": wf_input["input"]["files"]
            }
        else:
            if 'paragraphs' in wf_input["input"].keys():
                tool_input = {
                    "model_id": wf_input["input"]["model_id"],
                    "source_language_code":  wf_input["input"]["source_language_code"],
                    "target_language_code": wf_input["input"]["target_language_code"],
                    "locale": wf_input["input"]["locale"],
                    "paragraphs": wf_input["input"]["paragraphs"]
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
            "tool": tool_tokeniser,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        tok_input["metadata"]["module"] = tool_tokeniser
        return tok_input

    # Returns a json of the format accepted by Tokeniser based on the predecessor.
    def get_tokeniser_input(self, task_output, predecessor):
        predecessors = [tool_blockmerger, tool_filetranslator]
        if predecessor in predecessors:
            files = []
            op_files = task_output["output"]
            for file in op_files:
                file = {
                    "path": file["outputFile"],
                    "locale": file["outputLocale"],
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
            "tool": tool_tokeniser,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        tok_input["metadata"]["module"] = tool_tokeniser
        return tok_input
