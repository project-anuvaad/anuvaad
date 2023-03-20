from utilities import MODULE_CONTEXT
from db import get_db
from utilities import OrgUtils
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
from config import USR_ORG_MONGO_COLLECTION
import time


class UserOrganizationModel(object):

    def __init__(self):
        pass

    def create_organizations(self,orgs):
        """Org upsertion
        
        active = True , org is activated
        active = False, org is deactivated.
        """
        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_ORG_MONGO_COLLECTION]
            active_orgs=[]
            deactive_orgs=[]
            for org in orgs:
                org_data = {}
                code=str(org["code"]).upper()
                org_data['active'] = org["active"]
                if org_data["active"] == True:
                    org_id =OrgUtils.generate_org_id()
                    org_data['orgID'] = org_id
                    org_data["activated_time"]=eval(str(time.time()))
                    if "description" in org.keys() and org["description"]:
                        org_data['description'] = org["description"]   
                    #activating org            
                    collections.update({'code': code},{'$set': org_data},upsert=True)
                    log_info("Activation request for org processed", MODULE_CONTEXT)
                    active_orgs.append(code)
                else:
                    #deactivating org
                    collections.update({'code': code},{'$set': {'active':False,"deactivated_time":eval(str(time.time()))}},upsert=True)
                    log_info("Deactivation request for org processed", MODULE_CONTEXT)
                    deactive_orgs.append(code)    
            return({'Activated':active_orgs,'Deactivated':deactive_orgs})     
        except Exception as e:
            log_exception("Database connection exception " + str(e),  MODULE_CONTEXT, e)
            return post_error("Database  exception", "An error occurred while processing on the db :{}".format(str(e)), None)


    def get_orgs_by_keys(self,org_code):
        
        #keys to exclude from search result
        exclude = {"_id":False}
        try:
            #connecting to mongo instance/collection
            collections = get_db()[USR_ORG_MONGO_COLLECTION]
            if org_code== None :
                #searching for all records
                out = collections.find({"active":True},exclude).sort([("_id",-1)])
            else:
                out = collections.find({"code":str(org_code).upper()}, exclude)
            result = []
            for record in out:
                result.append(record)
            if not result:
                return None
            return result

        except Exception as e:
            log_exception("db connection exception ",  MODULE_CONTEXT, e)
            return post_error("Database connection exception", "An error occurred while connecting to the database:{}".format(str(e)), None)

   