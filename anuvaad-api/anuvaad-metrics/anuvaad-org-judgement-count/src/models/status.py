import enum


class Status(enum.Enum):
    
    SUCCESS = {'ok': True, 'status': 200,'why': "Request successful"}
    ACCEPTED = {'ok': True, 'status': 202,'why': "Request successful"}
    MANDATORY_PARAM_MISSING = { "ok": "false", "status": 401 , "why": "missing mandatory input parameters: src_phrases or tgt","message": "missing mandatory input parameters: src_phrases or tgt" }
    SYSTEM_ERR = { "ok": "false",  "status": 500 , "why": "Something went wrong on the server !","message": "Something went wrong on the server !" }
    SEVER_MODEL_ERR = { "ok": "false",  "status": 500 , "why": "Something went wrong on the server !","message": "Something went wrong on the server !" }