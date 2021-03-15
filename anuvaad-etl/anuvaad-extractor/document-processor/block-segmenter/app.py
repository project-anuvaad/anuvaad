import sys
sys.path.insert(0,"./src/utilities/yolov5/utils")


from src.kafka_module.kf_service import  block_segmenter_request_worker, process_block_segmenter_kf
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from src import routes
import config
import threading
from src.utilities.app_context import LOG_WITHOUT_CONTEXT


merge_app = Flask(__name__)



def start_kafka():
    try:
        t1 = threading.Thread(target=process_block_segmenter_kf, name='block-segmenter-consumer-thread')
        t1.start()
        log_info("multithread Kafka running on multithread", LOG_WITHOUT_CONTEXT)

        t2 = threading.Thread(target=block_segmenter_request_worker, name='block-segmenter-worker-thread')
        t2.start()
        log_info("Starting block_segmenter_request_worker", LOG_WITHOUT_CONTEXT)


    except Exception as e:
        log_error("threading ERROR WHILE RUNNING CUSTOM THREADS ", LOG_WITHOUT_CONTEXT, e)

if config.ENABLE_CORS:
    cors    = CORS(merge_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        merge_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)



if __name__ == "__main__":
    start_kafka()
    print(merge_app.url_map)
    merge_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
    

