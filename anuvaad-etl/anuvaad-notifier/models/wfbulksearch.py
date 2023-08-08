import requests
import config


class WFBulkSearch:
    def __init__(self, offset, limit, jobIDs, taskDetails, workflowCodes, userIDs, auth):
        self.offset = offset
        self.limit = limit
        self.jobIDs = jobIDs
        self.taskDetails = taskDetails
        self.workflowCodes = workflowCodes
        self.userIDs = userIDs
        self.auth = auth




    def bulk_search(self):
        print("INITIATE BULK SEARCH")

        url = config.WF_BULK_SEARCH_URL_HOST + config.WF_BULK_SEARCH_ENDPOINT
        payload = "{\n    \"offset\": "+ self.offset +",\n    \"limit\": "+ self.limit +",\n    \"jobIDs\": [\n        \" " + self.jobIDs +"\"\n    ],\n    \"taskDetails\": "+ self.taskDetails +",\n    \"workflowCodes\": [\n        \" " + self.workflowCodes +"\"\n    ]\n, \"userIDs\": [\n        \" " + self.userIDs +"\"\n    ]}"
        headers = {'auth-token': self.auth,  'content-type': 'application/json'}
        response = requests.request("POST", url, headers=headers, data=payload).json()



        return response
