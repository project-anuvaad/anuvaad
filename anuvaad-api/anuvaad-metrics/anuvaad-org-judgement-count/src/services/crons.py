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

def get_trans_user_data_from_db_weekly_crn():
    users = config.EMAIL_NOTIFIER
    log_info("fetch data started", MODULE_CONTEXT)
    # filename = uuid.uuid4().hex
    stats_file = config.STATS_FILE
    weekly_cron_file_name1 = config.WEEKLY_CRON_FILE_NAME1
    weekly_cron_file_name2 = config.WEEKLY_CRON_FILE_NAME2
    daily_cron_file_name1 = config.DAILY_CRON_FILE_NAME1
    daily_cron_file_name2 = config.DAILY_CRON_FILE_NAME2
    # file_save = str(filename)[:-10]+'_USER_WISE_JUD_Org_level_Statistics.csv'
    if os.path.exists(
        config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1
    ) and os.path.exists(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2 
    ) and os.path.exists(config.DOWNLOAD_FOLDER + "/" + stats_file):
        os.remove(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1)
        os.remove(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2)
        os.remove(config.DOWNLOAD_FOLDER + "/" + stats_file)
        # os.remove(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1)
        # os.remove(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name2)
    else:
        msg = generate_email_notification(
            users, "could not get the data files not found"
        )
        send_email(msg)
        log_info(f"Generated alert email scheduler files not found ", MODULE_CONTEXT)
    user_docs = stats.get_all_users_active_inactive(usr_collection)
    user_df =pd.json_normalize(user_docs)
    log_info(
        f"Data returned from user {config.USER_COLLECTION} collection", MODULE_CONTEXT
    )
    try:
        from_date, end_date = stats.get_time_frame_for_analytics()

        ch_docs = (
            stats.fetch_data_for_language_trans_tokenized_for_scheduer_only(
                ch_collection, from_date, end_date
            )
        )

        saved_docs = stats.fetch_data_for_userwise_trans_user_tokenized(
            ch_collection, from_date, end_date
        )

        chdoc = [x for x in ch_docs]
        ch_doc_df=pd.json_normalize(chdoc)
        # ch_doc_df.dropna(subset=['orgID'], inplace=True)
        ch_doc_df.rename(columns = {'created_by':'userID'}, inplace = True)
        ch_doc_df.reset_index(drop=True, inplace=True)
        result_ch_doc = user_df.merge(ch_doc_df,indicator=False,how="right")
        result_ch_doc.to_csv(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1)

        savedoc = [x for x in saved_docs]
        save_doc_df=pd.json_normalize(savedoc)
        # save_doc_df.dropna(subset=['orgID'], inplace=True)
        save_doc_df.rename(columns = {'created_by':'userID'}, inplace = True)
        save_doc_df.reset_index(drop=True, inplace=True)
        result_save_doc = user_df.merge(save_doc_df,indicator=False,how="right")
        result_save_doc.to_csv(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2)

        result2 = result_save_doc.merge(result_ch_doc,indicator=False,how="right")
        result2.to_csv(config.DOWNLOAD_FOLDER + "/" + stats_file)

        log_info(f"Data written into files {weekly_cron_file_name1,weekly_cron_file_name2,stats_file}",MODULE_CONTEXT,)

        return
    except Exception as e:
        log_exception("Error in fetching the data: {}".format(e), MODULE_CONTEXT, e)
        msg = generate_email_notification(
            users, "could not get the data something went wrong : {}".format(e)
        )
        send_email(msg)
        log_exception(
            "Generated alert email in exception cron job : {}".format(str(e)),
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
    stats_file = config.STATS_FILE
    stats_file_copy = config.STATS_FILE_COPY
    # file_save = str(filename)[:-10]+'_USER_WISE_JUD_Org_level_Statistics.csv'
    if os.path.exists(
        config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1
    ) and os.path.exists(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2
    ) and os.path.exists(config.DOWNLOAD_FOLDER + "/" + stats_file):
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
            shutil.copyfile(
                config.DOWNLOAD_FOLDER + "/" + stats_file,
                config.DOWNLOAD_FOLDER + "/" + stats_file_copy,
            )
            data = "files copied"
            log_info(f"{data}", MODULE_CONTEXT)
        else:
            data = "Files Already in Directory"
            log_info(f"{data}", MODULE_CONTEXT)
    else:
        data = "Files Not found in Directory"
        log_info(f"{data}", MODULE_CONTEXT)

    return data


