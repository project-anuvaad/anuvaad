from src.utilities.model_response import checking_file_response
from src.utilities.utils import FileOperation
from src.kafka.producer import Producer
from src.kafka.consumer import Consumer
import time
import config

def process_tokenization_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
    task_id = str("TOK-" + str(time.time()).replace('.', ''))
    task_starttime = str(time.time()).replace('.', '')
    consumer = Consumer(config.sen_topic, config.bootstrap_server)
    consumer = consumer.consumer_instantiate() #Consumer
    try:
        for msg in consumer:
            data = msg.value
            print("data",data)
            input_files, workflow_id, jobid, tool_name, step_order = file_ops.json_input_format(data)
            task_id = str("TOK-" + str(time.time()).replace('.', ''))
            task_starttime = str(time.time()).replace('.', '')
            file_value_response = checking_file_response(jobid, workflow_id, tool_name, step_order, task_id, task_starttime, input_files, DOWNLOAD_FOLDER)
            producer_tokenise = Producer(config.tok_topic, config.bootstrap_server) 
            producer_tokenise.producer_fn(file_value_response.status_code)
            print("producer flushed")
            
    except Exception as e:
        print("error 1",e)