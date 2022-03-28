from app import ocrapp
import config

if __name__ == "__main__":
    ocrapp.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
