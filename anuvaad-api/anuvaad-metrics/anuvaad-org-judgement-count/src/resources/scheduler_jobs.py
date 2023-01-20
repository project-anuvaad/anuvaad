from models import jud_stats
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
import datetime
import os
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
# @schedule_job.scheduled_job(
#     "cron", id="my_job_id1", day_of_week="sun", hour="02", minute="00"
# )
def get_trans_user_data_from_db_weekly_crn():
    users = config.EMAIL_NOTIFIER
    log_info("fetch data started", MODULE_CONTEXT)
    # filename = uuid.uuid4().hex
    weekly_cron_file_name1 = config.WEEKLY_CRON_FILE_NAME1
    weekly_cron_file_name2 = config.WEEKLY_CRON_FILE_NAME2
    daily_cron_file_name1 = config.DAILY_CRON_FILE_NAME1
    daily_cron_file_name2 = config.DAILY_CRON_FILE_NAME2
    # file_save = str(filename)[:-10]+'_USER_WISE_JUD_Org_level_Statistics.csv'
    if os.path.exists(
        config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1
    ) and os.path.exists(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2):
        os.remove(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1)
        os.remove(config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2)
        os.remove(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name1)
        os.remove(config.DOWNLOAD_FOLDER + "/" + daily_cron_file_name2)
    else:
        msg = generate_email_notification(
            users, "could not get the data files not found"
        )
        send_email(msg)
        log_info(f"Generated alert email scheduler files not found ", MODULE_CONTEXT)
    user_docs = stats.get_all_users_active_inactive(usr_collection)
    log_info(
        f"Data returned from user {config.USER_COLLECTION} collection", MODULE_CONTEXT
    )
    try:
        from_date, end_date = stats.get_time_frame_for_analytics()
        done = 0
        while True:
            for doc in user_docs:
                # log_info(f'fetching details for {doc} userID',MODULE_CONTEXT)
                
                try:
                    

                        ch_docs = (
                            stats.fetch_data_for_language_trans_tokenized_for_scheduer_only(
                                ch_collection, doc, from_date, end_date
                            )
                        )
                        saved_docs = stats.fetch_data_for_userwise_trans_user_tokenized(
                            ch_collection, doc, from_date, end_date
                        )
                        # log_info(f'Details collected for for userID : {doc} ',MODULE_CONTEXT)
                        write_to_csv_user(
                            [x for x in ch_docs],
                            (config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name1),
                        )
                        write_to_csv_user(
                            [x for x in saved_docs],
                            (config.DOWNLOAD_FOLDER + "/" + weekly_cron_file_name2),
                        )
                except Exception as e:
                    log_exception(
                        "error in fetching the data : {}".format(str(e)),
                        MODULE_CONTEXT,
                        e,
                    )
            done = 1
            if done == 1:
                break
            log_info(
                f"Data written into files {weekly_cron_file_name1,weekly_cron_file_name2}",
                MODULE_CONTEXT,
            )
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
            log_info(
                f"files copied from weekly cron to daily cron {daily_cron_file_name1,daily_cron_file_name2}",
                MODULE_CONTEXT,
            )
            # msg = generate_email_notification(users, "weekly cron files copied : {}".format(e))
            # send_email(msg)
        else:
            log_info(
                f"files already there in folder {daily_cron_file_name1,daily_cron_file_name2}",
                MODULE_CONTEXT,
            )
            msg = generate_email_notification(
                users, "files already in directory cannot copy"
            )
            send_email(msg)
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


@schedule_job.scheduled_job(
    "cron", id="my_job_id2", day_of_week="mon-fri", hour="00,06,12,18", minute="00"
)
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


# schedule_job.add_job(
#     get_trans_user_data_from_db_daily_day_crn,
#     CronTrigger.from_crontab("49 03,06,12,18 * * *"),
# )
# schedule_job.add_job(
#     get_trans_user_data_from_db_weekly_crn, CronTrigger.from_crontab("00 00 * * 6")
# )


schedule_job.start()
