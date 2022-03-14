# import logging
DEBUG = False
API_URL_PREFIX = "/anuvaad/ocr"
HOST = "0.0.0.0"
PORT = 5005


ENABLE_CORS = False
IS_DYNAMIC = True
EXRACTION_RESOLUTION = 300

LANG_MAPPING = {
    "en": ["Latin", "eng"],
    "kn": ['Kannada', "anuvaad_kan"],
    "gu": ["Gujarati", "guj"],
    "or": ["Oriya", "anuvaad_ori"],
    "hi": ["Devanagari", "anuvaad_hin"],
    "bn": ["Bengali", "anuvaad_ben"],
    "mr": ["Devanagari", "mar"],
    "ta": ['Tamil', "anuvaad_tam"],
    "te": ["Telugu", "tel"],
    "ml": ["Malayalam", "anuvaad_mal"],
    "ma": ["Devanagari", "anuvaad_mar"],
    "pa": ["pan", "pan"],
    "sa": ["sat", "sat"]

}
LANGUAGE_LINE_THRESOLDS = {
    'en': {'text_threshold': 0.1, 'low_text': 0.5, 'link_threshold': 0.35}
}

# CRAFT_MODEL_PATH = './src/utilities/craft_pytorch/model/craft_mlt_25k.pth'
# CRAFT_REFINE_MODEL_PATH = './src/utilities/craft_pytorch/model/craft_refiner_CTW1500.pth'
MAGNIFICATION_RATIO = 1.0

LINE_PRIMA=True
CRAFT=False

LINE_PRIMA_SCORE_THRESH_TEST = 0.50
LINE_DETECTION=True

LINE_LAYOUT_MODEL_PATH = "./src/utilities/primalinenet/scene_text_judgement_line_detection_v1_model.pth"
LINE_LAYOUT_CONFIG_PATH = "./src/utilities/primalinenet/scene_text_line_detection_model_config.yaml"
##########################################################################
# Alignment
#EAST_MODEL = "./src/utilities/east/frozen_east_text_detection.pb"
ANGLE_TOLLERANCE  = 0.25
MIN_CONFIDENCE    = 0.5
MARGIN_TOLLERANCE = 9
EAST_WIDTH        = 1280
EAST_HEIGHT       = 1280
ALIGN = False
ALIGN_MODE = 'FAST'

DYNAMIC=False
### ocr config
BATCH_SIZE = 1
DYNAMIC_MARGINS = False
PERSPECTIVE_TRANSFORM = True
FALL_BACK_LANGUAGE = None
PSM = 7
POST_PROCESSING_MODE = None
MULTIPROCESS = False
MASK_OUT=False
DRAW_BOX=False
CROP_SAVE=False
SAVE_PATH_BOX="draw_sample/"
CROP_SAVE_PATH="draw_crop_sample/"

# crop config
C_X = -7
C_Y = -3

### image superesolution
SUPER_RESOLUTION=False
SUPER_RES_MODEL="./src/utilities/superres/sr_model.hdf5"

DEBUG_POSTPROCESS=False
