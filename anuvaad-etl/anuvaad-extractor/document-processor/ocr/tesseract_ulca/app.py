from src.controller.module import ocrapp
import config
from src.utilities.app_context import LOG_WITHOUT_CONTEXT


if __name__ == "__main__":
    # print(ocrapp.url_map)
    ocrapp.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
