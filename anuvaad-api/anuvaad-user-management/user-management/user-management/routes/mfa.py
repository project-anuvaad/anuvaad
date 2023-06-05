from flask import Blueprint
from flask_restful import Api
from resources import RegisterMFA, VerifyMFA, ResetMFA


MFA_BLUEPRINT = Blueprint("mfa", __name__)

Api(MFA_BLUEPRINT).add_resource(
    RegisterMFA, "/v1/mfa/register"
)

Api(MFA_BLUEPRINT).add_resource(
    VerifyMFA, "/v1/mfa/verify"
)

Api(MFA_BLUEPRINT).add_resource(
    ResetMFA, "/v1/mfa/reset"
)