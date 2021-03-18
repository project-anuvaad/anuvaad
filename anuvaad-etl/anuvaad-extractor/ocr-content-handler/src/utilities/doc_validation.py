from anuvaad_auditor.errorhandler import post_error

class ObjectValidation:

    @staticmethod
    def update_word_validation(word):
        
        obj_keys={'record_id','region_id','word_id','updated_word'}
        word_keys=word.keys()
        if not all(item in word_keys for item in obj_keys):
            return post_error("Data Missing","record_id,region_id,word_id,updated_word are mandatory for updating the word",None)
        if not word['record_id'] or not word['region_id'] or not word['word_id'] or not word['updated_word']:
            return post_error("Data Missing","record_id,region_id,word_id,updated_word are mandatory for updating the word",None)


        
        