from src.repositories.eng_sentence_tokeniser import AnuvaadEngTokenizer
from src.repositories.hin_sentence_tokeniser import AnuvaadHinTokenizer
from src.kafka.producer import Producer
from src.kafka.consumer import Consumer
from src.utilities.utils import FileOperation
import config

file_ops = FileOperation()

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

    def hin_tokenisation(self, data, output_filepath):
        write_file = open(output_filepath, 'w')
        for item in data:
            sentence_data = AnuvaadHinTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()

def process_tokenization_kf():
    DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
    output_filepath = file_ops.output_path(DOWNLOAD_FOLDER)
    tokenisation = Tokenisation()
    # print("getting data from producer")
    consumer = Consumer(config.sen_topic, config.bootstrap_server)
    consumer = consumer.consumer_instantiate() #Consumer
    # print("consumer running",consumer)
    try:
        for msg in consumer:
            data = msg.value
            # print("consumer data received",data)
            in_filepath  = data['filepath']
            input_filepath = file_ops.input_path(in_filepath)
            input_file_data = file_ops.read_file(input_filepath)
            tokenisation.eng_tokenisation(input_file_data, output_filepath)
            out_file_type, out_locale, jobid = data['type'], data['locale'], data['jobID']
            producer_feed_data = file_ops.producer_input(output_filepath, out_file_type, out_locale, jobid)
            producer_tokenise = Producer(config.tok_topic, config.bootstrap_server) 
            producer_tokenise.producer_fn(producer_feed_data)
    except Exception as e:
        print("error",e)