import datetime
import shutil
import pandas as pd
import pytz
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
import os
from utilities import (
    write_to_csv_user,
    generate_email_notification,
    send_email,
    write_to_csv_user_daily_crn,
)
import time
from bson.json_util import dumps, loads


IST = pytz.timezone("Asia/Kolkata")
from models import jud_stats
from utilities import MODULE_CONTEXT

stats = jud_stats()
usr_collection, ch_collection = stats.mongo_connection()
log_info("Mongo connected", MODULE_CONTEXT)


def get_trans_user_data_from_db_weekly_crn_file1():
    users = config.EMAIL_NOTIFIER
    log_info("fetch data started for file 1", MODULE_CONTEXT)
    weekly_cron_file_name1 = config.WEEKLY_CRON_FILE_NAME1
    # weekly_cron_file_name2 = config.WEEKLY_CRON_FILE_NAME2
    # daily_cron_file_name1 = config.DAILY_CRON_FILE_NAME1
    # daily_cron_file_name2 = config.DAILY_CRON_FILE_NAME2

    if os.path.exists(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1):
        os.remove(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1)

    user_docs = stats.get_all_users_active_inactive(usr_collection)
    log_info(
        f"Data returned from user {config.USER_COLLECTION} collection", MODULE_CONTEXT
    )
    try:
        from_date, end_date = stats.get_time_frame_for_analytics()
        for doc in user_docs:

            ch_docs = stats.fetch_data_for_language_trans_tokenized_for_scheduer_only(
                ch_collection, doc, from_date, end_date
            )
            # saved_docs = stats.fetch_data_for_userwise_trans_user_tokenized(
            #     ch_collection, doc, from_date, end_date
            # )
            # log_info(f'Details collected for for userID : {doc} ',MODULE_CONTEXT)
            write_to_csv_user(
                [x for x in ch_docs],
                (config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1),
            )
            # write_to_csv_user(
            #     [x for x in saved_docs],
            #     (config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2),
            # )

        log_info(
            f"Data written into files {weekly_cron_file_name1}",
            MODULE_CONTEXT,
        )
        return
    except Exception as e:
        log_exception("Error in fetching the data: {}".format(e), MODULE_CONTEXT, e)
        msg = generate_email_notification(
            users, "could not get the data something went wrong : {}".format(e)
        )
        send_email(msg)
        log_exception(
            "Generated alert email in exception weekly cron job : {}".format(str(e)),
            MODULE_CONTEXT,
            e,
        )
        return


def get_trans_user_data_from_db_weekly_crn_file2():
    users = config.EMAIL_NOTIFIER
    log_info("fetch data started for file 1", MODULE_CONTEXT)
    # weekly_cron_file_name1 = config.WEEKLY_CRON_FILE_NAME1
    weekly_cron_file_name2 = config.WEEKLY_CRON_FILE_NAME2
    # daily_cron_file_name1 = config.DAILY_CRON_FILE_NAME1
    # daily_cron_file_name2 = config.DAILY_CRON_FILE_NAME2

    if os.path.exists(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2):
        os.remove(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2)

    user_docs = stats.get_all_users_active_inactive(usr_collection)
    log_info(
        f"Data returned from user {config.USER_COLLECTION} collection", MODULE_CONTEXT
    )

    try:
        from_date, end_date = stats.get_time_frame_for_analytics()
        for doc in user_docs:

            # ch_docs = stats.fetch_data_for_language_trans_tokenized_for_scheduer_only(
            #     ch_collection, doc, from_date, end_date
            # )
            saved_docs = stats.fetch_data_for_userwise_trans_user_tokenized(
                ch_collection, doc, from_date, end_date
            )
            # log_info(f'Details collected for for userID : {doc} ',MODULE_CONTEXT)
            # write_to_csv_user(
            #     [x for x in ch_docs],
            #     (config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1),
            # )
            write_to_csv_user(
                [x for x in saved_docs],
                (config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2),
            )

        log_info(
            f"Data written into files {weekly_cron_file_name2}",
            MODULE_CONTEXT,
        )
        return
    except Exception as e:
        log_exception("Error in fetching the data: {}".format(e), MODULE_CONTEXT, e)
        msg = generate_email_notification(
            users, "could not get the data something went wrong : {}".format(e)
        )
        send_email(msg)
        log_exception(
            "Generated alert email in exception weekly cron job : {}".format(str(e)),
            MODULE_CONTEXT,
            e,
        )
        return


def get_trans_user_data_from_db_daily_day_crn():
    users = config.EMAIL_NOTIFIER
    log_info("fetch data started", MODULE_CONTEXT)
    # filename = uuid.uuid4().hex
    daily_cron_file_name1 = config.DAILY_CRON_FILE_NAME1
    daily_cron_file_name2 = config.DAILY_CRON_FILE_NAME2
    # weekly_cron_file_name1 = config.WEEKLY_CRON_FILE_NAME1
    # weekly_cron_file_name2 = config.WEEKLY_CRON_FILE_NAME2
    # file_save = str(filename)[:-10]+'_USER_WISE_JUD_Org_level_Statistics.csv'
    if os.path.exists(
        config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1
    ) and os.path.exists(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name2):
        pass
    else:
        msg = generate_email_notification(
            users, "could not get the data files not found"
        )
        send_email(msg)
        log_info(
            f"Generated alert email for daily cron (files not found),{daily_cron_file_name1,daily_cron_file_name2} ",
            MODULE_CONTEXT,
        )
    user_docs = stats.get_all_users_active_inactive(usr_collection)
    log_info(
        f"Data returned from user {config.USER_COLLECTION} collection", MODULE_CONTEXT
    )
    try:
        df = pd.read_csv(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1)
        from_datee = df["created_on"].max()
        from_date = datetime.datetime.strptime(str(from_datee), "%Y-%m-%d %H:%M:%S.%f")
        now = datetime.datetime.now()
        date_time = now.strftime("%Y-%m-%d")
        end_date = datetime.datetime.strptime(str(date_time), "%Y-%m-%d")
        # from_date, end_date = stats.get_time_frame_for_analytics()
        for doc in user_docs:
            # log_info(f'fetching details for {doc} userID',MODULE_CONTEXT)
            ch_docs = stats.fetch_data_for_language_trans_tokenized_for_scheduer_only(
                ch_collection, doc, from_date, end_date
            )
            saved_docs = stats.fetch_data_for_userwise_trans_user_tokenized(
                ch_collection, doc, from_date, end_date
            )
            # log_info(f'Details collected for for userID : {doc} ',MODULE_CONTEXT)
            write_to_csv_user_daily_crn(
                [x for x in ch_docs],
                (config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1),
            )
            write_to_csv_user_daily_crn(
                [x for x in saved_docs],
                (config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name2),
            )
        log_info(
            f"Data written into files {daily_cron_file_name1,daily_cron_file_name2}",
            MODULE_CONTEXT,
        )
        return
    except Exception as e:
        log_exception("Error in fetching the data: {}".format(e), MODULE_CONTEXT, e)
        msg = generate_email_notification(
            users, "could not get the data something went wrong : {}".format(e)
        )
        send_email(msg)
        log_exception(
            "Generated alert email in exception daily cron job : {}".format(str(e)),
            MODULE_CONTEXT,
            e,
        )
        return


def copy_cron_csv():
    log_info("fetch data started", MODULE_CONTEXT)
    # filename = uuid.uuid4().hex
    daily_cron_file_name1 = config.DAILY_CRON_FILE_NAME1
    daily_cron_file_name2 = config.DAILY_CRON_FILE_NAME2
    weekly_cron_file_name1 = config.WEEKLY_CRON_FILE_NAME1
    weekly_cron_file_name2 = config.WEEKLY_CRON_FILE_NAME2
    # file_save = str(filename)[:-10]+'_USER_WISE_JUD_Org_level_Statistics.csv'
    if os.path.exists(
        config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1
    ) and os.path.exists(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2):
        if not os.path.exists(
            config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1
        ) and not os.path.exists(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name2):
            shutil.copyfile(
                config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1,
                config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1,
            )
            shutil.copyfile(
                config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2,
                config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name2,
            )
            data = "files copied"
            log_info(f"{data}", MODULE_CONTEXT)
        elif os.path.exists(
            config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1
        ) and os.path.exists(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name2):
            os.remove(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1)
            os.remove(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1)
            shutil.copyfile(
                config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1,
                config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1,
            )
            shutil.copyfile(
                config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2,
                config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name2,
            )
            data = "files copied"
        else:
            data = "Files Already in Directory"
            log_info(f"{data}", MODULE_CONTEXT)
    else:
        data = "Files Not found in Directory"
        log_info(f"{data}", MODULE_CONTEXT)

    return data


def dump_coll():
    count = 0
    while True:
        try:

            ch_docs       = ch_collection.find({},batch_size=5000)
            time.sleep(5)
            print("sleeping")
            list_cur = list(ch_docs)
            print("wokeeeee")
            count = 1
        except Exception as e:
            print(str(e))
        if count==1:
            break
    
    json_data = dumps(list_cur, indent = 2) 
    with open(config.DOWNLOAD_FOLDER+"/"+"collection_dump.json", 'w') as file:
        file.write(json_data)
    return


