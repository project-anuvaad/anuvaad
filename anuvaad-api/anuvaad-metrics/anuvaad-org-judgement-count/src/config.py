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

EMAIL_NOTIFIER = ["srihari.nagaraj@tarento.com","hanumesh.kamatagi@tarento.com","apoorva.bellary@tarento.com"]


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
    "kok": "Konkani",
    "sa": "Sanskrit",
    "sd": "Sindhi",
    "ur": "Urdu",
    "ne": "Nepali",
    "brx": "bodo",
    "doi": "Dogri",
    "sat": "Santali",
    "mni": "Manipuri",
    "lus": "Lushai",
    "kha": "Khasi",
    "ks": "Kashmiri",
    "mai": "Maithili",
    "pnr": "Panim",
    "grt": "Garo",
    "si": "Sinhalese",
    "njz": "Nishi",
    "as": "Assamese",
}

jud = os.environ.get('ANUVAAD_JUD_METRICS','https://developers.anuvaad.org')

backup_file_1 = "d735bdc62fa94076bb5adf_USER_WISE_JUD_STATS1.csv"
backup_file_2 = "d735bdc62fa94076bb5adf_USER_WISE_JUD_STATS2.csv"