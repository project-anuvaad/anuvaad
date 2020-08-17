import os


#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
mongo_server_host = os.environ.get('MONGO_SERVER_HOST', 'mongodb://localhost:27017/')
file_upload_url = os.environ.get('FILE_UPLOAD_URL', 'https://auth.anuvaad.org/upload')



#MODULE-SPECIFIC-CONFIGS
#common-variables
anu_etl_wfm_core_topic = 'anu-etl-wf-initiate-v2'

#kafka-configs
anu_etl_wfm_consumer_grp = os.environ.get('ANU_ETL_WF_CONSUMER_GRP', 'anu-etl-wfm-consumer-group')
anu_etl_wf_error_topic = os.environ.get('ANU_ETL_WF_ERROR_TOPIC', 'anuvaad-etl-wf-errors')

#datastore-configs
mongo_alignment_db = os.environ.get('MONGO_ALIGNMENT_DB', 'anuvaad-etl-dataflow-pipeline')
mongo_alignment_col_jobs = os.environ.get('MONGO_WFMJOBS_COL', 'anuvaad-etl-wfm-jobs')

#module-configs
context_path = os.environ.get('ANU_ETL_WFM_CONTEXT_PATH', '/anuvaad-etl/wf-manager')
config_file_url = os.environ.get('ETL_WFM_CONFIG_FILE_URL',
            'https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmanager_feature/anuvaad-etl/anuvaad-workflow-mgr/config/example.yml')


