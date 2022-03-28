import ctranslate2
from models import CustomResponse, Status
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import os
import json 
import sys
import config

class ModelConvertService:
    @staticmethod  
    def model_conversion(inputs):
        out = {}
        if any(v not in inputs for v in ['inp_model_path','out_dir']):
            out = CustomResponse(Status.INCOMPLETE_API_REQUEST.value, [])
            log_info("Missing either inp_model_path,out_dir in model conversion request",MODULE_CONTEXT)
            return out
        with open(config.ICONFG_FILE) as f:
            confs = json.load(f)
            model_root = confs['models_root']
        final_dir =  os.path.join(model_root, inputs['out_dir'])  
        try:
            log_info("Inside model_conversion-interactive_translate function",MODULE_CONTEXT)
            converter = ctranslate2.converters.OpenNMTPyConverter(inputs['inp_model_path'])       # inp_model_path: the model which has to be converted
            output_dir = converter.convert(
                        final_dir,                                          # Path to the output directory.
                        "TransformerBase",                                  # A model specification instance from ctranslate2.specs.
                        vmap=None,                                          # Path to a vocabulary mapping file.
                        quantization=None,                                  # Weights quantization: "int8" or "int16".
                        force=False)
            log_info("Interactive model converted and saved at: {}".format(output_dir),MODULE_CONTEXT)   
            out = CustomResponse(Status.SUCCESS.value, None)   
        except Exception as e:
            log_exception("Error in model_conversion interactive translate: {} and {}".format(sys.exc_info()[0],e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['message'] = str(e)
            out = CustomResponse(status, None)  

        return out