import config
from db.database import connectmongo
from datetime import datetime
import os
import pandas as pd
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.errorhandler import post_error
from datetime import datetime as dt

from utilities import MODULE_CONTEXT


class jud_stats(object):
    def mongo_connection(self):
        mongo_connection = connectmongo()
        usr_collection = mongo_connection[config.USER_DB][config.USER_COLLECTION]
        ch_collection = mongo_connection[config.PREPROCESSING_DB][
            config.FILE_CONTENT_COLLECTION
        ]
        return usr_collection, ch_collection

    def mongo_wfm_connection(self):
        return connectmongo()[config.WFM_DB][config.WFM_COLLECTION]

    def fetch_data_machine_trans_tokenised(
        self, ch_collection, user, from_date, end_date
    ):
        ch_docs = ch_collection.aggregate(
            [
                {
                    "$match": {
                        "$and": [
                            {
                                "created_by": user,
                                "created_on": {"$gte": from_date, "$lte": end_date},
                            },
                            {"data_type": "text_blocks"},
                        ]
                    }
                },
                {"$unwind": "$data.tokenized_sentences"},
                {
                    "$group": {
                        "_id": "$job_id",
                        "doc_sent_count": {"$sum": 1},
                        "total_time_spent": {
                            "$sum": "$data.tokenized_sentences.time_spent_ms"
                        },
                    }
                },
            ]
        )
        return ch_docs

    def fetch_data_user_trans_tokenized(self, ch_collection, user, from_date, end_date):
        saved_docs = ch_collection.aggregate(
            [
                {
                    "$match": {
                        "$and": [
                            {
                                "created_by": user,
                                "created_on": {"$gte": from_date, "$lte": end_date},
                            },
                            {"data_type": "text_blocks"},
                        ]
                    }
                },
                {"$unwind": "$data.tokenized_sentences"},
                {"$match": {"data.tokenized_sentences.save": True}},
                {
                    "$group": {
                        "_id": "$job_id",
                        "saved_sent_count": {"$sum": 1},
                        "total_time_spent": {
                            "$sum": "$data.tokenized_sentences.time_spent_ms"
                        },
                        "avg_sent_bleu_score": {
                            "$avg": "$data.tokenized_sentences.bleu_score"
                        },
                    }
                },
            ]
        )
        return saved_docs

    def fetch_data_for_userwise_trans_tokenized(
        self, ch_collection, doc, from_date, end_date
    ):
        ch_docs = ch_collection.aggregate(
            [
                {
                    "$match": {
                        "$and": [
                            {
                                "created_by": str(doc["userID"]),
                                "created_on": {"$gte": from_date, "$lte": end_date},
                            },
                            {"data_type": "text_blocks"},
                        ]
                    }
                },
                {"$unwind": "$data.tokenized_sentences"},
                {
                    "$group": {
                        "_id": "$job_id",
                        "created_on": {"$first": "$created_on"},
                        "src_lang": {"$first": "$src_lang"},
                        "tgt_lang": {"$first": "$tgt_lang"},
                        "doc_sent_count": {"$sum": 1},
                        # "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"}
                    }
                },
                {
                    "$addFields": {
                        "orgID": str(doc.get("orgID")),
                        "userName": str(doc["userName"]),
                        "name": str(doc["name"]),
                        "is_active": str(doc["is_active"]),
                        "userId": str(doc["userID"]),
                    }
                },
            ]
        )

        return ch_docs

    def fetch_data_for_language_trans_tokenized_for_scheduer_only(
        self, ch_collection, from_date, end_date
    ):
        try:
            ch_docs = ch_collection.aggregate(
                [
                    {
                        "$match": 
                                {
                                    "data_type": "text_blocks",
                                    "created_on": {"$gte": from_date, "$lte": end_date},
                                 },    
                    },
                    {"$unwind": "$data.tokenized_sentences"},
                    {
                        "$group": {
                            "_id": "$job_id",
                            "created_on": {"$first": "$created_on"},
                            "created_by":{"$first":"$created_by"},
                            "src_lang": {"$first": "$src_lang"},
                            "tgt_lang": {"$first": "$tgt_lang"},
                            "doc_sent_count": {"$sum": 1},
                            "total_time_spent": {
                                "$sum": "$data.tokenized_sentences.time_spent_ms"
                            },
                        }
                    },
                ]
            )

        except Exception as e: 
            log_exception("error in fetching the data : {}".format(str(e)),MODULE_CONTEXT,e)

        return ch_docs

    def fetch_data_for_userwise_trans_user_tokenized(
        self, ch_collection, from_date, end_date
    ):
        try:
            saved_docs = ch_collection.aggregate(
                [
                    {
                        "$match": 
                                {
                                    "data_type": "text_blocks",
                                    "created_on": {"$gte": from_date, "$lte": end_date},
                                },
                    },
                    {"$unwind": "$data.tokenized_sentences"},
                    {"$match": {"data.tokenized_sentences.save": True}},
                    {
                        "$group": {
                            "_id": "$job_id",
                            "created_on": {"$first": "$created_on"},
                            "created_by":{"$first":"$created_by"},
                            "src_lang": {"$first": "$src_lang"},
                            "tgt_lang": {"$first": "$tgt_lang"},
                            # "doc_sent_count": { "$sum": 1 },
                            "total_time_spent": {
                                "$sum": "$data.tokenized_sentences.time_spent_ms"
                            },
                            "avg_sent_bleu_score": {
                                "$avg": "$data.tokenized_sentences.bleu_score"
                            },
                            "saved_sent_count": {"$sum": 1},
                        }
                    },
                ]
            )
        except Exception as e:
            log_exception(
        "error in fetching the data : {}".format(str(e)),
        MODULE_CONTEXT,
        e,
    )
        return saved_docs

    def get_user_role_org_wise(self, usr_collection, role, org):
        user_docs = usr_collection.aggregate(
            [
                {"$match": {"is_active": True, "roles.roleCode": role, "orgID": org}},
                {"$group": {"_id": "$orgID", "users": {"$addToSet": "$userID"}}},
            ]
        )
        return user_docs

    def get_user_role_wise(self, usr_collection, role):
        user_docs = usr_collection.aggregate(
            [
                {
                    "$match": {
                        "is_active": True,
                        "roles.roleCode": role,
                    }
                },
                {"$group": {"_id": "$orgID", "users": {"$addToSet": "$userID"}}},
            ]
        )
        return user_docs

    def get_user_translator_wise(self, usr_collection):
        user_docs = usr_collection.aggregate(
            [
                {
                    "$match": {
                        "is_active": True,
                        "roles.roleCode": "TRANSLATOR",
                    }
                },
                {"$group": {"_id": "$orgID", "users": {"$addToSet": "$userID"}}},
            ]
        )
        return user_docs

    def get_all_users_active_inactive(self, usr_collection):
        user_docs = usr_collection.find(
            {"is_active": {"$in": [True, False]}},
            {
                "userID": 1,
                "name": 1,
                "userName": 1,
                "orgID": 1,
                "is_active": 1,
                "_id": 0,
            },
        )
        return user_docs

    def get_time_frame(self, body):
        if body.get("start_date") and body.get("end_date"):
            from_date = datetime.strptime(body["start_date"], "%Y-%m-%d")
            end_date = datetime.strptime(body["end_date"], "%Y-%m-%d")
        else:
            from_date = datetime.strptime("2000-01-01", "%Y-%m-%d")
            now = datetime.now()
            date_time = now.strftime("%Y-%m-%d")
            end_date = datetime.strptime(str(date_time), "%Y-%m-%d")
        return from_date, end_date

    def get_time_frame_for_analytics(self):
        from_date = datetime.strptime("2000-01-01", "%Y-%m-%d")
        end_date = datetime.now()
        # date_time = now.strftime("%Y-%m-%d")
        # end_date = datetime.strptime(str(date_time), "%Y-%m-%d")
        return from_date, end_date

    def file_validation(self):
        file_name1 = config.WEEKLY_CRON_FILE_NAME1
        file_name2 = config.WEEKLY_CRON_FILE_NAME2
        stats_file_copy = config.STATS_FILE
        # file_name2 = "/home/sriharimn/Downloads/language_wise_JUD_STATS2.csv"
        # file_name1 = "/home/sriharimn/Downloads/language_wise_JUD_STATS1.csv"
        file_name1 = os.path.join(config.DOWNLOAD_FOLDER, file_name1)
        file_name2 = os.path.join(config.DOWNLOAD_FOLDER, file_name2)
        stats = os.path.join(config.DOWNLOAD_FOLDER, stats_file_copy)
        if not os.path.exists(file_name1) and not os.path.exists(file_name2):
            return post_error("FILES_NOT_FOUND", "files are mandatory", None), False
        if os.path.exists(stats) :
            df = pd.read_csv(stats)
            df.dropna(subset=['orgID'], inplace=True)
            # result = df1.merge(df, indicator=True, how="right")
            df['orgID'] = df['orgID'].replace(config.ORG_REPLACER)
            result = df.sort_values(by=["orgID"], ascending=True)
            if config.METRICS_ORG_MASKING:
                mask = result["orgID"].isin(
                    config.MASK_ORGS
                )
                result = result[~mask]
        else:
            df = pd.read_csv(file_name1)
            df1 = pd.read_csv(file_name2)
            nan_value = float("NaN")
            df.replace("", nan_value, inplace=True)
            df.dropna(how="all", axis=1, inplace=True)
            df1.replace("", nan_value, inplace=True)
            df1.dropna(how="all", axis=1, inplace=True)
            df1.dropna(subset=['orgID'], inplace=True)
            df.dropna(subset=['orgID'], inplace=True)
            result = pd.merge(df, df1[['_id', 'saved_sent_count']], on='_id', how='left')
            result = result.sort_values(by=["orgID"], ascending=True)
            result['saved_sent_count'].fillna(0, inplace=True)
            result['saved_sent_count'] = result['saved_sent_count'].astype(int)
#             mask = result["orgID"].isin(
#                 ["ANUVAAD", "TARENTO_TESTORG", "NONMT", "ECOMMITTEE "]
#             )
#             result = result[~mask]
        return result, True

    def doc_count(self, result):
        # total_docs = len(result)
        # total_documemt_sentence_count = result["doc_sent_count"].sum()
        # total_verified_sentence_count = result["saved_sent_count"].sum()
        doc_counts = result.groupby("orgID").agg(
            total_doc=("_id", "count"),
            doc_sent_count=("doc_sent_count", "sum"),
            verified_sentence=("saved_sent_count", "sum"),
            org=("orgID", "first"),
        )
        doc_counts = doc_counts.sort_values(
            by=["total_doc", "doc_sent_count", "verified_sentence"], ascending=False
        )
        keyss = doc_counts.to_dict("records")
        # for i, j in enumerate(keyss):
        #     if keyss[i]["src_lang"] in config.LANG_MAPPING.keys():
        #         keyss[i]["src_label"] = config.LANG_MAPPING[keyss[i]["src_lang"]]

        #     if keyss[i]["tgt_lang"] in config.LANG_MAPPING.keys():
        #         keyss[i]["tgt_label"] = config.LANG_MAPPING[keyss[i]["tgt_lang"]]
        total_docs = sum(c["total_doc"] for c in keyss)
        total_documemt_sentence_count = sum(c["doc_sent_count"] for c in keyss)
        total_verified_sentence_count = sum(c["verified_sentence"] for c in keyss)
        return (
            total_docs,
            total_documemt_sentence_count,
            total_verified_sentence_count,
            keyss,
        )

    def lang_count(self, result, body):
        # total_docs = len(result)
        # total_documemt_sentence_count = result["doc_sent_count"].sum()
        # total_verified_sentence_count = result["saved_sent_count"].sum()
        if body["src_lang"]:
            # org_doc = result.groupby("orgID").agg(
            #     total_doc=("_id", "count"),
            #     doc_sent_count=("doc_sent_count", "sum"),
            #     verified_sentence=("saved_sent_count", "sum"),
            #     org=("orgID", "first"),
            # )
            # org_doc = org_doc.sort_values(
            #     by=["total_doc", "doc_sent_count", "verified_sentence"],
            #     ascending=False,
            # )
            # org_doc = org_doc.to_dict("records")

            lang = result.groupby(["src_lang"])
            gb_groups = lang.groups
            gb_groups.keys()
            check_none = result[result["src_lang"] == body["src_lang"]]
            if check_none.empty == True:
                keyss = {
                    "doc_sent_count": None,
                    "org": None,
                    "src_label": body["src_lang"],
                    "src_lang": body["src_lang"],
                    "tgt_label": None,
                    "tgt_lang": None,
                    "total_doc": None,
                    "verified_sentence": None,
                }
                total_docs = 0
                total_documemt_sentence_count = 0
                total_verified_sentence_count = 0
                return (
                    total_docs,
                    total_documemt_sentence_count,
                    total_verified_sentence_count,
                    keyss,
                )
            else:
                ddf = result.loc[gb_groups[body["src_lang"]]]  # body
                keyss = ddf.groupby(["tgt_lang"]).agg(
                    total_doc=("_id", "count"),
                    doc_sent_count=("doc_sent_count", "sum"),
                    verified_sentence=("saved_sent_count", "sum"),
                    org=("orgID", "first"),
                    src_lang=("src_lang", "first"),
                    tgt_lang=("tgt_lang", "first"),
                )
                keyss = keyss.to_dict("records")
                total_docs = sum(c["total_doc"] for c in keyss)
                total_documemt_sentence_count = sum(c["doc_sent_count"] for c in keyss)
                total_verified_sentence_count = sum(
                    c["verified_sentence"] for c in keyss
                )
                for i, j in enumerate(keyss):
                    if keyss[i]["src_lang"] in config.LANG_MAPPING.keys():
                        keyss[i]["src_label"] = config.LANG_MAPPING[
                            keyss[i]["src_lang"]
                        ]

                    if keyss[i]["tgt_lang"] in config.LANG_MAPPING.keys():
                        keyss[i]["tgt_label"] = config.LANG_MAPPING[
                            keyss[i]["tgt_lang"]
                        ]
                return (
                    total_docs,
                    total_documemt_sentence_count,
                    total_verified_sentence_count,
                    keyss,
                )

    def verified_doc_sentence_by_org(self, result,body):

        orgid = result.groupby(["orgID"])
        gb_groups = orgid.groups
        gb_groups.keys()
        check_none = result[result["orgID"] == body['org']]
        if check_none.empty == True:
                keyss = {
                    "doc_sent_count": None,
                    "org": body['org'],
                    # "src_label": None,
                    # "src_lang": None,
                    "tgt_label": None,
                    "tgt_lang": None,
                    "total_doc": None,
                    "verified_sentence": None,
                }
                total_docs = 0
                total_documemt_sentence_count = 0
                total_verified_sentence_count = 0
                return (
                    total_docs,
                    total_documemt_sentence_count,
                    total_verified_sentence_count,
                    keyss,
                )
        else:
            ddf = result.loc[gb_groups[body['org']]]  # body
            keyss = ddf.groupby(["tgt_lang"]).agg(
                total_doc=("_id", "count"),
                doc_sent_count=("doc_sent_count", "sum"),
                verified_sentence=("saved_sent_count", "sum"),
                org=("orgID", "first"),
                # src_lang=("src_lang", "first"),
                tgt_lang=("tgt_lang", "first"),
            )
            keyss = keyss.to_dict("records")
            for i, j in enumerate(keyss):
                if keyss[i]["tgt_lang"] in config.LANG_MAPPING.keys():
                    keyss[i]["tgt_label"] = config.LANG_MAPPING[keyss[i]["tgt_lang"]]
                else:
                    keyss[i]["tgt_label"] = keyss[i]["tgt_lang"]
                    keyss[i]["error"] = 'language_code missing from config'
            total_docs = sum(c["total_doc"] for c in keyss)
            total_documemt_sentence_count = sum(c["doc_sent_count"] for c in keyss)
            total_verified_sentence_count = sum(c["verified_sentence"] for c in keyss)
            return (
                total_docs,
                total_documemt_sentence_count,
                total_verified_sentence_count,
                keyss,
            )

    def verified_doc_sentence_all(self,result):
        # total_docs = len(result)
        # total_documemt_sentence_count = result["doc_sent_count"].sum()
        # total_verified_sentence_count = result["saved_sent_count"].sum()
        lang = result.groupby("tgt_lang").agg(
            total_doc=("_id", "count"),
            doc_sent_count=("doc_sent_count", "sum"),
            verified_sentence=("saved_sent_count", "sum"),
            tgt_lang=("tgt_lang", "first"),
        )
        lang = lang.sort_values(
            by=["total_doc", "doc_sent_count", "verified_sentence"], ascending=False
        )
        lang["total_doc"].sum()
        keyss = lang.to_dict("records")
        for i, j in enumerate(keyss):
            # if keyss[i]["src_lang"] in config.LANG_MAPPING.keys():
            #     keyss[i]["src_label"] = config.LANG_MAPPING[keyss[i]["src_lang"]]

            if keyss[i]["tgt_lang"] in config.LANG_MAPPING.keys():
                keyss[i]["tgt_label"] = config.LANG_MAPPING[keyss[i]["tgt_lang"]]
            else:
                keyss[i]["tgt_label"] = keyss[i]["tgt_lang"]
                keyss[i]["error"] = 'language_code missing from config'
        total_docs = sum(c["total_doc"] for c in keyss)
        total_documemt_sentence_count = sum(c["doc_sent_count"] for c in keyss)
        total_verified_sentence_count = sum(c["verified_sentence"] for c in keyss)
        return (
            total_docs,
            total_documemt_sentence_count,
            total_verified_sentence_count,
            keyss,
        )

    def translation_wfm_data(self, wfm_collection, fromdate, todate):
        docs = wfm_collection.find(
            {
                "startTime": {
                    "$gte": fromdate, 
                    "$lte": todate
                },
                "workflowCode": {
                    '$in': ["DP_WFLOW_FBT", "WF_A_FCBMTKTR", "DP_WFLOW_FBTTR", "WF_A_FTTKTR"]
                },
                "active": True
            }
        )
        docs = pd.DataFrame(list(docs))
        # docs = pd.concat([docs,pd.json_normalize(docs['_id'])],axis=1)
        # del docs['_id']
        # docs = docs.dropna(subset=['org'])
        # for x_col in ['org','src','tgt']:
        #     docs[x_col] = docs[x_col].str.strip()
        # print(docs.to_string())
        return docs


    def get_reviewer_data_from_wfm(self, wfm_collection, fromdate, todate):
        docs = wfm_collection.aggregate(
            [
                {
                    "$match": {
                        "startTime": {
                            "$gte": fromdate, 
                            "$lte": todate,  
                        },
                        "workflowCode": {
                            '$in': ["DP_WFLOW_FBT", "WF_A_FCBMTKTR", "DP_WFLOW_FBTTR", "WF_A_FTTKTR"]
                        },
                        "active": True,
                    },
                },
                {
                    "$group": {
                        "_id": {
                            'org': "$metadata.orgID",
                            'status': {
                                "$cond": [{"$eq": ["$granularity.currentStatus", "parallel_document_uploaded"]}, "uploaded", "in_progress"]
                            },
                            "src": {'$first': "$input.files.model.source_language_name"},
                            "tgt": {'$first': "$input.files.model.target_language_name"},
                        },
                        "count": {"$sum": 1}
                    }},
            ]
        )
        docs = pd.DataFrame(list(docs))
        docs = pd.concat([docs,pd.json_normalize(docs['_id'])],axis=1)
        del docs['_id']
        docs = docs.dropna(subset=['org'])
        for x_col in ['org','src','tgt']:
            docs[x_col] = docs[x_col].str.strip()
        # print(docs.to_string())
        return docs

    def get_custom_timestamp(self,dt_obj: dt):
        return dt_obj.timestamp()*1000

