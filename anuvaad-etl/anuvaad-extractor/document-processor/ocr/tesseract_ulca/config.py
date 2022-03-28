# import logging
DEBUG = False
API_URL_PREFIX = "/anuvaad/ocr"
HOST = "0.0.0.0"
PORT = 5000


ENABLE_CORS = False
IS_DYNAMIC = True
EXRACTION_RESOLUTION = 300


LANG_MAPPING = {
    "en": ["Latin", "eng"],
    "hi": ["anuvaad_hin", "Devanagari"],
    "ta": ["anuvaad_tam", "Tamil"],
    "kn": ["anuvaad_kan", "Kannada"],
    "bn": ["Bengali"],
    "ml": ["Malayalam"],
    "te": ["Telugu"],
}

KEY_HASH = "d1fede612afe30f317da6666a026e86d33ffce887bdb60b933452c5f059bb6c98062e5f200b3b8dddf12cfa2d4099dad5fe9bc820412bdebe45f73eba3bdae0c"
