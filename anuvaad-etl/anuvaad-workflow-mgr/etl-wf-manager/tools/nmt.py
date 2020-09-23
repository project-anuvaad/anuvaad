import uuid


class NMT:
    def __init__(self):
        pass

    # Returns a json of the format accepted by Translator for SYNC and ASYNC
    def get_nmt_it_req(self, wf_input):
        text_nmt = []
        for text in wf_input["input"]["textList"]:
            text_in = {"s_id": str(uuid.uuid4()), "id": text["modelID"], "src": text["src"], "tagged_prefix": text["taggedPrefix"]}
            text_nmt.append(text_in)
        return text_nmt
