import enum


class Status(enum.Enum):

    SUCCESS = {'ok': True, 'http': {'status': 200},
               'why': "Request successful"}
    FAILURE_GLOBAL_SYSTEM = {'ok': False, 'http': {'status': 500},
                             'why': 'Request failed,Internal Server Error'}

    SUCCESS_USR_CREATION = {'ok': True, 'http': {'status': 200},
                            'why': "New users were created successfully"}
    
    SUCCESS_USR_UPDATION = {'ok': True, 'http': {'status': 200},
                            'why': "users were updated successfully"}
    
    SUCCESS_USR_SEARCH = {'ok': True, 'http': {'status': 200},
                          'why': "users were searched successfully"}
    SUCCESS_ORG_SEARCH = {'ok': True, 'http': {'status': 200},
                          'why': "organizations were searched successfully"}
    SUCCESS_ROLE_SEARCH = {'ok': True, 'http': {'status': 200},
                          'why': "roles were searched successfully"}
    EMPTY_USR_SEARCH = {'ok': True, 'http': {'status': 200},
                          'why': "No such users"}
    EMPTY_ORG_SEARCH = {'ok': True, 'http': {'status': 200},
                          'why': "No such organizations"}

    SUCCESS_USR_LOGIN = {'ok': True, 'http': {'status': 200},
                         'why': "Logged in successfully"}
    FAILURE_USR_LOGIN = {'ok': False, 'http': {'status': 400},
                         'why': "On input errors causing failure in user login"}

    SUCCESS_USR_LOGOUT = {'ok': True, 'http': {'status': 200},
                          'why': "Logged out successfully"}
    FAILURE_USR_LOGOUT = {'ok': False, 'http': {'status': 400},
                          'why': "On input errors causing failure in user logout"}

    SUCCESS_USR_TOKEN = {'ok': True, 'http': {'status': 200},
                         'why': "Search is successful"}
    FAILURE_USR_TOKEN = {'ok': False, 'http': {'status': 400},
                         'why': "On input errors causing failure in user search"}

    SUCCESS_FORGOT_PWD = {'ok': True, 'http': {'status': 200},
                            'why': "User is notified successfully"}
   
    SUCCESS_RESET_PWD = {'ok': True, 'http': {'status': 200},
                            'why': "Password has resetted successfully"}
    FAILURE_RESET_PWD  = {'ok': False, 'http': {'status': 400},
                         'why': "On input errors causing failure in password resetting"}
    
    SUCCESS_ACTIVATE_USR = {'ok': True, 'http': {'status': 200},
                            'why': "User has verified/activated successfully"}
    FAILURE_ACTIVATE_USR  = {'ok':False, 'http': {'status': 400},
                         'why': "On input errors causing failure in user activation"}
    
    SUCCESS_USR_ONBOARD = {'ok': True, 'http': {'status': 200},
                            'why': "New users were onboarded successfully"}
    SUCCESS_ORG_UPSERTION = {'ok': True, 'http': {'status': 200},
                            'why': "Request Successful"}
    SUCCESS_ORG_DEACTIVATE = {'ok': True, 'http': {'status': 200},
                            'why': "Organization has deactivated successfully"}

    ERR_GLOBAL_SYSTEM = {'ok': False, 'http': {
        'status': 500}, 'why': "Internal Server Error"}
    ERR_GLOBAL_MISSING_PARAMETERS = {
        'ok': False, 'http': {'status': 400}, 'why': "Data Missing"}
    SUCCESS_CHANGE_EMAIL = {'ok': True, 'http': {'status': 200},
                          'why': "email change suceess"}
    SUCCESS_ACTIVE_USERS = {'ok': True, 'http': {'status': 200},
                          'why': "successfull fetch active users count"}

    SUCCESS_USER_RESPONSE_PAGE = {'ok':True, 'http': {'status': 200},
                                    'why': "User Registered for document successfully"}
    
    # MFA APIs Statuses
    SUCCESS_MFA_REGISTER = {
        'ok': True,
        'http': {'status': 200},
        'why': "MFA registerd successfully"
    }
    SUCCESS_MFA_VERIFY = {
        'ok': True,
        'http': {'status': 200},
        'why': "OTP for MFA verified successfully"
    }
    SUCCESS_MFA_RESET = {
        'ok': True,
        'http': {'status': 200},
        'why': "MFA reset successfull."
    }
    