from configs.wfmconfig import tool_filetranslator


class FileTranslator:

    def __init__(self):
        pass

    # Returns a json of the format accepted by File translator.
    def get_ft_input_wf(self, wf_input):
        tool_input = {
            "files": wf_input["input"]["files"]
        }
        ft_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_filetranslator,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        ft_input["metadata"]["module"] = tool_filetranslator
        return ft_input

    # Returns a json of the format accepted by File converter.
    def get_ft_input(self, task_output):
        return None
