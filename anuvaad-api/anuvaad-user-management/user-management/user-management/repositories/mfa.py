from models import MFAModel

mfaModel   =   MFAModel()

class MFARepositories:
        
    def register_mfa(self, username, mfa_type, email):
        result = mfaModel.register_mfa(username, mfa_type, email)
        if result is not None: 
            return result
        
    def generate_new_login(self, username,useHOTP):
        result = mfaModel.generate_new_login(username,useHOTP)
        if result is not None:
            return result
        
    def verify_session(self, username, auth_token):
        result = mfaModel.verify_session(username, auth_token)
        if result is not None:
            return result
    
    def verify_mfa(self, username, auth_otp,useHOTP):
        result = mfaModel.verify_mfa(username, auth_otp,useHOTP)
        if result is not None:
            return result
        
    def reset_mfa(self,user_name):
        result = mfaModel.reset_mfa(user_name)
        return result

    def check_mfa_registration(self, username):
        result = mfaModel.check_mfa_registration(username)
        if result is not None:
            return result
        
    def check_mfa_active(self, username, session_id):
        result = mfaModel.check_mfa_active(username, session_id)
        if result is not None:
            return result
    