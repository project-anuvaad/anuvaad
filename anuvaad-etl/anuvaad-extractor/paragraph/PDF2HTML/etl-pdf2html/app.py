from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from kafka_module.kf_services import process_pdf_kf
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import routes
import config
import threading

pdf2html_app  = Flask(__name__)

def start_kafka():
    try:
        t1 = threading.Thread(target=process_pdf_kf, name='keep_on_running')
        t1.start()
        log_info("multithread", "Kafka running on multithread", None)
    except Exception as e:
        log_error("threading", "ERROR WHILE RUNNING CUSTOM THREADS ", None, e)

if config.ENABLE_CORS:
    cors    = CORS(pdf2html_app, resources={r"/api/*": {"origins": "*"}})

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        pdf2html_app.register_blueprint(blueprint, url_prefix=config.API_URL_PREFIX)

if __name__ == "__main__":
    start_kafka()
    pdf2html_app.run(host=config.HOST, port=config.PORT, debug=True)
