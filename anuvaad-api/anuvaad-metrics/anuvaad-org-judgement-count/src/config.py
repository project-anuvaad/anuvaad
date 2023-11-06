import os
import pymongo

## app configuration variables
DEBUG = False
API_URL_PREFIX = "/anuvaad-metrics"
HOST = "0.0.0.0"
PORT = 5001

ENABLE_CORS = True


MONGO_SERVER_URL = os.environ.get("MONGO_CLUSTER_URL", "mongodb://localhost:27017")
USER_DB = os.environ.get("MONGO_DB_IDENTIFIER", "usermanagement")
WFM_DB = os.environ.get("MONGO_WFM_DB", "anuvaad-etl-wfm-db")
PREPROCESSING_DB = os.environ.get("MONGO_CH_DB", "preprocessing")

CRON_TIME = os.environ.get("ANUVAAD_METRICS_CRON","00 00,06,12,18 * * *")

WEEKLY_CRON_FILE_NAME1 = "language_wise_JUD_STATS1.csv"
WEEKLY_CRON_FILE_NAME2 = "language_wise_JUD_STATS2.csv"

DAILY_CRON_FILE_NAME1 = "language_wise_JUD_STATS1_daily.csv"
DAILY_CRON_FILE_NAME2 = "language_wise_JUD_STATS2_daily.csv"

STATS_FILE = "jud_stats.csv"
STATS_FILE_COPY = "jud_stats_copy.csv"

REVIEWER_DATA_BASEFILE =  "reviewer_data_base.csv"
REVIEWER_DATA_CRONFILE =  "reviewer_data_cron.csv"
REVIEWER_DATA_BASE_SDATE =  [2000,1,1]
REVIEWER_DATA_BASE_EDATE =  [2023,4,30]

MASK_ORGS = ["ANUVAAD", "TARENTO_TESTORG", "NONMT", "ECOMMITTEE ", 
             "SC_TC", "SUVAS", "ULCA_ANUVAAD", "ECOMMITTEE", "IITB", "ASSAM"]
ORG_REPLACER= {
    'NEPAL':'SIKKIM',
    'SIMLA':'SHIMLA',
    'CHATTISGARH':'CHHATTISGARH',
}

METRICS_ORG_MASKING = (os.getenv('METRICS_ORG_MASKING', 'True') == 'True') # if (value is 'True' or env does not exists) then boolTrue else boolFalse

EMAIL_NOTIFIER = ["rathan.muralidhar@tarento.com","aswin.pradeep@tarento.com"]


USER_COLLECTION = "sample"
WFM_COLLECTION = "anuvaad-etl-wfm-jobs-collection"
FILE_CONTENT_COLLECTION = "file_content"

DOWNLOAD_FOLDER = "upload"
USERMANAGEMENT = os.environ.get(
    "USERMANAGEMENT_URL", "http://gateway_anuvaad-user-management:5001"
)

# mail server configs
MAIL_SETTINGS = {
    "MAIL_SERVER": os.environ.get("SMTP_HOST", "********************"),
    "MAIL_PORT": os.environ.get("SMTP_PORT", 465),
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": os.environ.get("SMTP_USERNAME", "***************"),
    "MAIL_PASSWORD": os.environ.get("SMTP_PASSWORD", "************************"),
    "MAIL_SENDER_NAME": os.environ.get("SMTP_SENDERNAME", "Anuvaad Support"),
    "MAIL_SENDER": os.environ.get("SUPPORT_EMAIL", "anuvaad.support@tarento.com"),
}
MAIL_SENDER = os.environ.get("SUPPORT_EMAIL", "anuvaad.support@tarento.com")


LANG_MAPPING = {
    "en": "English",
    "kn": "Kannada",
    "gu": "Gujrati",
    "or": "Odia",
    "hi": "Hindi",
    "bn": "Bengali",
    "mr": "Marathi",
    "ta": "Tamil",
    "te": "Telugu",
    "ml": "Malayalam",
    "ma": "Marathi",
    "pa": "Punjabi",
    "kok": "Konkani(MH)",
    "sa": "Sanskrit",
    "sd": "Sindhi(Arab)",
    "ur": "Urdu",
    "ne": "Nepali",
    "brx": "bodo",
    "doi": "Dogri",
    "sat": "Santali",
    "mni": "Manipuri(Mtei)",
    "lus": "Lushai",
    "kha": "Khasi",
    "ks": "Kashmiri(Arab)",
    "mai": "Maithili",
    "pnr": "Panim",
    "grt": "Garo",
    "si": "Sinhalese",
    "njz": "Nishi",
    "as": "Assamese",
    'gom': "Konkani", 
    'ks_Deva': "Kashmiri(Devanagari)", 
    'mni_Beng': "Manipuri(Bengali)",
    'sd_Deva': "Sindhi(Devanagari)",
}

jud = os.environ.get('ANUVAAD_JUD_METRICS','https://developers.anuvaad.org')

TRANSLITERATION_URL = os.environ.get('TRANSLITERATION_URL','https://api.dhruva.ai4bharat.org/services/inference/transliteration')
ASR_URL = os.environ.get('ASR_URL',"https://api.dhruva.ai4bharat.org/services/inference/asr")
ACCESS_TOKEN = os.environ.get('DHRUVA_ACCESS_TOKEN',"None")

backup_file_1 = "d735bdc62fa94076bb5adf_USER_WISE_JUD_STATS1.csv"
backup_file_2 = "d735bdc62fa94076bb5adf_USER_WISE_JUD_STATS2.csv"

EMAIL_LIST = ["kn_doc_translation@suvas.in"]