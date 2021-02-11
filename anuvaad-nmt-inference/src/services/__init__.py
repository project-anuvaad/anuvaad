from .model_loader import Loadmodels
''' load_models pre-loads nmt variable and stores the translator object in a dictionary with keys being the model id'''
load_models = Loadmodels()

from .translate import TranslateService, OpenNMTTranslateService
from .model_convert import ModelConvertService
from .labse_aligner import LabseAlignerService
from .document_translate import NMTTranslateService
from .performance import BatchNMTPerformanceService