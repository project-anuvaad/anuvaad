from models.extension import ExtensionModel

exModel   =   ExtensionModel()

class ExtensionRepositories:
    
    def register_request(self,request_id):
        result = exModel.register_request(request_id)
        return result