import logging
import os
from elasticsearch import Elasticsearch

log = logging.getLogger('file')

es_url = os.environ.get('ES_URL', 'http://172.30.0.55:9200')
es_error_index_test = "anuvaad-etl-errors-test"
es_error_index = "anuvaad-etl-errors"
es_error_wf_type = "wf-errors"
es_error_core_type = "core-errors"


def instantiate_es_client():
    es_client = Elasticsearch([es_url])
    return es_client


def index_to_es(index_obj):
    try:
        es = instantiate_es_client()
        id = index_obj["errorID"]
        if index_obj["errorType"] == "core-error":
            in_type = es_error_core_type
        else:
            in_type = es_error_wf_type
        es.index(index=es_error_index_test, doc_type=in_type, id=id, body=index_obj)
    except Exception as e:
        log.exception("Indexing FAILED for errorID: " + index_obj["errorID"])
