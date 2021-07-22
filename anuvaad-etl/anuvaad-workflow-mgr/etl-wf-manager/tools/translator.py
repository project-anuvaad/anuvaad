from configs.wfmconfig import tool_tokeniser
from configs.wfmconfig import tool_translator


class Translator:
    def __init__(self):
        pass

    def is_contains_list_of_paragraphs(self, task_output):
        if isinstance(task_output["output"], list):
            if len(task_output["output"]) > 0 and isinstance(task_output["output"][0], dict) and 'sentences' in task_output["output"][0].keys():
                return True

        return False


    # Returns a json of the format accepted by Translator for SYNC and ASYNC
    def get_translator_input_wf(self, wf_input, sync):
        if not sync:
            tool_input = {
                "files": wf_input["input"]["files"]
            }
        else:
            tool_input = wf_input["input"]
        trans_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_translator,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        trans_input["metadata"]["module"] = tool_translator
        return trans_input

    # Returns a json of the format accepted by Translator based on the predecessor.
    def get_translator_input(self, task_output, predecessor, is_sync):
        if is_sync:
            if predecessor == tool_tokeniser:
                if self.is_contains_list_of_paragraphs(task_output=task_output):
                    tool_input = {
                        "model_id": task_output["output"][0]["model_id"],
                        "source_language_code": task_output["output"][0]["source_language_code"],
                        "target_language_code": task_output["output"][0]["target_language_code"],
                        "sentences": task_output["output"][0]["sentences"],
                        "workflowCode": task_output["workflowCode"]
                    }
                    return tool_input

                else:
                    tool_input = {
                        "recordID": task_output["output"]["record_id"],
                        "locale": task_output["output"]["locale"],
                        "textBlocks": task_output["output"]["text_blocks"]
                    }
            else:
                return None
        else:
            if predecessor == tool_tokeniser:
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

        trans_input = {
            "jobID": task_output["jobID"],
            "workflowCode": task_output["workflowCode"],
            "stepOrder": task_output["stepOrder"],
            "tool": tool_translator,
            "input": tool_input,
            "metadata": task_output["metadata"]
        }
        trans_input["metadata"]["module"] = tool_translator
        return trans_input
