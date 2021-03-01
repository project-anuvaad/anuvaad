import os

kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')

anu_etl_wf_error_topic = os.environ.get('ANUVAAD_ETL_WF_ERROR_TOPIC', 'anuvaad-etl-wf-errors')
es_url = os.environ.get('ANUVAAD_DP_ES_URL', 'localhost')

es_core_error_index = os.environ.get('ANUVAAD_DP_ES_CORE_ERROR_INDEX', 'anuvaad-dp-errors-core-v1')
es_wf_error_index = os.environ.get('ANUVAAD_DP_ES_WF_ERROR_INDEX', 'anuvaad-dp-errors-wf-v1')
es_audit_index = os.environ.get('ANUVAAD_DP_ES_AUDIT_INDEX', 'anuvaad-dp-audit-v1')

is_debug_enabled = os.environ.get('AUDITOR_LOG_DEBUG_ENABLED', True)
is_info_enabled = os.environ.get('AUDITOR_LOG_INFO_ENABLED', True)
is_error_enabled = os.environ.get('AUDITOR_LOG_ERROR_ENABLED', True)
is_exc_enabled = os.environ.get('AUDITOR_LOG_EXC_ENABLED', True)