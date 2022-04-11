from models import UserOrganizationModel

orgModel = UserOrganizationModel()

class UserOrganizationRepositories:
    
    def create_organizations(self,orgs):
        result = orgModel.create_organizations(orgs)
        if result is not None:
            return result
    
    def search_organizations(self,org_code):
        result = orgModel.get_orgs_by_keys(org_code)
        if result is not None:
            return result
