import logging
import os
from datetime import datetime

from elasticsearch import Elasticsearch

log = logging.getLogger('file')

es_url = os.environ.get('ES_URL', 'http://172.30.0.55:9200')
es_error_index_test = "anuvaad-etl-errors-test-v1"
es_core_error_index = "anuvaad-etl-errors-core-v1"
es_wf_error_index = "anuvaad-etl-errors-wf-v1"
es_error_type = "errors"


def instantiate_es_client():
    es_client = Elasticsearch([es_url])
    return es_client


def index_to_es(index_obj):
    try:
        es = instantiate_es_client()
        id = index_obj["errorID"]
        if index_obj["errorType"] == "core-error":
            in_name = es_core_error_index
        else:
            in_name = es_wf_error_index
        index_obj = add_timestamp_field(index_obj)
        es.index(index=in_name, doc_type=es_error_type, id=id, body=index_obj)
    except Exception as e:
        log.exception("Indexing FAILED for errorID: " + index_obj["errorID"])


def add_timestamp_field(error):
    date_format = "%Y-%m-%d'T'%H:%M:%S.%f'Z'"
    epoch = error["timeStamp"]
    epoch_short = eval((str(epoch)[:10]))
    final_date = datetime.fromtimestamp(epoch_short).strftime(date_format)
    error["@timestamp"] = final_date
    return error