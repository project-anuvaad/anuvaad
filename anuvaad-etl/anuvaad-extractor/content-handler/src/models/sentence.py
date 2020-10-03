from mongoengine import *

class Sentence(Document):
    s_id    = StringField()
    n_id    = StringField()
    src     = StringField()
    tgt     = StringField()
    pred    = FloatField()

class Data(Document):
    block_id            = StringField()
    block_identifier    = StringField()
    record_id           = StringField()
    tokenized_sentences = ListField(Sentence)

class Block(Document):
    record_id           = StringField()
    page_no             = IntField()
    job_id              = StringField()
    data                = ReferenceField(Data)



