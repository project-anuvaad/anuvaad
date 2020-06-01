



class Tokeniser:
    def __init__(self):
        pass

    def get_input(self, jobID, wf_input):
        files = wf_input["files"]
        return {"jobID": jobID, "files": files}

    def initiate_tok_task(self, jobID, wf_input):
        pass
