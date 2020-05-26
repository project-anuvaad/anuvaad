from src.repositories.sentence_tokeniser import AnuvaadEngTokenizer

class Tokenisation(object):
    def __init__(self):
        pass
    
    def producer_input(self, input_file_data):
        producer_feed_data = {
            'paragraphs' : input_file_data
        }
        return producer_feed_data

    def tokenisation(self, data, output_filepath):
        write_file = open(output_filepath, 'w')
        for item in data['paragraphs']:
            sentence_data = AnuvaadEngTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()
        