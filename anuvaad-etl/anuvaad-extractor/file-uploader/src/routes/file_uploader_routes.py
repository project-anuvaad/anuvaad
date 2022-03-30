from logging.config import dictConfig

from flask import Blueprint
from flask_restful import Api
from resources.file_handler import FileUploader, FileDownloader, FileServe

# end-point for independent service
FILE_UPLOADER_BLUEPRINT = Blueprint("file_uploader", __name__)
api = Api(FILE_UPLOADER_BLUEPRINT)
api.add_resource(FileUploader, "/v0/upload-file")
api.add_resource(FileDownloader, "/v0/download-file")
api.add_resource(FileServe, "/v0/serve-file")


# Log config
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] {%(filename)s:%(lineno)d} %(threadName)s %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {
        'info': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'filename': 'info.log'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'stream': 'ext://sys.stdout',
        }
    },
    'loggers': {
        'file': {
            'level': 'DEBUG',
            'handlers': ['info', 'console'],
            'propagate': ''
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['info', 'console']
    }
})
