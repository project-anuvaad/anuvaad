
MODULE_CONTEXT = {'metadata':{'module':'CONTENT-HANDLER', 'entityID': None}}

class AppContext:
    @staticmethod
    def addRecordID(record_id):
        if record_id is not None:
            MODULE_CONTEXT['metadata']['entityID'] = record_id.split('|')[0]

    @staticmethod
    def getContext():
        return MODULE_CONTEXT
