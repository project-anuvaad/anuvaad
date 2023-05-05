

class ContentHandler:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Translator for SYNC and ASYNC
    def get_ch_update_req(self, wf_input):
        ch_input = {"blocks": wf_input["input"]["textBlocks"]}
        return ch_input
