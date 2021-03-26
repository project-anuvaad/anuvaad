from mongoengine import *
import datetime
import uuid
import config

class KafkaClass(EmbeddedDocument):

    def Inner():
        input_topic = StringField()
        output_topic = StringField()
    def api():
        host = StringField()
        api_endpoint = StringField()      
        
    kafka = DictField(Inner())
    translation = DictField(api(),required = True)
    interactive = DictField(api())

class CreateModel(Document):

    meta = {'collection': config.MONGO_NMT_MODELS_COLLECTION}
    # source = ['en','hi','mr','ta','te','kn','gu','pa','bn','ml','as','brx','doi','ks','kok','mai','mni','ne','or','sd','si','ur','sat','lus','njz','pnr','kha','grt']
    source = config.source

    created_on = DateTimeField(default = datetime.datetime.now)
    uuid = UUIDField(default=uuid.uuid4, binary=False)
    is_primary = BooleanField(required = True,default=False)
    model_id = IntField(required=True,unique=True)
    model_name = StringField(Max_length=30)
    source_language_code = StringField(required=True,choices=source)
    source_language_name = StringField(required = True,Max_length=30)
    target_language_code = StringField(required=True,choices=source)
    target_language_name = StringField(required = True,Max_length=30)
    description = StringField()
    status = StringField(required = True,choices=['ACTIVE','INACTIVE'])
    connection_details = EmbeddedDocumentField(KafkaClass,required=True)
    interactive_translation = BooleanField(required = True,default=False)
