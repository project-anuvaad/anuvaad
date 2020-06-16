from src.repositories.eng_sentence_tokeniser import AnuvaadEngTokenizer
from src.repositories.hin_sentence_tokeniser import AnuvaadHinTokenizer
import logging

logging.basicConfig(filename='tokenisation_logs.log', level=logging.INFO)

class Tokenisation(object):
    def __init__(self):
        pass       

    def eng_tokenisation(self,data, output_filepath):
        write_file = open(output_filepath, 'w')
        for item in data:
            sentence_data = AnuvaadEngTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()
        logging.info("File write for english tokenised sentence completed")

    def hin_tokenisation(self, data, output_filepath):
        write_file = open(output_filepath, 'w')
        for item in data:
            sentence_data = AnuvaadHinTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()
        logging.info("file write for hindi tokenised sentences completed")
