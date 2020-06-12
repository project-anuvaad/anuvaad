



class Ingestor:
    def __init__(self):
        pass

    # Method to validate if the wf-input contains all the fields reqd by Ingestor.
    def validate_ingestor_input(self, wf_input):
        for file in wf_input["files"]:
            if file["path"] is None:
                return False
            if file["type"] is None:
                return False
            if file["locale"] is None:
                return False
        return True

    def get_input(self, jobID, wf_input):
        files = wf_input["files"]
        return {"jobID": jobID, "files": files}

    def initiate_ing_task(self,jobID, wf_input):
        pass
