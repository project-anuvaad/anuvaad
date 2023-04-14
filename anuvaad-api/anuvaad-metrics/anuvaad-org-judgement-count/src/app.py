from flask_cors import CORS
from anuvaad_auditor.loghandler import log_info
from resources.db_retrival import app
from resources.scheduler_jobs import schedule_job
import config
from utilities import MODULE_CONTEXT

if config.ENABLE_CORS:
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

if __name__ == "__main__":
    log_info(
        "starting server at {} at port {}".format(config.HOST, config.PORT),
        MODULE_CONTEXT,
    )
    # schedule_job
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
