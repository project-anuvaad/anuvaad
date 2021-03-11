from flask import Blueprint
from flask_restful import Api
from resources.notifier_api import NotifierBulkSearch


# end-point for bulksearch
NOTIFIER_BULK_SEARCH = Blueprint("sentence_extraction", __name__)
api = Api(NOTIFIER_BULK_SEARCH)
api.add_resource(NotifierBulkSearch, "/v0/notifier/bulksearch")
