from flask import jsonify


class RestAPIError(Exception):
    def __init__(self, status_code=500, payload=None):
        self.status_code = status_code
        self.payload = payload

    def to_response(self):
        return jsonify({'error': self.payload}), self.status_code


class BadRequestError(RestAPIError):
    def __init__(self, payload=None):
        super().__init__(400, payload)


class InternalServerErrorError(RestAPIError):
    def __init__(self, payload=None):
        super().__init__(500, payload)


class FormatError(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message
    
    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __str__(self):
        return self.__class__.__name__ + ': ' + self.message

class WorkflowkeyError(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message
    
    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __str__(self):
        return self.__class__.__name__ + ': ' + self.message


class FileErrors(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message
    
    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __repr__(self):
        return { "code" : self.code, "message" : self.__class__.__name__ + ': ' + self.message }

class FileEncodingError(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message
    
    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __str__(self):
        return self.__class__.__name__ + ': ' + self.message

class ServiceError(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message
    
    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __str__(self):
        return self.__class__.__name__ + ': ' + self.message

class KafkaConsumerError(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message
    
    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __str__(self):
        return self.__class__.__name__ + ': ' + self.message

class KafkaProducerError(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message
    
    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __repr__(self):
        return { "code" : self.code, "message" : self.__class__.__name__ + ': ' + self.message }