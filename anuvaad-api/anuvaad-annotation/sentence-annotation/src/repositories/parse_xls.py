from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import xlrd
import uuid

class ParseXLS (object):
    def __init__(self):
        pass

    def get_parallel_sentences(filename, source_language, target_language, skip_header=True):
        parallel_sentences = []
        print('XLS')
        try:
            wb               = xlrd.open_workbook(filename)
            sheet            = wb.sheet_by_index(0)
            
            num_rows         = sheet.nrows
            source_sentence  = {}
            target_sentence  = {}
            rows             = []
            
            for row_index in range(num_rows):
                rows.append(sheet.row_values(row_index))
            
            if skip_header == True:
                rows = rows[1:]
            
            for row in rows:    
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
        except Exception as e:
            log_exception("Exception at  ", LOG_WITHOUT_CONTEXT, e)
            return []
        
        return parallel_sentences
