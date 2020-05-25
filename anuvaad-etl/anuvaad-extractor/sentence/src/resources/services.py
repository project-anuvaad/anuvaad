from src.repositories.sentence_tokeniser import AnuvaadEngTokenizer
from src.kafka.consumer import Consumer

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

# class ConsumerRunning(Tokenisation):
#     def __init__(self):
#         super().__init__()        
#         pass

#     def consumer_running(self, output_filepath):
#         consumer_paragraph = Consumer('txt_paragraph', 'tokenisation', 'localhost:9092')
#         consumer_recieved_data = consumer_paragraph.consumer_fn()
#         msg_count = 0
#         try:
#             for msg in consumer_recieved_data:
#                 msg_count += 1
#                 data = msg.value
#                 Tokenisation().tokenisation(data, output_filepath)
#         except Exception as e:
#             print("error consumer run: ",e)