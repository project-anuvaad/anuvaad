import uuid
from utilities import MODULE_CONTEXT
from config import USR_ORG_MONGO_COLLECTION, USR_MONGO_COLLECTION
from db import get_db
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error


class OrgUtils:

    def __init__(self):
        pass
    #orgId generation
    @staticmethod
    def generate_org_id():
        """UUID generation for org registeration"""
        return(uuid.uuid4().hex)


    @staticmethod
    def validate_org(org_code):
        """Validating Org

        Org should be registered and active on Anuvaad system.
        """

        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_ORG_MONGO_COLLECTION]
            #searching for active org record
            result = collections.find({"code": org_code}, {"_id": 0, "active": 1})
            if result.count() == 0:
                return post_error("Invalid Organization", "No such registered organization with the given Org Id", None)
            for value in result:
                if value["active"] == False:
                    return post_error("Invalid Organization", "Organization is currently inactive", None)
        except Exception as e:
            log_exception("db connection exception ",  MODULE_CONTEXT, e)
            return post_error("Database connection exception", "An error occurred while connecting to the database:{}".format(str(e)), None)


    @staticmethod
    def validate_org_upsert(i,org):
        """Org validation on upsert

        deactivation of org allowed only once all the users in the corresponding org is inactive.
        """

        if "code" not in org or not org["code"]:
            return post_error("Data Missing", "code not found", None)
        if "active" not in org:
            return post_error("Data Missing", "active not found", None)
        code = str(org["code"]).upper()
        active = org["active"]  
        if not isinstance(active,bool):
            return post_error("Invalid format", "active should be bool", None), 400
        if active == False:
            try:
                #connecting to mongo instance/collection
                collections = get_db()[USR_MONGO_COLLECTION]
                #searching for active users in the org
                result = collections.find({"orgID": code,"is_active":True})
                if result.count()!=0:
                    log_info("Deactivation request for org failed, {} active users with the orgID".format(str(result.count())), MODULE_CONTEXT)
                    return post_error("Deactivation Failed","There exist active users in {} hence this action cannot be performed".format(code),None)
            except Exception as e:
                log_exception("db connection exception ",  MODULE_CONTEXT, e)
                return post_error("Database connection exception", "An error occurred while connecting to the database:{}".format(str(e)), None)