from src.repositories.sentence_tokeniser import AnuvaadEngTokenizer
from src.kafka.producer import Producer
from src.kafka.consumer import Consumer
from src.utilities.utils import FileOperation
import config

class Tokenisation(object):
    def __init__(self):
        pass
    
    def producer_input(self, input_filepath, in_file_type, in_locale, jobid):
        producer_feed_data = {
            "filepath": input_filepath,
            "type": in_file_type,
            "locale": in_locale,
            "jobID": jobid
        }
        return producer_feed_data

    def tokenisation(self,data, output_filepath):
        write_file = open(output_filepath, 'w')
        for item in data:
            sentence_data = AnuvaadEngTokenizer().tokenize(item)
            for sentence in sentence_data:
                write_file.write("%s\n"%sentence)
        write_file.close()

def process_tokenization_kf():
    file_ops = FileOperation()
    DOWNLOAD_FOLDER =file_ops.file_download(config.download_folder)
    output_filepath = file_ops.output_path(DOWNLOAD_FOLDER)
    tokenisation = Tokenisation()
    consumer = Consumer(config.sen_topic, config.kf_group, config.bootstrap_server)
    consumer = consumer.consumer_instantiate() #Consumer
    try:
        for msg in consumer:
            data = msg.value
            print("consumer data received",data)
            in_filepath  = data['filepath']
            input_filepath = file_ops.input_path(in_filepath)
            input_file_data = file_ops.read_file(input_filepath)
            tokenisation.tokenisation(input_file_data, output_filepath)
            out_file_type, out_locale, jobid = data['type'], data['locale'], data['jobID']
            producer_feed_data = tokenisation.producer_input(output_filepath, out_file_type, out_locale, jobid)
            producer_tokenise = Producer(config.tok_topic, config.bootstrap_server) 
            producer_tokenise.producer_fn(producer_feed_data)
    except Exception as e:
        print("error",e)