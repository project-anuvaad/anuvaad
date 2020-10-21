from bravado_core.spec import Spec
from bravado_core.validate import validate_object
from yaml import load, Loader, dump, Dumper
import os

class APIContractSpecifications:
    def __init__(self):
        self.filepath   = os.path.join(os.path.dirname(os.path.abspath(__file__)), "content-handler-api-contract.yml")
        self.spec       = None
        self.spec_dict  = None

    def get_swagger_spec(self):
        with open(self.filepath, 'r') as spec:
            return load(spec.read(), Loader)
        return None

    def get_spec(self):
        bravado_config = {
                            'validate_swagger_spec': False,
                            'validate_requests': False,
                            'validate_responses': False,
                            'use_models': True,
                        }
        self.spec_dict   = self.get_swagger_spec()
        if self.spec_dict == None:
            return False

        self.spec  = Spec.from_dict(self.spec_dict, config=bravado_config)
        return True

    def validate(self, key, obj):
        key_object  = self.spec_dict['definitions'][key]
        return validate_object(self.spec, key_object, obj)


APIContract = APIContractSpecifications()
APIContract.get_spec()

