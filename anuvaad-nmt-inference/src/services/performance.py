import sys
import time
import math
from models import CustomResponse, Status
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
from .document_translate import NMTTranslateService

class BatchNMTPerformanceService:
    @staticmethod
    def find_performance(input_text_file,model_id,batch_size):
        try:
            with open(input_text_file,'r') as f:
                input_text_array = f.readlines()
                input_text_array = [sent[:-1] for sent in input_text_array]

            word_count = 0
            for sentence in input_text_array:
                word_count += len(sentence.split())

            batch_input_array = []
            num_of_batch = len(input_text_array) // batch_size
            for i in range(num_of_batch + 1):
                prev_index = i * batch_size
                if (prev_index + batch_size) < len(input_text_array):
                    input_batch = {'id': model_id, 'src_list': input_text_array[prev_index: prev_index + batch_size]}
                else:
                    input_batch = {'id': model_id, 'src_list': input_text_array[prev_index: ]}
                batch_input_array.append(input_batch)

            time_taken_array = []
            out_tgt_array = []
            for batch_input in batch_input_array:
                start = time.time()
                out_batch = NMTTranslateService.batch_translator(batch_input)
                time_taken = time.time() - start
                time_taken_array.append(time_taken)
                out_tgt_array.append(out_batch['tgt_list'])           
            avg_words_per_sec = word_count / sum(time_taken_array)
            out_tgt_array = [sentence for out_batch in out_tgt_array for sentence in out_batch]

            return avg_words_per_sec, out_tgt_array
        
        except Exception as e:
            status = Status.SYSTEM_ERR.value
            log_exception("Exception caught in performance check: {} ".format(e),MODULE_CONTEXT,e)
            out = CustomResponse(status, [])  

        return out

