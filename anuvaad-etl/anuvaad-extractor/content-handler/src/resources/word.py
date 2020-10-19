from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import WordRepo
from models import CustomResponse, Status, GoogleTranslate
from utilities import AppContext
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request

wordRepo    = WordRepo()
translate   = GoogleTranslate()

class WordSaveResource(Resource):
    def post(self):
        body        = request.json

        log_info('received request for WordSaveResource', AppContext.getContext())
        if 'words' not in body:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        result = wordRepo.store(body['words'])
        if result == False:
            res = CustomResponse(Status.ERR_SCHEMA_VALIDATION.value, None)
            return res.getresjson(), 400
        
        res = CustomResponse(Status.SUCCESS.value, None)
        return res.getres()


class WordSearch(Resource):
    def post(self):
        body        = request.json

        log_info('received request for WordSearch', AppContext.getContext())
        if 'word' not in body or 'word_locale' not in body or 'target_locale' not in body:
            res = CustomResponse(Status.ERR_GLOBAL_MISSING_PARAMETERS.value, None)
            return res.getresjson(), 400

        if (body['word_locale'] == 'en') or (body['target_locale'] == 'en'):
            result = None
            if body['word_locale'] == 'en':
                result = wordRepo.search_english(body['word'])
            else:
                result = wordRepo.search_vernacular(body['word'], body['target_locale'])

            if result == None:
                '''
                    - call google apis to get the translation
                    - save the translation
                    - return the response
                '''
                log_info('checking google for the searched word ({})'.format(body['word']), AppContext.getContext())

                input_word, translated_word, input_locale = translate.translate_text(body['target_locale'], body['word'])
                if translated_word == None:
                    res = CustomResponse(Status.SUCCESS.value, None)
                    return res.getres()
                else:
                    if body['word_locale'] == 'en':
                        result = wordRepo.update(body['word'], 'en', translated_word, body['target_locale'])
                    else:
                        result = wordRepo.update(translated_word, body['target_locale'], body['word'], body['word_locale'])

                    if result == None:
                        res = CustomResponse(Status.SUCCESS.value, None)
                        return res.getres()
                    else:
                        res = CustomResponse(Status.SUCCESS.value, result)
                        return res.getres()
            else:
                log_info('returning word search from local database', AppContext.getContext())
                res = CustomResponse(Status.SUCCESS.value, result)
                return res.getres()
        else:
            res = CustomResponse(Status.ERR_ENGLISH_MANDATORY.value, None)
            return res.getresjson(), 400
