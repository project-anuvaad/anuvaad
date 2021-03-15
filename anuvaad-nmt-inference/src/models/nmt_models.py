from mongoengine import *
import datetime
import uuid
from flask import  request, jsonify
import config

class CreateModel(Document):

    meta = {'collection': config.MONGO_NMT_MODELS_COLLECTION}

    source = ['en','hi','mr','ta','te','kn','gu','pa','bn','ml','as','brx','doi','ks','kok','mai','mni','ne','or','sd','si','ur','sat']

    created_on = DateTimeField(default = datetime.datetime.now)
    uuid = StringField(default=str(uuid.uuid4()))
    is_primary = BooleanField(required = True,default=False)
    model_id = IntField(required = True)
    model_name = StringField(Max_length=30)
    source_language_code = StringField(required=True,choices=source)
    source_language_name = StringField(required = True,Max_length=30)
    target_language_code = StringField(required=True,choices=source)
    target_language_name = StringField(required = True,Max_length=30)
    description = StringField()
    status = StringField(required = True,Max_length=20)