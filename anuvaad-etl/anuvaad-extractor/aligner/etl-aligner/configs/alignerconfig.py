import os

#set GPU status
gpu_status = False

#CROSS-MODULE-COMMON-CONFIGS
kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')

# mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')
mongo_server_host = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017,localhost:27018/?replicaSet=foo')

file_upload_url = str(os.environ.get('USER_FILE_UPLOADER_HOST', 'http://gateway_anuvaad-user-fileuploader:5001')) \
                    + str(os.environ.get('USER_FILE_UPLOAD_ENDPOINT', '/anuvaad-api/file-uploader/v0/upload-file'))

#MODULE-SPECIFIC-CONFIGS
#common-variables
align_job_topic = "anuvaad-etl-alignment-jobs-v7"
anu_dp_wf_aligner_in_topic = "anuvaad-dp-tools-aligner-input-v3"
anu_dp_wf_aligner_out_topic = "anuvaad-dp-tools-aligner-output-v3"

#common variables for json based alignment
jsonalign_job_topic = "anuvaad-etl-jsonalignment-jobs-v1"
anu_dp_wf_jsonaligner_in_topic = "anuvaad-dp-tools-jsonaligner-input-v1"
anu_dp_wf_jsonaligner_out_topic = "anuvaad-dp-tools-jsonaligner-output-v1"


#kafka-configs
align_job_consumer_grp = os.environ.get('ANU_ETL_WF_CONSUMER_GRP', 'anu-etl-align-consumer-group')

#datastore-configs
mongo_alignment_db = os.environ.get('MONGO_ETL_ALIGNMENT_DB', 'anuvaad-etl')
mongo_alignment_col = os.environ.get('MONGO_ETL_ALIGNMENT_COL', 'extractor-aligner')

#module-configs
context_path = os.environ.get('SA_CONTEXT_PATH', '/anuvaad-etl/extractor/aligner')

# directory_path = os.environ.get('ALIGNER_UPLOAD_PATH', "/home/aswin/upload")
directory_path = os.environ.get('ALIGNER_UPLOAD_PATH', "/app/upload")

# labse_folder_path = os.environ.get('ALIGNER_LABSE_FOLDER_PATH', "/home/aswin/Downloads/LaBSE")
labse_folder_path = os.environ.get('ALIGNER_LABSE_FOLDER_PATH', "/app/available_labse_models")

laser_url = os.environ.get('LASER_PATH', 'http://127.0.0.1:8050/vectorize')
no_of_processes = os.environ.get("ALIGNER_NO_OF_PARALLEL_PROC", 5)

