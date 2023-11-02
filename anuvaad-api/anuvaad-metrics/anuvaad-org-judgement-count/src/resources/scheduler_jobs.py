from models import jud_stats
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
from datetime import datetime as dt
from datetime import timedelta as td
import os
import traceback
import pandas as pd
from utilities import (
    write_to_csv_user,
    generate_email_notification,
    send_email,
    write_to_csv_user_daily_crn,
)

from apscheduler.schedulers.background import BackgroundScheduler
import pytz
import shutil

IST = pytz.timezone("Asia/Kolkata")

# from apscheduler.schedulers.blocking import BlockingScheduler
# from apscheduler.triggers.cron import CronTrigger


# schedule_job = BlockingScheduler()


schedule_job = BackgroundScheduler(timezone="Asia/Kolkata")

stats = jud_stats()
usr_collection, ch_collection = stats.mongo_connection()
wfm_collection = stats.mongo_wfm_connection()
log_info("Mongo connected", MODULE_CONTEXT)

# class IST(datetime.tzinfo):
#     def utcoffset(self, dt):
#         return datetime.timedelta(hours=5, minutes=30)

#     def tzname(self, dt):
#         return "IST"

#     def dst(self, dt):
#         return datetime.timedelta()

# tz = IST()

# @.scheduled_job("interval", id="get_data_from_db", hours=6)
@schedule_job.scheduled_job(
    "cron", id="my_job_id1", day_of_week="mon-fri", hour="00,08,18", minute="00"
)
def get_trans_user_data_from_db_cron():
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

        start_date = stats.get_custom_timestamp(from_date)
        last_date = stats.get_custom_timestamp(end_date)
        wfm_docs = stats.translation_wfm_data(
            wfm_collection, start_date, last_date
        )

        wfm_docs = [x for x in wfm_docs]
        wfm_docs_df = pd.json_normalize(wfm_docs)
        wfm_docs_df.to_csv(config.DOWNLOAD_FOLDER + "/" + "workflow_docs.csv")

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
            users, f"could not get the data something went wrong : {traceback.format_exc()}"
        )
        send_email(msg)
        log_exception(
            "Generated alert email in exception cron job : {}".format(str(e)),
            MODULE_CONTEXT,
            e,
        )
        return

@schedule_job.scheduled_job(
    "cron", id="reviewer_data_job_1", day_of_week="mon-fri", hour="08,18", minute="00"
)
def get_reviewer_data(base=False):
    try:
        log_info("cron for reviewer data collection started", MODULE_CONTEXT)
        if base:
            # reviewer-data-base-file
            start_date = dt(*config.REVIEWER_DATA_BASE_SDATE)
            end_date = dt(*config.REVIEWER_DATA_BASE_EDATE)
            cur_file = config.DOWNLOAD_FOLDER + "/" + config.REVIEWER_DATA_BASEFILE
            log_info(f"opted reviewer-data-updation(base) : s_date={start_date}|e_date={end_date}", MODULE_CONTEXT)
        else:
            # reviewer-data-cron-file
            start_date = dt(*config.REVIEWER_DATA_BASE_EDATE) + td(days=1)
            end_date = dt.now()
            cur_file = config.DOWNLOAD_FOLDER + "/" + config.REVIEWER_DATA_CRONFILE
            log_info(f"opted reviewer-data-updation(cron) : s_date={start_date}|e_date={end_date}", MODULE_CONTEXT)
        start_date = stats.get_custom_timestamp(start_date)
        end_date = stats.get_custom_timestamp(end_date)
        # get data
        data = stats.get_reviewer_data_from_wfm(wfm_collection, start_date, end_date)
        log_info(f"fetch for reviewer-data complete", MODULE_CONTEXT)
        # delete existing file
        if os.path.exists(cur_file):
            os.remove(cur_file)
            log_info(f"deleted file : {cur_file}", MODULE_CONTEXT)
        # save data
        data.to_csv(cur_file, index=False)
        log_info(f"cron for reviewer-data ended with save-file : {cur_file}", MODULE_CONTEXT)
    except Exception as e:
        log_exception("Error in reviewer-data-cron : {}".format(e), MODULE_CONTEXT, e)
        msg = generate_email_notification(config.EMAIL_NOTIFIER, f"could not get the reviewer-data something went wrong : {e}")
        send_email(msg)
        log_exception(f"Generated alert email in exception reviewer-data-cron job : {str(e)}", MODULE_CONTEXT, e,)
    return None

def manual_start_reviewerdata_scheduler(base):
    for job in schedule_job.get_jobs():
        if job.id == "reviewer_data_job_1":
            job.func(base=base)

def manual_start_transuserdata_scheduler():
    for job in schedule_job.get_jobs():
        if job.id == "my_job_id1":
            job.func()

# static run (only once when server starts)
manual_start_reviewerdata_scheduler(base=True)
manual_start_reviewerdata_scheduler(base=False)
manual_start_transuserdata_scheduler()

# initiate cron job
schedule_job.start()
