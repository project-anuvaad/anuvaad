import logging
from datetime import datetime
from elasticsearch import Elasticsearch

log = logging.getLogger('file')

es_url = "https://user:secret@localhost:443"
es_error_index_test = "anuvaad-etl-errors-test"
es_error_index = "anuvaad-etl-errors"
es_error_wf_type = "wf-errors"
es_error_core_type = "core-errors"


def instantiate_es_client():
    es_client = Elasticsearch([es_url])
    return es_client


def index_to_es(self, index_obj):
    es = self.instantiate_es_client()
    try:
        id = index_obj["errorID"]
        if index_obj["errorType"] == "core-error":
            in_type = es_error_core_type
        else:
            in_type = es_error_wf_type
        es.index(index=es_error_index_test, type=in_type, id=id, body=index_obj)

    except Exception as e:
        log.exception("Indexing FAILED for errorID: " + index_obj["errorID"])
