from configs.wfmconfig import tool_doc_pre_processor


class Doc_Preprocessor:

    def __init__(self):
        pass

    # Returns a json of the format accepted by File translator.
    def get_ft_input_wf(self, wf_input):
        tool_input = wf_input["input"]["input"]
        ft_input = {
            "jobID": wf_input["jobID"],
            "workflowCode": wf_input["workflowCode"],
            "stepOrder": 0,
            "tool": tool_doc_pre_processor,
            "input": tool_input,
            "metadata": wf_input["metadata"]
        }
        ft_input["metadata"]["module"] = tool_doc_pre_processor
        return ft_input

    # Returns a json of the format accepted by File converter.
    def get_ft_input(self, task_output):
        return None
