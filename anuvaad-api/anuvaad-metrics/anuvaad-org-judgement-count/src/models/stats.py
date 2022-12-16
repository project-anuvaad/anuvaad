import config
from db.database import connectmongo
from datetime import datetime
import os
import pandas as pd
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error

from utilities import MODULE_CONTEXT


class jud_stats(object):

    def mongo_connection(self):
        mongo_connection = connectmongo()
        usr_collection = mongo_connection[config.USER_DB][config.USER_COLLECTION]
        ch_collection = mongo_connection[config.PREPROCESSING_DB][config.FILE_CONTENT_COLLECTION]
        return usr_collection,ch_collection

    def fetch_data_machine_trans_tokenised(self,ch_collection,user,from_date,end_date):
        ch_docs       = ch_collection.aggregate([{ '$match':  {'$and': [{"created_by": user,"created_on":{"$gte":from_date,"$lte":end_date}}, {'data_type':'text_blocks'}]} },
                                { '$unwind': "$data.tokenized_sentences" },
                                    { "$group": {
                                    "_id": "$job_id",
                                    "doc_sent_count": { "$sum": 1 },
                                        "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"}}}])
        return ch_docs

    def fetch_data_user_trans_tokenized(self,ch_collection,user,from_date,end_date):
        saved_docs       = ch_collection.aggregate([{ '$match': {'$and': [{"created_by": user,"created_on":{"$gte":from_date,"$lte":end_date}}, {'data_type':'text_blocks'}]} },
                                            { '$unwind': "$data.tokenized_sentences" },
                                            { '$match': {"data.tokenized_sentences.save":True}},
                                            { "$group": {
                                                "_id": "$job_id",
                                                "saved_sent_count": { "$sum": 1 },
                                                "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"},
                                                "avg_sent_bleu_score":{"$avg": "$data.tokenized_sentences.bleu_score"}}}])
        return saved_docs

    def fetch_data_for_userwise_trans_tokenized(self,ch_collection,doc,from_date,end_date):
        ch_docs       = ch_collection.aggregate([{ '$match': {'$and': [{"created_by": str(doc['userID']),"created_on":{"$gte":from_date,"$lte":end_date}}, {'data_type':'text_blocks'}]} },
                            { '$unwind': "$data.tokenized_sentences" },
                             { "$group": {
                                "_id": "$job_id",
                                "created_on":{"$first":"$created_on"},
                                "src_lang":{"$first":"$src_lang"},
                                "tgt_lang":{"$first":"$tgt_lang"},
                                "doc_sent_count": { "$sum": 1 },
                                # "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"}
                                }},
                               {"$addFields":{"orgID":str(doc.get('orgID')),
                                "userName":str(doc['userName']),
                                "name":str(doc['name']),
                                "is_active":str(doc['is_active']),
                                "userId":str(doc['userID'])
                                }}])

        return ch_docs

    def fetch_data_for_language_trans_tokenized_for_scheduer_only(self,ch_collection,doc,from_date,end_date):
        ch_docs       = ch_collection.aggregate([{ '$match': {'$and': [{"created_by": str(doc['userID']),"created_on":{"$gte":from_date,"$lte":end_date}}, {'data_type':'text_blocks'}]} },
                            { '$unwind': "$data.tokenized_sentences" },
                             { "$group": {
                                "_id": "$job_id",
                                "created_on":{"$first":"$created_on"},
                                "src_lang":{"$first":"$src_lang"},
                                "tgt_lang":{"$first":"$tgt_lang"},
                                "doc_sent_count": { "$sum": 1 },
                                "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"}
                                }},
                               {"$addFields":{"orgID":str(doc.get('orgID')),
                                "userName":str(doc['userName']),
                                "name":str(doc['name']),
                                "is_active":str(doc['is_active']),
                                "userId":str(doc['userID'])
                                }}])
        return ch_docs

    def fetch_data_for_userwise_trans_user_tokenized(self,ch_collection,doc,from_date,end_date):
        saved_docs       = ch_collection.aggregate([{ '$match': {'$and': [{"created_by": str(doc['userID']),"created_on":{"$gte":from_date,"$lte":end_date}}, {'data_type':'text_blocks'}]} },
                            { '$unwind': "$data.tokenized_sentences" },
                            { '$match': {"data.tokenized_sentences.save":True}},
                             { "$group": {
                                "_id": "$job_id",
                                "created_on":{"$first":"$created_on"},
                                "src_lang":{"$first":"$src_lang"},
                                "tgt_lang":{"$first":"$tgt_lang"},
                                # "doc_sent_count": { "$sum": 1 },
                                "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"},
                                "avg_sent_bleu_score":{"$avg": "$data.tokenized_sentences.bleu_score"},
                                "saved_sent_count": { "$sum": 1 }}},
                                {"$addFields":{"orgID":str(doc.get('orgID')),
                                "userName":str(doc['userName']),
                                "name":str(doc['name']),
                                "is_active":str(doc['is_active']),
                                "userId":str(doc['userID']),
                                }}])

        return saved_docs

    def get_user_role_org_wise(self,usr_collection,role,org):
        user_docs=  usr_collection.aggregate([{'$match': {"is_active" : True,"roles.roleCode":role,'orgID':org}},{ "$group":{"_id": "$orgID",'users':{ "$addToSet": '$userID' }}}])
        return user_docs

    def get_user_role_wise(self,usr_collection,role):
        user_docs = usr_collection.aggregate([{'$match': {"is_active" : True,"roles.roleCode":role,}},{ "$group":{"_id": "$orgID",'users':{ "$addToSet": '$userID' }}}])
        return user_docs

    def get_user_translator_wise(self,usr_collection):
        user_docs = usr_collection.aggregate([{'$match': {"is_active" : True,"roles.roleCode":"TRANSLATOR",}},{ "$group":{"_id": "$orgID",'users':{ "$addToSet": '$userID' }}}])
        return user_docs

    def get_all_users_active_inactive(self,usr_collection):
        user_docs = usr_collection.find({"is_active":{"$in":[True,False]}},{"userID":1,"name":1,"userName":1,"orgID":1,"is_active":1,"_id":0})
        return user_docs

    def get_time_frame(self,body):
        if body.get('start_date') and body.get("end_date"):
            from_date = datetime.strptime(body['start_date'], '%Y-%m-%d')
            end_date = datetime.strptime(body['end_date'], '%Y-%m-%d')
        else:
            from_date = datetime.strptime("2000-01-01", '%Y-%m-%d')
            now = datetime.now()
            date_time = now.strftime("%Y-%m-%d")
            end_date  = datetime.strptime(str(date_time),'%Y-%m-%d')
        return from_date,end_date

    def get_time_frame_for_analytics(self):
        from_date = datetime.strptime("2000-01-01", '%Y-%m-%d')
        now = datetime.now()
        date_time = now.strftime("%Y-%m-%d")
        end_date  = datetime.strptime(str(date_time),'%Y-%m-%d')
        return from_date,end_date

    def file_validation(self):
        file_name1 = 'language_wise_JUD_STATS1.csv'
        file_name1=os.path.join(config.DOWNLOAD_FOLDER,file_name1)
        file_name2 = 'language_wise_JUD_STATS2.csv'
        file_name2=os.path.join(config.DOWNLOAD_FOLDER,file_name2)
        if not os.path.exists(file_name1) and os.path.exists(file_name2):
            print(False)
            return post_error("FILES_NOT_FOUND", "files are mandatory", None),False
        else:
            df = pd.read_csv(file_name1)
            df1 = pd.read_csv(file_name2)
            nan_value = float("NaN")
            df.replace("", nan_value, inplace=True)
            df.dropna(how='all', axis=1, inplace=True)
            df1.replace("", nan_value, inplace=True)
            df1.dropna(how='all', axis=1, inplace=True)
            result = df1.merge(df,indicator=True,how="right")
            result = result.sort_values(by=['orgID'], ascending=True)
            return result, True

