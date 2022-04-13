from flask import Blueprint
from flask_restful import Api
from resources import CreateUsers, UpdateUsers, SearchUsers,OnboardUsers, Health, ActivateDeactivateUser
from resources import UserLogin, UserLogout, AuthTokenSearch, ForgotPassword, ResetPassword , VerifyUser, SearchRoles


USER_MANAGEMENT_BLUEPRINT = Blueprint("user-management", __name__)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    CreateUsers, "/v1/users/create"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    UpdateUsers, "/v1/users/update"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    SearchUsers, "/v1/users/search"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    UserLogin, "/v1/users/login"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    UserLogout, "/v1/users/logout"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    AuthTokenSearch, "/v1/users/auth-token-search"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    ForgotPassword, "/v1/users/forgot-password"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    ResetPassword, "/v1/users/reset-password"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    VerifyUser,"/v1/users/verify-user"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    ActivateDeactivateUser,"/v1/users/activate-user"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    OnboardUsers,"/v1/users/onboard-users"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    SearchRoles,"/v1/users/get-roles"
)

Api(USER_MANAGEMENT_BLUEPRINT).add_resource(
    Health, "/health"
)