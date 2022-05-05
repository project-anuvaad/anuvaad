from flask_restful import fields, marshal_with, reqparse, Resource
from repositories import UserOrganizationRepositories
from models import CustomResponse, Status
from utilities import OrgUtils, MODULE_CONTEXT
import ast
from anuvaad_auditor.loghandler import log_info, log_exception
from flask import request
from flask import jsonify
from anuvaad_auditor.errorhandler import post_error
import config

orgRepo = UserOrganizationRepositories()

class CreateOrganization(Resource):

    def post(self):
        body = request.get_json()
        if 'organizations' not in body or not body['organizations']:
            return post_error("Data Missing", "organizations not found", None), 400

        organizations = body['organizations']
        log_info("Request recieved for {} organization/s creation".format(len(organizations)), MODULE_CONTEXT)
        orgcodes=[]
        log_info("Validating org creation request", MODULE_CONTEXT)
        for i,org in enumerate(organizations):
            validity = OrgUtils.validate_org_upsert(i,org)
            if validity is not None:
                log_info("Org validation failed for org{}".format(i+1), MODULE_CONTEXT)
                return validity, 400
            log_info("Org validation successful", MODULE_CONTEXT)
            orgcodes.append(str(org["code"]).upper())
        if (len(organizations) != len(set(orgcodes))):
            log_info("Duplicate entries found on org creation request", MODULE_CONTEXT)
            return post_error("Duplicate org code","Org codes should be unique",None), 400
        try:
            result = orgRepo.create_organizations(organizations)
            log_info("Org creation result:{}".format(result), MODULE_CONTEXT)
            if result is not None and len(result.keys())==2:
                res = CustomResponse(Status.SUCCESS_ORG_UPSERTION.value, result)
                return res.getresjson(), 200
            else:
                return result, 400
        except Exception as e:
            log_exception("Exception while creating organization records: " +
                          str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing organization creation:{}".format(str(e)), None), 400


class SearchOrganization(Resource):

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('org_code', type=str, location='args', help='organization code to be searched', required=False)
        args    = parser.parse_args()
        org_code=args["org_code"]
        log_info("Request received for org search", MODULE_CONTEXT)
        try:
            result = orgRepo.search_organizations(org_code)
            if result == None:
                log_info("Org search returned empty result", MODULE_CONTEXT)
                res = CustomResponse(
                    Status.EMPTY_ORG_SEARCH.value, None)
                return res.getresjson(), 200
            log_info("Org search successful", MODULE_CONTEXT)
            res = CustomResponse(Status.SUCCESS_ORG_SEARCH.value, result)
            return res.getresjson(), 200
        except Exception as e:
            log_exception("Exception while searching org records: " +
                          str(e), MODULE_CONTEXT, e)
            return post_error("Exception occurred", "Exception while performing org search::{}".format(str(e)), None), 400




