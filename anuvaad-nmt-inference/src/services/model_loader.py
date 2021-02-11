import ctranslate2
import config
import json 
import os
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT


class Loadmodels:
    '''
    Load nmt models while starting the application
    Returns a dictionary of model id and model object(based on ctranslate2)
    '''
    def __init__(self):
        log_info("Pre-loading NMT models at startup",MODULE_CONTEXT) 
        self.model_paths,self.ids = self.get_model_path()
        self.loaded_models = self.return_loaded_models(self.model_paths,self.ids)  

    def get_model_path(self):
        with open(config.ICONFG_FILE) as f:
            confs = json.load(f)
            model_root = confs['models_root']
            models = confs['models']
            path = [model["path"] for model in models]
            final_path =  [os.path.join(model_root, path[i]) for i in range(len(path))]
            ids = [model["id"] for model in models]
            return final_path,ids
     
    def return_loaded_models(self,model_paths,ids):
        loaded_models = {}
        for i,path in enumerate(model_paths):             
            translator = ctranslate2.Translator(path,device="auto")
            loaded_models[ids[i]] = translator
            log_info("Model Loaded: {}".format(ids[i]),MODULE_CONTEXT) 
        return loaded_models 
     
    def return_models(self):
        return self.loaded_models
              


