from kafka_module.kf_service import process_tokenization_kf
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
import routes
import config
import threading

tok_app  = Flask(__name__)


def start_kafka():
    try:
        t1 = threading.Thread(target=process_tokenization_kf, name='keep_on_running')
        t1.start()
        log_info("multithread : Kafka running on multithread", None)
    except Exception as e:
        log_error("multithread : Error while running custom threads" + str(e), None, e)

if config.ENABLE_CORS:
    cors    = CORS(tok_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        tok_app.register_blueprint(blueprint, url_prefix=config.context_path)


if __name__ == "__main__":
    start_kafka()
    tok_app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
    
