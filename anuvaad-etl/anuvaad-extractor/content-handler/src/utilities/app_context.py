
MODULE_CONTEXT = {'metadata':{'module':'CONTENT-HANDLER'}, 'jobID': None}

class AppContext:
    @staticmethod
    def addRecordID(record_id):
        if record_id is not None:
            MODULE_CONTEXT['jobID'] = record_id.split('|')[0]

    @staticmethod
    def getContext():
        return MODULE_CONTEXT
