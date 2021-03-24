from anuvaad_auditor.errorhandler import post_error

class ObjectValidation:

    @staticmethod
    def update_word_validation(word):
        
        obj_keys={'record_id','region_id','word_id','updated_word','page_no'}
        word_keys=word.keys()
        if not all(item in word_keys for item in obj_keys):
            return post_error("Data Missing","record_id,region_id,word_id,updated_word are mandatory for updating the word",None)
        if not word['record_id'] or not word['region_id'] or not word['word_id'] or not word['updated_word'] or not word['page_no']:
            return post_error("Data Missing","record_id,region_id,word_id,updated_word are mandatory for updating the word",None)

    # @staticmethod
    # def page_validation(page):

    #     obj_keys={'regions','page_no','identifier','boundingBox'}
    #     word_keys=page.keys()
    #     if not all(item in word_keys for item in obj_keys):
    #         print("yessssssssssss")
    #         return post_error("Data Missing","regions,page_no,identifier,boundingBox are required in page data",None)
    #     if page['regions']:
    #         print("yesreg")
    #     if page['page_no']:
    #         print("yespgno")
    #     if page['identifier']:
    #         print("yespid")
    #     if page['boundingBox']:
    #         print("yespbox")
    #     if not page['regions'] or not page['page_no'] or not page['identifier'] or not page['boundingBox']:
    #         print("yeSSSSSSSSSSSSSSSSSSSSSSSS")
    #         return post_error("Data Missing","regions,page_no,identifier,boundingBox are required in page data",None)


        
        