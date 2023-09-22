import datetime
import json
import shutil
import threading
import pandas as pd
import pytz
from models import CustomResponse, Status, jud_stats
from flask import request, make_response
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
import os
from utilities import (
    write_to_csv,
    org_level_csv,
    write_to_csv_user,
    generate_email_notification,
    send_email,
)
from services import (
    copy_cron_csv,
    get_trans_user_data_from_db_weekly_crn,
)
import uuid
import requests
from .scheduler_jobs import manual_start_reviewerdata_scheduler

# from flask_mail import Mail, Message
# from flask import render_template
IST = pytz.timezone("Asia/Kolkata")
from flask import Flask, jsonify

# from email.mime.base import MIMEBase
# from email import encoders


app = Flask(__name__, template_folder="../templates")

# app.config.update(config.MAIL_SETTINGS)
# creating an instance of Mail class
# mail=Mail(app)

stats = jud_stats()
usr_collection, ch_collection = stats.mongo_connection()


@app.route(config.API_URL_PREFIX + "/anuvaad-data", methods=["POST"])
def FetchJudgementCount():
    body = request.get_json()

    def FetchJudgementCountRole_org_Wise():
        log_info("FetchJudgementCount api called", MODULE_CONTEXT)
        filename = uuid.uuid4().hex
        file_name1 = str(filename)[:-10] + "_JUD_STATS1" + ".csv"
        file_name2 = str(filename)[:-10] + "_JUD_STATS2" + ".csv"
        file_save = str(filename)[:-10] + "_JUD_Org_level_Statistics.csv"
        keys = body.keys()
        if "config" in keys and body.get("config") == "stats":
            get_trans_user_data_from_db_weekly_crn()
        elif "config" in keys and body.get("config") == "copy":
            copy_cron_csv()
        elif body.get("org"):
            org = body["org"]
            role = body["role"]
            email = body["email"]
            user_docs = stats.get_user_role_org_wise(usr_collection, role, org)
            log_info(
                f"Data returned from {config.USER_COLLECTION} collection",
                MODULE_CONTEXT,
            )
        elif body.get("role"):
            role = body["role"]
            email = body["email"]
            user_docs = stats.get_user_role_wise(usr_collection, role)
            log_info(
                f"Data returned from {config.USER_COLLECTION} collection",
                MODULE_CONTEXT,
            )
        elif "config" in keys and body.get("config") == "remove":
            if os.path.exists(
                config.DOWNLOAD_FOLDER + "/" + config.DAILY_CRON_FILE_NAME1
            ):
                os.remove(config.DOWNLOAD_FOLDER + "/" + config.DAILY_CRON_FILE_NAME1)
            if os.path.exists(
                config.DOWNLOAD_FOLDER + "/" + config.DAILY_CRON_FILE_NAME2
            ):
                os.remove(config.DOWNLOAD_FOLDER + "/" + config.DAILY_CRON_FILE_NAME2)
            if os.path.exists(
                config.DOWNLOAD_FOLDER + "/" + config.STATS_FILE_COPY
            ):
                os.remove(config.DOWNLOAD_FOLDER + "/" + config.STATS_FILE_COPY)
            else:
                return {"msg": "already deleted"}
        try:
            if "config" in keys:
                pass
            else:
                from_date, end_date = stats.get_time_frame(body)
                for doc in user_docs:
                    log_info(f'fetching details for {doc["_id"]} users', MODULE_CONTEXT)
                    for user in doc["users"]:
                        ch_docs = stats.fetch_data_machine_trans_tokenised(
                            ch_collection, user, from_date, end_date
                        )
                        saved_docs = stats.fetch_data_user_trans_tokenized(
                            ch_collection, user, from_date, end_date
                        )
                        log_info(
                            f'Details collected for for userID : {user}, in org {doc["_id"]} ',
                            MODULE_CONTEXT,
                        )
                        ch_docs = [x for x in ch_docs]
                        write_to_csv(
                            ch_docs,
                            doc["_id"],
                            (config.DOWNLOAD_FOLDER + "/" + file_name1),
                        )
                        write_to_csv(
                            [x for x in saved_docs],
                            doc["_id"],
                            (config.DOWNLOAD_FOLDER + "/" + file_name2),
                        )

                if type(email) == list:
                    users = email
                else:
                    users = [email]

                if os.path.exists(
                    config.DOWNLOAD_FOLDER + "/" + (file_name1 and file_name2)
                ):
                    org_level_csv(
                        file_save,
                        (config.DOWNLOAD_FOLDER + "/" + file_name1),
                        (config.DOWNLOAD_FOLDER + "/" + file_name2),
                    )
                    out = CustomResponse(
                        Status.SUCCESS.value, {"files": [file_name1, file_name2]}
                    )
                    # with app.app_context():
                    file_name1 = config.DOWNLOAD_FOLDER + "/" + file_name1
                    file_name2 = config.DOWNLOAD_FOLDER + "/" + file_name2
                    file_save = config.DOWNLOAD_FOLDER + "/" + file_save
                    files = [file_name1, file_name2, file_save]
                    log_info(
                        "Generating email notification for found data !!!!",
                        MODULE_CONTEXT,
                    )
                    msg = generate_email_notification(
                        users, "Data Generated Successfully"
                    )
                    for i, j in enumerate(files):
                        with open(j, "rb") as content_file:
                            content = content_file.read()
                            msg.add_attachment(
                                content,
                                maintype="application",
                                subtype="csv",
                                filename=j.split("/")[-1],
                            )
                    send_email(msg)
                    log_info(f"Generated alert email ", MODULE_CONTEXT)
                    log_info(
                        "filenames :{},{} ".format(file_name1, file_name2),
                        MODULE_CONTEXT,
                    )
                else:
                    log_info(
                        "files : {} and {} not found".format(file_name1, file_name2),
                        MODULE_CONTEXT,
                    )
                    msg = generate_email_notification(
                        users,
                        "could not get the data either role or org given is not present in the system please check your input and try again",
                    )
                    send_email(msg)

        except Exception as e:
            log_exception(
                "Error in FetchJudgementCount: {}".format(e), MODULE_CONTEXT, e
            )
            status = Status.SYSTEM_ERR.value
            status["message"] = str(e)
            out = CustomResponse(status, None)
            return out.getres()

    threading.Thread(target=FetchJudgementCountRole_org_Wise).start()
    out = CustomResponse(
        Status.ACCEPTED.value,
        {"msg": "please check your email after some time for requested Stats"},
    )
    return out.getres()


# no of documents count wrt to src and tgt language with org.
@app.route(config.API_URL_PREFIX + "/anuvaad-data/lang_count", methods=["GET", "POST"])
def anuvaad_chart_org_doc():
    body = request.get_json()
    if "env" in body.keys():
        url = generate_url(config.jud, "lang_count")
        headers = headers = {"Content-Type": "application/json"}
        payload = json.dumps(
            {
                "src_lang": body["src_lang"],
            }
        )
        datas = requests.post(url, data=payload, headers=headers)
        datas = datas.json()
        return datas
    result, status = stats.file_validation()
    try:
        if status == False:
            return result
        else:
            (
                total_docs,
                total_documemt_sentence_count,
                total_verified_sentence_count,
                keyss,
            ) = stats.lang_count(result, body)
            response = make_response(
                jsonify(
                    {
                        "data": {
                            "total_document_sentence_count": int(
                                total_documemt_sentence_count
                            ),
                            "total_verified_sentence_count": int(
                                total_verified_sentence_count
                            ),
                            "total_documents": int(total_docs),
                            "language_counts": keyss,
                        }
                    }
                ),
                200,
            )
            response.headers["Content-Type"] = "application/json"
            return response

    except Exception as e:
        log_exception("Error in FetchJudgementCount: {}".format(e), MODULE_CONTEXT, e)
        status = Status.SYSTEM_ERR.value
        status["message"] = str(e)
        out = CustomResponse(status, None)
        return out.getres()


def generate_url(url_pre, end_point):
    url_modified = url_pre + "/anuvaad-metrics/anuvaad-data/" + end_point
    return url_modified


# no of documents wrt org having src and tgt lang
@app.route(config.API_URL_PREFIX + "/anuvaad-data/doc_count", methods=["POST", "GET"])
def anuvaad_chart_lang_org():
    if request.method == "POST":
        url = generate_url(config.jud, "doc_count")
        data = requests.get(url)
        data = data.json()
        return data
    result, status = stats.file_validation()
    if status == False:
        return result
    else:
        (
            total_docs,
            total_documemt_sentence_count,
            total_verified_sentence_count,
            keyss,
        ) = stats.doc_count(result)
        out = CustomResponse(
            Status.SUCCESS.value,
            {
                "total_document_sentence_count": int(total_documemt_sentence_count),
                "total_verified_sentence_count": int(total_verified_sentence_count),
                "total_documents": int(total_docs),
                "language_counts": keyss,
            },
        )
        return out.getres()


@app.route(
    config.API_URL_PREFIX + "/anuvaad-data/verified_count", methods=["POST", "GET"]
)
def anuvaad_chart_verfied_sentence():
    try:
        result, status = stats.file_validation()
        if request.method == "POST":
            body = request.get_json()
            if status == False:
                return result
            elif  'org' in body.keys() and body['org'] == 'ALL':
                (
                    total_docs,
                    total_documemt_sentence_count,
                    total_verified_sentence_count,
                    keyss,
                ) = stats.verified_doc_sentence_all(result)
                out = CustomResponse(
                    Status.SUCCESS.value,
                    {
                        "total_document_sentence_count": int(total_documemt_sentence_count),
                        "total_verified_sentence_count": int(total_verified_sentence_count),
                        "total_documents": int(total_docs),
                        "language_counts": keyss,
                    },
                )
                return out.getres()
            else:
                (
                    total_docs,
                    total_documemt_sentence_count,
                    total_verified_sentence_count,
                    keyss,
                ) = stats.verified_doc_sentence_by_org(result,body)
                out = CustomResponse(
                    Status.SUCCESS.value,
                    {
                        "total_document_sentence_count": int(total_documemt_sentence_count),
                        "total_verified_sentence_count": int(total_verified_sentence_count),
                        "total_documents": int(total_docs),
                        "language_counts": keyss,
                    },
                )
                return out.getres()
            
        elif request.method == "GET":
            if status == False:
                return result
            else:
                (
                    total_docs,
                    total_documemt_sentence_count,
                    total_verified_sentence_count,
                    keyss,
                ) = stats.verified_doc_sentence_all(result)
                out = CustomResponse(
                    Status.SUCCESS.value,
                    {
                        "total_document_sentence_count": int(total_documemt_sentence_count),
                        "total_verified_sentence_count": int(total_verified_sentence_count),
                        "total_documents": int(total_docs),
                        "language_counts": keyss,
                    },
                )
                return out.getres()
    except Exception as e:
        log_exception("Error in FetchJudgementCount: {}".format(e), MODULE_CONTEXT, e)
        status = Status.SYSTEM_ERR.value
        status["message"] = str(e)
        out = CustomResponse(status, None)
        return out.getres()


@app.route(config.API_URL_PREFIX + "/anuvaad-data/languages", methods=["POST", "GET"])
def dropdown_lang():
    supported_languages = "./models/language.json"
    with open(supported_languages, "r") as f:
        data = json.load(f)
    out = CustomResponse(Status.SUCCESS.value, data)
    return out.getres()


@app.route(config.API_URL_PREFIX + "/anuvaad-data/v1/upload_doc_count", methods=["GET"])
def fetch_reviewer_data():
    # get data from reviewer-data files
    r_base_file = f'{config.DOWNLOAD_FOLDER}/{config.REVIEWER_DATA_BASEFILE}'
    r_cron_file = f'{config.DOWNLOAD_FOLDER}/{config.REVIEWER_DATA_CRONFILE}'
    df = pd.DataFrame()
    for r_file in [r_base_file,r_cron_file]:
        try:
            df1 = pd.read_csv(r_file)
        except FileNotFoundError: 
            df1 = pd.DataFrame()
        # merge diff files data
        df = pd.concat([df,df1],axis=0,ignore_index=True)
    # aggreagate data
    if len(df) > 0 :
        # pre filters
        df = df.dropna(subset=['org'])
        # mask unknown org
        if config.METRICS_ORG_MASKING:
            df = df[~df['org'].isin(config.MASK_ORGS)]
        # replace some orgs
        df['org'] = df['org'].replace(config.ORG_REPLACER)
        # apply filter to src,tgt langs
        for x_col in ['tgt','src']:
            # remove alpha from lang string
            df[x_col] = df[x_col].replace({'\(Alpha\)':""},regex=True)
            # strip lang string
            df[x_col] = df[x_col].str.strip()
            # remove not supported rows 
            df = df[~df[x_col].str.contains('Not Supported')]
        # aggregate data
        df = df.groupby(['org', 'src', 'tgt']).apply(lambda x : pd.Series({'count':x.groupby('status').sum().to_dict()['count']}))
        df = pd.concat([df.reset_index(),pd.json_normalize(df['count'])],axis=1)
        del df['count']
        mapper = {'in_progress': "int", 'uploaded': "int"}
        renamer = {'count.in_progress': "in_progress", 'count.uploaded': "uploaded"}
        df = df.rename(columns=renamer)
        # create default columns with 0 if not preset - start 
        # (if no uploaded / inprogress doc then this logic is required)
        for x_col in list(mapper.keys()): 
            if x_col not in df.columns:
                df[x_col] = 0 
        # create default columns with 0 if not preset - end
        df[list(mapper.keys())] = df[list(mapper.keys())].fillna(0)
        df = df.astype(mapper)
    df = {
        'total_uploaded': int(df['uploaded'].sum()),
        'total_inprogress': int(df['in_progress'].sum()),
        'total_orgs': len(df['org'].unique()),
        'data': df.reset_index(drop=True).to_dict('record'),
    }
    out = CustomResponse(Status.SUCCESS.value, df)
    return out.getres()


@app.route(config.API_URL_PREFIX + "/anuvaad-data/v1/upload_doc_count", methods=["POST"])
def update_reviewer_data():
    if request.method != "POST":
        return None
    body = request.get_json()
    base = bool(body.get('base',False))
    manual_start_reviewerdata_scheduler(base)
    out = CustomResponse(Status.SUCCESS.value, f"updated reviewer data for base={base}")
    return out.getres()

@app.route(config.API_URL_PREFIX + "/transliteration", methods=["POST"])
def transliterate():
    if request.method != "POST":
        return None
    try:
        payload = json.dumps(request.get_json())
        headers = {
        'Authorization': config.ACCESS_TOKEN
        }
        response = requests.request("POST", config.TRANSLITERATION_URL, headers=headers, data=payload)
        if response.status_code >=200 and response.status_code <= 204:
            out = CustomResponse(Status.SUCCESS.value, response.json())
            return out.getres()
        status = Status.SYSTEM_ERR.value
        status["message"] = "Unable to perform transliteration at this point of time."
        out = CustomResponse(status, None)
        return out.getres()
    except Exception as e:
        log_exception("Error in transliteration: {}".format(e), MODULE_CONTEXT, e)
        status = Status.SYSTEM_ERR.value
        status["message"] = "Unable to perform transliteration at this point of time. " + str(e)
        out = CustomResponse(status, None)
        return out.getres()