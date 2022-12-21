from datetime import datetime
import threading
import pandas as pd
import pytz
from models import CustomResponse, Status, jud_stats
from flask import request
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
import uuid

# from flask_mail import Mail, Message
# from flask import render_template
IST = pytz.timezone("Asia/Kolkata")
from flask import Flask, jsonify
from email.mime.base import MIMEBase
from email import encoders


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

        if body.get("org"):
            org = body["org"]
            role = body["role"]
            email = body["email"]
            user_docs = stats.get_user_role_org_wise(usr_collection, role, org)
            log_info(
                f"Data returned from {config.USER_COLLECTION} collection",
                MODULE_CONTEXT,
            )
        else:
            role = body["role"]
            email = body["email"]
            user_docs = stats.get_user_role_wise(usr_collection, role)
            log_info(
                f"Data returned from {config.USER_COLLECTION} collection",
                MODULE_CONTEXT,
            )

        try:
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
                        ch_docs, doc["_id"], (config.DOWNLOAD_FOLDER + "/" + file_name1)
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
                    "Generating email notification for found data !!!!", MODULE_CONTEXT
                )
                msg = generate_email_notification(users, "Data Generated Successfully")
                for i, j in enumerate(files):
                    with open(j, "rb") as content_file:
                        content = content_file.read()
                        msg.add_attachment(
                            content,
                            maintype="application",
                            subtype="csv",
                            filename=j.split("/")[-1],
                        )

                    # using smtp lib
                    # attach_file = open(j, "rb")  # Open the file as binary mode
                    # payload = MIMEBase("application", "octate-stream")
                    # payload.set_payload((attach_file).read())
                    # encoders.encode_base64(payload)  # encode the attachment
                    # # add payload header with filename
                    # payload.add_header(
                    #     "Content-Disposition",
                    #     "attachment",
                    #     filename=str(j.split("/")[-1]),
                    # )
                    # msg.attach(payload)
                send_email(msg)
                log_info(f"Generated alert email ", MODULE_CONTEXT)
                log_info(
                    "filenames :{},{} ".format(file_name1, file_name2), MODULE_CONTEXT
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


@app.route(config.API_URL_PREFIX + "/anuvaad-data/user", methods=["POST"])
def FetchJudgementCount_user_wise():
    body = request.get_json()

    def FetchJudgementCountRole_user_org_Wise():
        log_info("FetchJudgementCount api called", MODULE_CONTEXT)
        filename = uuid.uuid4().hex
        file_name1 = str(filename)[:-10] + "_USER_WISE_JUD_STATS1" + ".csv"
        file_name2 = str(filename)[:-10] + "_USER_WISE_JUD_STATS2" + ".csv"
        file_save = str(filename)[:-10] + "_USER_WISE_JUD_Org_level_Statistics.csv"

        if body.get("email"):
            email = body["email"]
            user_docs = stats.get_all_users_active_inactive(usr_collection)
            log_info(
                f"Data returned from {config.USER_COLLECTION} collection",
                MODULE_CONTEXT,
            )
        try:
            from_date, end_date = stats.get_time_frame(body)
            for doc in user_docs:
                log_info(f"fetching details for {doc} userID", MODULE_CONTEXT)
                ch_docs = stats.fetch_data_for_userwise_trans_tokenized(
                    ch_collection, doc, from_date, end_date
                )
                saved_docs = stats.fetch_data_for_userwise_trans_user_tokenized(
                    ch_collection, doc, from_date, end_date
                )
                log_info(f"Details collected for for userID : {doc} ", MODULE_CONTEXT)
                ch_docs = [x for x in ch_docs]
                write_to_csv_user(ch_docs, (config.DOWNLOAD_FOLDER + "/" + file_name1))
                write_to_csv_user(
                    [x for x in saved_docs], (config.DOWNLOAD_FOLDER + "/" + file_name2)
                )

            if type(email) == list:
                users = email
            else:
                users = [email]

            if os.path.exists(
                config.DOWNLOAD_FOLDER + "/" + (file_name1 and file_name2)
            ):
                # org_level_csv_user(config.DOWNLOAD_FOLDER+"/"+file_save,(config.DOWNLOAD_FOLDER+'/'+file_name1),(config.DOWNLOAD_FOLDER+'/'+file_name2))
                out = CustomResponse(
                    Status.SUCCESS.value, {"files": [file_name1, file_name2]}
                )
                # with app.app_context():
                file_name1 = config.DOWNLOAD_FOLDER + "/" + file_name1
                file_name2 = config.DOWNLOAD_FOLDER + "/" + file_name2
                # file_save = config.DOWNLOAD_FOLDER+'/'+file_save
                files = [file_name1, file_name2]
                log_info(
                    "Generating email notification for found data !!!!", MODULE_CONTEXT
                )
                tdy_date = datetime.now(IST).strftime("%Y:%m:%d %H:%M:%S")
                msg = generate_email_notification(users, "Data Generated Successfully")
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
                    "filenames :{},{} ".format(file_name1, file_name2), MODULE_CONTEXT
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
                log_info(f"Generated alert email ", MODULE_CONTEXT)

        except Exception as e:
            log_exception(
                "Error in FetchJudgementCount: {}".format(e), MODULE_CONTEXT, e
            )
            status = Status.SYSTEM_ERR.value
            status["message"] = str(e)
            out = CustomResponse(status, None)
            return out.getres()

    threading.Thread(target=FetchJudgementCountRole_user_org_Wise).start()
    out = CustomResponse(
        Status.ACCEPTED.value,
        {"msg": "please check your email after some time for requested Stats"},
    )
    return out.getres()


# no of documents count wrt to src and tgt language with org.
@app.route(config.API_URL_PREFIX + "/anuvaad-data/lang_count", methods=["POST"])
def anuvaad_chart_org_doc():
    body = request.get_json()
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
            ) = stats.doc_count(result, body)
            out = CustomResponse(
                Status.ACCEPTED.value,
                {
                    "total_document_sentence_count": int(total_documemt_sentence_count),
                    "total_verified_sentence_count": int(total_verified_sentence_count),
                    "total_documents": int(total_docs),
                    "language_counts": keyss,
                },
            )
            return out.getres()
            # return {
            #     "data": {
            #         "total_document_sentence_count": int(total_documemt_sentence_count),
            #         "total_verified_sentence_count": int(total_verified_sentence_count),
            #         "total_documents": int(total_docs),
            #         "language_counts": keyss,
            #     }
            # }

    except Exception as e:
        log_exception("Error in FetchJudgementCount: {}".format(e), MODULE_CONTEXT, e)
        status = Status.SYSTEM_ERR.value
        status["message"] = str(e)
        out = CustomResponse(status, None)
        return out.getres()


# no of documents wrt org having src and tgt lang
@app.route(config.API_URL_PREFIX + "/anuvaad-data/doc_count", methods=["GET"])
def anuvaad_chart_lang_org():
    result, status = stats.file_validation()
    if status == False:
        return result
    else:
        (
            total_docs,
            total_documemt_sentence_count,
            total_verified_sentence_count,
            keyss,
        ) = stats.org_lang(result)
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


@app.route(config.API_URL_PREFIX + "/anuvaad-data/verified_count", methods=["GET"])
def anuvaad_chart_verfied_sentence():
    # body = request.get_json()
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
            ) = stats.verified_doc(result)
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
            # return jsonify({'msgg':keyss})
    except Exception as e:
        log_exception("Error in FetchJudgementCount: {}".format(e), MODULE_CONTEXT, e)
        status = Status.SYSTEM_ERR.value
        status["message"] = str(e)
        out = CustomResponse(status, None)
        return out.getres()
