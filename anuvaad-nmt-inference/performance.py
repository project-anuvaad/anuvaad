import sys
sys.path.append("src")
import time
import math
import argparse
import services.document_translate as dt

parser = argparse.ArgumentParser()

parser.add_argument('--input_file', action='store', type=str, required=True, help='input english text file with one sentence per line')
parser.add_argument('--batch_size', action='store', type=int, required=True, default=25, help='batch size in which input is \
    fed into the translator')

args = parser.parse_args()


def read_txt_file(input_text_file):
    '''
    Reads in a file with one sentence in each line and
    returns a dict type input for anuvaad batch pipeline with keys 'id'
    and 'src_list'
    '''
    with open(input_text_file,'r') as f:
        input_text_array = f.readlines()
    input_text_array = [sent[:-1] for sent in input_text_array]
    input_for_translator = {'id': 56, 'src_list': input_text_array} 

    return input_for_translator

def split_input_into_batches(input_for_translator, batch_size):
    '''
    Given input for translation dictionary and a batch size,
    splits the input into list of batches
    '''
    input_batches = []
    input_text_array = input_for_translator['src_list']
    num_of_batch = len(input_text_array) // batch_size
    for i in range(num_of_batch + 1):
        prev_index = i * batch_size
        if (prev_index + batch_size) < len(input_text_array):
            input_batch = {'id': 56, 'src_list': input_text_array[prev_index: prev_index + batch_size]}
        else:
            input_batch = {'id': 56, 'src_list': input_text_array[prev_index: ]}
        input_batches.append(input_batch)
    
    return input_batches

def count_number_of_words(input_for_translator):
    '''
    Given an input for batch pipeline, counts the total number of words
    '''
    word_count = 0
    for sentence in input_for_translator['src_list']:
        word_count += len(sentence.split())

    return word_count

def find_performance(input_text_file):
    '''
    Given a file with one sentence in each line, finds
    the words/second performance of the batch translation pipeline
    '''
    input_for_translator = read_txt_file(args.input_file)
    batch_input_array = split_input_into_batches(input_for_translator, args.batch_size)   
    translator_pipeline = dt.NMTTranslateService()

    words_per_sec_array = []
    for batch_input in batch_input_array:
        start = time.time()
        _ = translator_pipeline.batch_translator(batch_input)
        time_taken = time.time() - start
        word_count = count_number_of_words(batch_input)
        words_per_sec_array.append(word_count/time_taken)
    
    avg_words_per_sec = sum(words_per_sec_array) / len(words_per_sec_array)

    return avg_words_per_sec

if __name__ == "__main__":
    print("Words per second: ", find_performance(args.input_file))