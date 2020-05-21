from src.repositories.sentence_tokeniser import AnuvaadEngTokenizer

class Tokenisation(object):
    def __init__(self):
        pass

    def tokenisation(self, data, output_filepath):
        write_file = open(output_filepath, 'w')
        for item in data['paragraphs']:
            sentence_data = AnuvaadEngTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()
        return "file write done"