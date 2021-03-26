
MODULE_CONTEXT = {'metadata':{'module':'OCR-CONTENT-HANDLER'}, 'jobID': None,'userID':None}

class AppContext:
    @staticmethod
    def addRecordID(record_id):
        if record_id is not None:
            MODULE_CONTEXT['jobID'] = record_id.split('|')[0]

    @staticmethod
    def adduserID(user_id):
        if user_id is not None:
            MODULE_CONTEXT['userID'] = user_id

    @staticmethod
    def getContext():
        return MODULE_CONTEXT
