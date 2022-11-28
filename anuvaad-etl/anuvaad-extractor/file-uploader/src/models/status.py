"""
 * @author ['aroop']
 * @email ['aroop.ghosh@tarento.com']
 * @create date 2019-06-25 12:40:01
 * @modify date 2019-06-25 12:40:01
 * @desc [description]
 """

import enum


class Status(enum.Enum):
    SUCCESS = {'ok': True, 'http': {'status': 200},
               'why': "request successful"}
    ERR_GLOBAL_SYSTEM = {'ok': False, 'http': {
        'status': 500}, 'why': "Internal Server Error"}
    ERR_GLOBAL_MISSING_PARAMETERS = {
        'ok': False, 'http': {'status': 400}, 'why': "Data Missing"}
    FAILURE = {'ok': False,'http':{'status':500},
                'why':'request failed'}
    CORRUPT_FILE = {'ok': False,'http':{'status':500},
                'why':'uploaded file is corrupt'}
    DATA_NOT_FOUND = {'ok': False,'http':{'status':404},
                'why':'data not found'}
    OPERATION_NOT_PERMITTED = {'ok': False, 'http': {'status': 400},
                               'why': 'operation not permitted'}
    ERROR_WEAK_PASSWORD = {'ok': False, 'http': {'status': 400}, 'why': 'weak password, at least provide 6 characters '}
    ERROR_GATEWAY = {'ok': False, 'http': {'status': 400}, 'why': 'gateway error'}
    ERROR_UNSUPPORTED_FILE = {'ok': False, 'http': {'status': 400}, 'why': 'unsupported file'}
    ERROR_FILE_SIZE = {'ok': False, 'http': {'status': 413}, 'why': 'file size too big'}
    ERROR_NOTFOUND_FILE = {'ok': False, 'http': {'status': 400}, 'why': 'file not found'}
    ERROR_WRONG_PASSWORD = {'ok': False, 'http': {'status': 400}, 'why': 'wrong password '}
    USER_ALREADY_EXISTS = {'ok': False, 'http': {'status': 400}, 'why': 'username already exists '}
    FILE_BLANK_ERROR = {'ok': False, 'http': {'status': 400}, 'why': 'Blank File'}
    #
    ERROR_FILE_PAGE_BREAK = {'ok': False, 'http': {'status': 413}, 'why': 'Maximum page limit is 200'}