
MODULE_CONTEXT = {'metadata':{'module':'DOCUMENT-CONVERTER'},'jobID': None}


# class AppContext:
#     @staticmethod
#     def addRecordID(record_id):
#         if record_id is not None:
#             MODULE_CONTEXT['jobID'] = record_id.split('|')[0]

def init():
    global app_context
    app_context = {'application_context' : None}