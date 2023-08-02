from models import UserManagementModel

userModel   =   UserManagementModel()

class UserManagementRepositories:
    
    def create_users(self,users):
        result = userModel.create_users(users)
        if result is not None:
            return result

    def update_users(self,users):
        result = userModel.update_users_by_uid(users)
        if result is not None:
            return result
        else:
            return True

    def search_users(self,user_ids, user_names, role_codes,org_codes,offset,limit_value,skip_pagination):
        result = userModel.get_user_by_keys(
            user_ids, user_names, role_codes,org_codes,offset,limit_value,skip_pagination)
        if result is not None:
            return result

    def onboard_users(self,users):
        result = userModel.onboard_users(users)
        if result is not None:
            return result

    def get_roles(self):
        result = userModel.get_roles_from_role_sheet()
        if result is not None:
            return result
    
    def change_email(self, username, email):
        result = userModel.change_email(username, email)
        if result is not None:
            return result
        
    def get_active_users(self):
        result = userModel.get_active_users()
        if result is not None:
            return result
