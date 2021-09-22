import enum


class Status(enum.Enum):
    
    SUCCESS = { "ok": "true",  "statusCode": 200 , "why": "Requested operation successful","message":"Request successfully executed!" }
    FILE_MISSING = { "ok": "false", "statusCode": 404 , "why": "No file found" }
    TYPE_MISSING = { "ok": "false", "statusCode": 404 , "why": "No type found in the request" }
    ID_MISSING = { "ok": "false", "statusCode": 404 , "why": "No ID found in the request" }
    LANGUAGE_MISSING = { "ok": "false", "statusCode": 404 , "why": "No language found in the request" }
    MANDATORY_PARAM_MISSING = { "ok": "false", "statusCode": 401 , "why": "missing mandatory input parameters: src_phrases or tgt","message": "missing mandatory input parameters: src_phrases or tgt" }
    TYPE_OR_LANGUAGE_MISSING = { "ok": "false", "statusCode": 404 , "why": "either type or language missing in form data" }
    INVALID_TYPE = { "ok": "false",  "statusCode": 401 , "why": "Invalid file type of file to be downloaded/uploaded !" }
    SYSTEM_ERR = { "ok": "false",  "statusCode": 500 , "why": "Something went wrong on the server !","message": "Something went wrong on the server !" }
    SEVER_MODEL_ERR = { "ok": "false",  "statusCode": 500 , "why": "Something went wrong on the server !","message": "Something went wrong on the server !" }
    UNSUPPORTED_LANGUAGE = { "ok": "false",  "statusCode": 401 , "why": "only hindi and english languages are supported" }
    No_File_DB = { "ok": "false",  "statusCode": 401 , "why": "No data found for given id","message": "No data found for given id" }
    ID_OR_SRC_MISSING = { "ok": "false",  "statusCode": 401 , "why": "Either id or src missing for some inputs in the request","message": "Either id or src missing for some inputs in the request" }
    INCORRECT_ID = { "ok": "false",  "statusCode": 401 , "why": "wrong model id for some input","message": "wrong model id for some input" }
    INVALID_API_REQUEST = {"ok": "false",  "statusCode": 401 , "why": "invalid api request,either incorrect format or empty request","message": "invalid api request,either incorrect format or empty request"}
    KAFKA_INVALID_REQUEST = {"ok": "false",  "statusCode": 401 , "why": "Mandatory param missing from batch translation request","message": "Mandatory param(id,record id,message) missing from batch translation request"}
    INCOMPLETE_API_REQUEST = { "ok": "false",  "statusCode": 401 , "why": "Mandatory input parameters missing","message": "Mandatory input parameters missing" }