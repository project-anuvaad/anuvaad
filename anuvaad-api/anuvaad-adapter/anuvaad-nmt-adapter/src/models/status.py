import enum


class Status(enum.Enum):
    
    SUCCESS = { "statusCode": 200 , "message": "Requested operation successful" }
    LANGUAGE_MISSING = {"statusCode": 404 , "message": "No language found in the request" }
    MANDATORY_PARAM_MISSING = {"statusCode": 401 , "message": "missing mandatory input parameters: src or tgt" }
    TYPE_OR_LANGUAGE_MISSING = {  "statusCode": 404 , "message": "either type or language missing in form data" }
    SYSTEM_ERR = {"statusCode": 500 , "message": "Something went wrong on the server !" }
    UNSUPPORTED_LANGUAGE = {"statusCode": 401 , "message": "only hindi and english languages are supported" }
    INVALID_API_REQUEST = {"statusCode": 401 , "message": "invalid api request,either incorrect format or empty request"}
    INCOMPLETE_API_REQUEST = {"statusCode": 401 , "message": "Mandatory input parameters missing" }