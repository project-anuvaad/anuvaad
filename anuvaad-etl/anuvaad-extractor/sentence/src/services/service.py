from src.repositories.eng_sentence_tokeniser import AnuvaadEngTokenizer
from src.repositories.hin_sentence_tokeniser import AnuvaadHinTokenizer
import logging

log = logging.getLogger('file')

class Tokenisation(object):
    def __init__(self):
        pass       

    def eng_tokenisation(self,data, output_filepath):
        write_file = open(output_filepath, 'w', encoding='utf-16')
        for item in data:
            sentence_data = AnuvaadEngTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()
        log.info("File write for english tokenised sentence completed")

    def hin_tokenisation(self, data, output_filepath):
        write_file = open(output_filepath, 'w', encoding='utf-16')
        for item in data:
            sentence_data = AnuvaadHinTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()
        log.info("file write for hindi tokenised sentences completed")
