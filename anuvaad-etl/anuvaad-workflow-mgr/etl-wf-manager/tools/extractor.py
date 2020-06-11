



class Extractor:
    def __init__(self):
        pass

    # Method to validate if the wf-input contains all the fields reqd by Extractor.
    def validate_tok_input(self, wf_input):
        for file in wf_input["files"]:
            if file["path"] is None:
                return False
            if file["type"] is None:
                return False
            if file["locale"] is None:
                return False

    def get_input(self, jobID, wf_input):
        files = wf_input["files"]
        return {"jobID": jobID, "files": files}
