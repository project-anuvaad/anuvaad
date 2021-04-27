from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import csv
import uuid

class ParseCSV (object):
    def __init__(self):
        pass

    def get_parallel_sentences(filename, source_language, target_language, skip_header=True):
        parallel_sentences = []
        log_info("parsing parallel sentence from file %s" % (filename), LOG_WITHOUT_CONTEXT)

        with open(filename) as csv_file:
            reader           = csv.reader(csv_file, delimiter=',')
            rows             = []
            
            for row in reader:
                rows.append(row)
            
            if skip_header == True:
                rows = rows[1:]
            
            if len(rows)==0:
                log_info("no sentences found on %s" % (filename), LOG_WITHOUT_CONTEXT)
                return []

            
            for row in rows:
                source_sentence  = {}
                target_sentence  = {}
                source_sentence['language'] = source_language
                source_sentence['id']       = str(uuid.uuid4())
                source_sentence['text']     = row[0]
                
                target_sentence['language'] = target_language
                target_sentence['id']       = str(uuid.uuid4())
                target_sentence['text']     = row[1]
                
                parallel_sentences.append({
                    'annotationId': str(uuid.uuid4()),
                    'source': source_sentence,
                    'target': target_sentence
                })
        return parallel_sentences
    