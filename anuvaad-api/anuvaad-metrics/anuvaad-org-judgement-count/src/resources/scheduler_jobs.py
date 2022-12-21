from models import jud_stats
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
import os
from utilities import write_to_csv_user, generate_email_notification, send_email
from apscheduler.schedulers.background import BackgroundScheduler
import pytz

IST = pytz.timezone("Asia/Kolkata")


schedule_job = BackgroundScheduler()

stats = jud_stats()
usr_collection, ch_collection = stats.mongo_connection()
log_info("Mongo connected", MODULE_CONTEXT)


@schedule_job.scheduled_job("interval", id="get_data_from_db", hours=6)
def get_trans_user_data_from_db():
    users = ["srihari.nagaraj@tarento.com"]
    log_info("fetch data started", MODULE_CONTEXT)
    # filename = uuid.uuid4().hex
    file_name1 = "language_wise_JUD_STATS1.csv"
    file_name2 = "language_wise_JUD_STATS2.csv"
    # file_save = str(filename)[:-10]+'_USER_WISE_JUD_Org_level_Statistics.csv'
    if os.path.exists(config.DOWNLOAD_FOLDER + "/" + file_name1) and os.path.exists(
        config.DOWNLOAD_FOLDER + "/" + file_name2
    ):
        os.remove(config.DOWNLOAD_FOLDER + "/" + file_name1)
        os.remove(config.DOWNLOAD_FOLDER + "/" + file_name2)
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
        for doc in user_docs:
            # log_info(f'fetching details for {doc} userID',MODULE_CONTEXT)
            ch_docs = stats.fetch_data_for_language_trans_tokenized_for_scheduer_only(
                ch_collection, doc, from_date, end_date
            )
            saved_docs = stats.fetch_data_for_userwise_trans_user_tokenized(
                ch_collection, doc, from_date, end_date
            )
            # log_info(f'Details collected for for userID : {doc} ',MODULE_CONTEXT)
            write_to_csv_user(
                [x for x in ch_docs], (config.DOWNLOAD_FOLDER + "/" + file_name1)
            )
            write_to_csv_user(
                [x for x in saved_docs], (config.DOWNLOAD_FOLDER + "/" + file_name2)
            )
        log_info(f"Data written into files {file_name1,file_name2}", MODULE_CONTEXT)
        return
    except Exception as e:
        log_exception("Error in fetching the data: {}".format(e), MODULE_CONTEXT, e)
        msg = generate_email_notification(
            users, "could not get the data something went wrong : {}".format(e)
        )
        send_email(msg)
        log_exception(
            "Generated alert email in exception scdeuler job : {}".format(str(e)),
            MODULE_CONTEXT,
            e,
        )
        return


schedule_job.start()
