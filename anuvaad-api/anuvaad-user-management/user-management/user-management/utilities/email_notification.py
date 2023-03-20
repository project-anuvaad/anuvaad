import smtplib
# from email.mime.text import MIMEText
from datetime import datetime
import pytz
import config
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
from email.message import EmailMessage
from email.utils import formataddr

IST = pytz.timezone("Asia/Kolkata")
# from email.mime.base import MIMEBase
# from email.mime.multipart import MIMEMultipart
# from email import encoders


def generate_email_notification(users):

    message = EmailMessage()
    sender = formataddr(
        (config.MAIL_SETTINGS["MAIL_SENDER_NAME"], config.MAIL_SETTINGS["MAIL_SENDER"])
    )
    # message = MIMEMultipart("alternative")
    message["From"] = sender
    message["To"] = users
    tdy_date = datetime.now(IST).strftime("%Y:%m:%d %H:%M:%S")
    # message["Subject"] = f" ANUVAAD - {tdy_date}"
    # filename = "./templates/stats.html"
    # html_ = open(filename).read()
    # html_ = html_.replace("{{downloadable_file1}}", sting_data)
    # html_ = MIMEText(html_, "html")
    # message.add_alternative(html_, subtype="html")
    # message.attach(html_)
    return message


def send_email(message):
    try:
        with smtplib.SMTP_SSL(
            config.MAIL_SETTINGS["MAIL_SERVER"], config.MAIL_SETTINGS["MAIL_PORT"]
        ) as server:
            server.login(
                config.MAIL_SETTINGS["MAIL_USERNAME"],
                config.MAIL_SETTINGS["MAIL_PASSWORD"],
            )
            # Prefer the modern send_message method
            server.send_message(message)
            server.close()
            del message["From"]
            del message["To"]
    except Exception as e:
        log_exception(
            "Exception while generating email notification for ANUVAAD : {}".format(
                e
            ),
            MODULE_CONTEXT,
            e,
        )
