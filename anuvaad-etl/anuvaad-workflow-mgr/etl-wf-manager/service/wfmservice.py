
from utilities.wfmutils import WFMUtils
from tools.aligner import Aligner
from tools.ingestor import Ingestor
from tools.extractor import Extractor
from tools.tokeniser import Tokeniser
from tools.transformer import Transformer



wfmutils = WFMUtils()
aligner = Aligner()
ingestor = Ingestor()
extractor = Extractor()
tokeniser = Tokeniser()
transformer = Transformer()

class WFMService:
    def __init__(self):
        pass

    def manage_workflow(self, wfconfig):
        orderofexecution_dict = wfmutils.get_order_of_exc(wfconfig)
        for order in orderofexecution_dict:
            tool = order["tool"][0]["name"]
            if tool is "TOKENISER":
                tokeniser.initiate_tok_task()
            if tool is "ALIGNER":
                aligner.initiate_ali_task()

            if order["endState"] is True:
                break


        pass
