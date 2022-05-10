from datetime import datetime
import threading
import pandas as pd
import pytz
from models import CustomResponse, Status
from flask import  request
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
import config
import json
from db import connectmongo
from bson import json_util
import os
from flask import render_template
from utilities import write_to_csv,org_level_csv,write_to_csv_user,org_level_csv_user
import uuid
from flask_mail import Mail, Message
from flask import render_template
IST = pytz.timezone('Asia/Kolkata')
from flask import Flask
import csv
import requests

app  = Flask(__name__,template_folder='../templates')

app.config.update(config.MAIL_SETTINGS)
#creating an instance of Mail class
mail=Mail(app)

@app.route(config.API_URL_PREFIX + '/anuvaad-data/usr', methods=["POST"])
def get_user_org_details():
    body = request.get_json()
    # def get_details():
    log_info("FetchModelsResource_v2 api called",MODULE_CONTEXT)
    try:
        email = body['email']
        filename = uuid.uuid4().hex 
        file_name  = str(filename[:-10])+'_user_is_active_or_not.csv'
        log_info("get user/org details api called",MODULE_CONTEXT)
        mongo_connection = connectmongo()
        usr_collection = mongo_connection[config.USER_DB][config.USER_COLLECTION]
        usr = usr_collection.find({"is_active":{"$in":[True,False]}},{"userID":1,"userName":1,"orgID":1,"is_active":1,"_id":0})
        data = []
        for i in usr:
            data.append(i)
        data1 = pd.DataFrame(data)
        # sorted_df = data1.sort_values(by=['orgID','is_active'], ascending=True)
        data1.to_csv(config.DOWNLOAD_FOLDER+"/"+file_name)
        if type(email) == list:
            users = email
        else:
            users = [email]

        if os.path.exists(config.DOWNLOAD_FOLDER+'/'+file_name):
            with app.app_context():
                file_name = config.DOWNLOAD_FOLDER+'/'+file_name
                # file_name2 = config.DOWNLOAD_FOLDER+'/'+file_name2
                files = [file_name]   
                log_info("Generating email notification for found data !!!!",MODULE_CONTEXT)
                tdy_date    =   datetime.now(IST).strftime('%Y:%m:%d %H:%M:%S')
                
                msg         =   Message(subject=f" ANUVAAD - Stats {tdy_date}",sender=config.MAIL_SENDER,recipients=users)
                for i,j in enumerate(files):
                    with open(j) as fp:
                        msg.attach(files[i], "text/csv", fp.read())
                        msg.html    = render_template('stats.html',date=tdy_date,downloadable_file1 = "data successfullly generated " )
                mail.send(msg)
                log_info(f"Generated alert email ",MODULE_CONTEXT)
            log_info("filenames :{} ".format(file_name),MODULE_CONTEXT)
            out = CustomResponse(Status.ACCEPTED.value, {"msg":"please check your email for requested Stats","data":data})   
            return out.getres() 
        else:
            log_info("files : {} not found".format(file_name),MODULE_CONTEXT)
            with app.app_context():
                tdy_date    =   datetime.now(IST).strftime('%Y:%m:%d %H:%M:%S')
                msg         =   Message(subject=f" ANUVAAD - Stats {tdy_date}",sender=config.MAIL_SENDER,recipients=users)
                msg.html    = render_template('stats.html',date=tdy_date,downloadable_file1="could not get the data either role or org given is not present in the system please check your input and try again ")
                mail.send(msg)
                log_info(f"Generated alert email ",MODULE_CONTEXT)
                out = CustomResponse(Status.ACCEPTED.value, {"msg":"errored please check the input"})
                return out.getres()    
    except Exception as e:
        log_exception("Error in FetchSingleResource: {}".format(str(e)), MODULE_CONTEXT, e)

    # threading.Thread(target=get_details).start()
    # out = CustomResponse(Status.ACCEPTED.value, {"msg":"please check your email after some time for requested Stats"})                  
    # return out.getres()


@app.route(config.API_URL_PREFIX + '/anuvaad-data/org', methods=["POST"])
def get_orgs():
    body = request.get_json()
    try:
        email = body['email']
        if type(email) == list:
            users = email
        else:
            users = [email]
        filename = uuid.uuid4().hex 
        save_file = str(filename[:-10])+'_ORGS.csv'
        log_info("get org names api called",MODULE_CONTEXT)
        headers = {"Content-Type": "application/json"}
        request_url = generate_url(config.USERMANAGEMENT)
        log_info("Intiating request to fetch data from %s"%request_url, MODULE_CONTEXT)
        response = requests.get(request_url, headers = headers)
        response_data = response.content
        log_info("Received data from fetch-content end point of ocr-content-handler", MODULE_CONTEXT)
        dict_str = response_data.decode("UTF-8")
        dict_json_data = json.loads(dict_str)
        fields = ['code'] 
        datas = []
        with open(config.DOWNLOAD_FOLDER+'/'+save_file, 'w') as output_file: 
                dict_writer = csv.DictWriter(output_file,fieldnames=fields,extrasaction='ignore')
                dict_writer.writeheader()
                for data in dict_json_data['data']:
                    datas.append(data['code'])
                    dict_writer.writerow(data)
        with app.app_context():
                log_info("Generating email notification for found data !!!!",MODULE_CONTEXT)
                tdy_date    =   datetime.now(IST).strftime('%Y:%m:%d %H:%M:%S')
                msg         =   Message(subject=f" ANUVAAD - Stats {tdy_date}",sender=config.MAIL_SENDER,recipients=users)
                files = config.DOWNLOAD_FOLDER+'/'+save_file
                with open(files) as fp:
                    msg.attach(files, "text/csv", fp.read())
                    msg.html    = render_template('stats.html',date=tdy_date,downloadable_file1 = "data successfullly generated " )
                mail.send(msg)
                log_info(f"Generated alert email ",MODULE_CONTEXT)
        out = CustomResponse(Status.ACCEPTED.value, {"msg":"please check your email for requested Stats","org_names":datas})                  
        return out.getres()
    except Exception as e:
        log_exception("Can not fetch content in anuvaad-metrics:{}".format(str(e)), MODULE_CONTEXT, e)

def generate_url(url_pre):
    url_modified = url_pre + '/anuvaad/user-mgmt/v1/org/search'
    return url_modified

@app.route(config.API_URL_PREFIX + '/anuvaad-data', methods=["POST"])
def FetchJudgementCount():
    body = request.get_json()
    def FetchJudgementCountRole_org_Wise():
        log_info("FetchJudgementCount api called",MODULE_CONTEXT)
        mongo_connection = connectmongo()
        usr_collection = mongo_connection[config.USER_DB][config.USER_COLLECTION]
        ch_collection = mongo_connection[config.PREPROCESSING_DB][config.FILE_CONTENT_COLLECTION]
        filename = uuid.uuid4().hex 

        if body.get('org'):
            org = body['org']
            role = body['role']
            email= body['email']
            user_docs=  usr_collection.aggregate([{'$match': {"is_active" : True,"roles.roleCode":role,'orgID':org}},{ "$group":{"_id": "$orgID",'users':{ "$addToSet": '$userID' }}}])
            log_info(f"Data returned from {config.USER_COLLECTION} collection",MODULE_CONTEXT)      
            file_name1 = str(filename)[:-10]+'_'+str(role)+'_'+str(org)+'_JUD_STATS1'+'.csv'
            file_name2 = str(filename)[:-10]+'_'+str(role)+'_'+str(org)+'_JUD_STATS2'+'.csv'
            file_save = str(filename)[:-10]+'_'+str(role)+'_'+str(org)+'_JUD_Org_level_Statistics.csv'
        else:
            role = body['role']
            email= body['email']
            user_docs=  usr_collection.aggregate([{'$match': {"is_active" : True,"roles.roleCode":role,}},{ "$group":{"_id": "$orgID",'users':{ "$addToSet": '$userID' }}}])
            log_info(f"Data returned from {config.USER_COLLECTION} collection",MODULE_CONTEXT)   
            file_name1 = str(filename)[:-10]+'_'+str(role)+'_JUD_STATS1'+'.csv'
            file_name2 = str(filename)[:-10]+'_'+str(role)+'_JUD_STATS2'+'.csv'
            file_save = str(filename)[:-10]+'_'+str(role)+'_JUD_Org_level_Statistics.csv'

        try:
            for doc in user_docs:
                log_info(f'fetching details for {doc["_id"]} users',MODULE_CONTEXT)
                for user in doc["users"]:
                    ch_docs       = ch_collection.aggregate([{ '$match': {'$and': [{"created_by": user}, {'data_type':'text_blocks'}]} },
                                { '$unwind': "$data.tokenized_sentences" },
                                    { "$group": {
                                    "_id": "$job_id",
                                    "doc_sent_count": { "$sum": 1 },
                                        "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"}}}])

                    saved_docs       = ch_collection.aggregate([{ '$match': {'$and': [{"created_by": user}, {'data_type':'text_blocks'}]} },
                                            { '$unwind': "$data.tokenized_sentences" },
                                            { '$match': {"data.tokenized_sentences.save":True}},
                                            { "$group": {
                                                "_id": "$job_id",
                                                "saved_sent_count": { "$sum": 1 },
                                                "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"},
                                                "avg_sent_bleu_score":{"$avg": "$data.tokenized_sentences.bleu_score"}}}])

                    log_info(f'Details collected for for userID : {user}, in org {doc["_id"]} ',MODULE_CONTEXT)
                    ch_docs =[x for x in ch_docs]
                    write_to_csv(ch_docs,doc["_id"],(config.DOWNLOAD_FOLDER+'/'+file_name1))
                    write_to_csv([x for x in saved_docs],doc["_id"],(config.DOWNLOAD_FOLDER+'/'+file_name2))

            if type(email) == list:
                users = email
            else:
                users = [email]

            if os.path.exists(config.DOWNLOAD_FOLDER+'/'+(file_name1 and  file_name2)):
                org_level_csv(file_save,(config.DOWNLOAD_FOLDER+'/'+file_name1),(config.DOWNLOAD_FOLDER+'/'+file_name2))
                out = CustomResponse(Status.SUCCESS.value, {"files":[file_name1,file_name2]})
                with app.app_context():
                    file_name1 = config.DOWNLOAD_FOLDER+'/'+file_name1
                    file_name2 = config.DOWNLOAD_FOLDER+'/'+file_name2
                    file_save = config.DOWNLOAD_FOLDER+'/'+file_save
                    files = [file_name1,file_name2,file_save ]   
                    log_info("Generating email notification for found data !!!!",MODULE_CONTEXT)
                    tdy_date    =   datetime.now(IST).strftime('%Y:%m:%d %H:%M:%S')
                    
                    msg         =   Message(subject=f" ANUVAAD - Stats {tdy_date}",sender=config.MAIL_SENDER,recipients=users)
                    for i,j in enumerate(files):
                        with open(j) as fp:
                            msg.attach(files[i], "text/csv", fp.read())
                            msg.html    = render_template('stats.html',date=tdy_date,downloadable_file1 = "data successfullly generated " )
                    mail.send(msg)
                    log_info(f"Generated alert email ",MODULE_CONTEXT)
                log_info("filenames :{},{} ".format(file_name1,file_name2),MODULE_CONTEXT) 
            else:
                log_info("files : {} and {} not found".format(file_name1,file_name2),MODULE_CONTEXT)
                with app.app_context():
                    tdy_date    =   datetime.now(IST).strftime('%Y:%m:%d %H:%M:%S')
                    msg         =   Message(subject=f" ANUVAAD - Stats {tdy_date}",sender=config.MAIL_SENDER,recipients=users)
                    msg.html    = render_template('stats.html',date=tdy_date,downloadable_file1="could not get the data either role or org given is not present in the system please check your input and try again ")
                    mail.send(msg)
                    log_info(f"Generated alert email ",MODULE_CONTEXT)    

        except Exception as e:
            log_exception("Error in FetchJudgementCount: {}".format(e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['message'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getres()

    threading.Thread(target=FetchJudgementCountRole_org_Wise).start()
    out = CustomResponse(Status.ACCEPTED.value, {"msg":"please check your email after some time for requested Stats"})                  
    return out.getres()

@app.route(config.API_URL_PREFIX + '/anuvaad-data/user', methods=["POST"])
def FetchJudgementCount_user_wise():
    body = request.get_json()
    def FetchJudgementCountRole_user_org_Wise():
        log_info("FetchJudgementCount api called",MODULE_CONTEXT)
        mongo_connection = connectmongo()
        usr_collection = mongo_connection[config.USER_DB][config.USER_COLLECTION]
        ch_collection = mongo_connection[config.PREPROCESSING_DB][config.FILE_CONTENT_COLLECTION]
        filename = uuid.uuid4().hex 

        if body.get('email'):
            email= body['email']
            user_docs=  usr_collection.find({"is_active":{"$in":[True,False]}},{"userID":1,"name":1,"userName":1,"orgID":1,"is_active":1,"_id":0})
            log_info(f"Data returned from {config.USER_COLLECTION} collection",MODULE_CONTEXT)      
            file_name1 = str(filename)[:-10]+'_USER_WISE_JUD_STATS1'+'.csv'
            file_name2 = str(filename)[:-10]+'_USER_WISE_JUD_STATS2'+'.csv'
            file_save = str(filename)[:-10]+'_USER_WISE_JUD_Org_level_Statistics.csv'
        # else:
        #     role = body['role']
        #     email= body['email']
        #     user_docs=  usr_collection.aggregate([{'$match': {"is_active" : True,"roles.roleCode":role,}},{ "$group":{"_id": "$orgID",'users':{ "$addToSet": '$userID' }}}])
        #     log_info(f"Data returned from {config.USER_COLLECTION} collection",MODULE_CONTEXT)   
        #     file_name1 = str(filename)[:-10]+'_'+str(role)+'_JUD_STATS1'+'.csv'
        #     file_name2 = str(filename)[:-10]+'_'+str(role)+'_JUD_STATS2'+'.csv'
        #     file_save = str(filename)[:-10]+'_'+str(role)+'_JUD_Org_level_Statistics.csv'

        try:
            for doc in user_docs:
                log_info(f'fetching details for {doc} userID',MODULE_CONTEXT)
                ch_docs       = ch_collection.aggregate([{ '$match': {'$and': [{"created_by": str(doc['userID'])}, {'data_type':'text_blocks'}]} },
                            { '$unwind': "$data.tokenized_sentences" },
                             { "$group": {
                                "_id": "$job_id",
                                "created_on":{"$first":"$created_on"},
                                "src_lang":{"$first":"$src_lang"},
                                "tgt_lang":{"$first":"$tgt_lang"},
                                "doc_sent_count": { "$sum": 1 },
                                "total_time_spent":{"$sum": "$data.tokenized_sentences.time_spent_ms"}}},
                               {"$addFields":{"orgID":str(doc.get('orgID')),
                                "userName":str(doc['userName']),
                                "name":str(doc['name']),
                                "is_active":str(doc['is_active']),
                                "userId":str(doc['userID'])}}])

                saved_docs       = ch_collection.aggregate([{ '$match': {'$and': [{"created_by": str(doc['userID'])}, {'data_type':'text_blocks'}]} },
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

                log_info(f'Details collected for for userID : {doc} ',MODULE_CONTEXT)
                ch_docs =[x for x in ch_docs]
                write_to_csv_user(ch_docs,(config.DOWNLOAD_FOLDER+'/'+file_name1))
                write_to_csv_user([x for x in saved_docs],(config.DOWNLOAD_FOLDER+'/'+file_name2))

            if type(email) == list:
                users = email
            else:
                users = [email]

            if os.path.exists(config.DOWNLOAD_FOLDER+'/'+(file_name1 and  file_name2)):
                # org_level_csv_user(config.DOWNLOAD_FOLDER+"/"+file_save,(config.DOWNLOAD_FOLDER+'/'+file_name1),(config.DOWNLOAD_FOLDER+'/'+file_name2))
                out = CustomResponse(Status.SUCCESS.value, {"files":[file_name1,file_name2]})
                with app.app_context():
                    file_name1 = config.DOWNLOAD_FOLDER+'/'+file_name1
                    file_name2 = config.DOWNLOAD_FOLDER+'/'+file_name2
                    # file_save = config.DOWNLOAD_FOLDER+'/'+file_save
                    files = [file_name1,file_name2 ]   
                    log_info("Generating email notification for found data !!!!",MODULE_CONTEXT)
                    tdy_date    =   datetime.now(IST).strftime('%Y:%m:%d %H:%M:%S')
                    
                    msg         =   Message(subject=f" ANUVAAD - Stats {tdy_date}",sender=config.MAIL_SENDER,recipients=users)
                    for i,j in enumerate(files):
                        with open(j) as fp:
                            msg.attach(files[i], "text/csv", fp.read())
                            msg.html    = render_template('stats.html',date=tdy_date,downloadable_file1 = "data successfullly generated " )
                    mail.send(msg)
                    log_info(f"Generated alert email ",MODULE_CONTEXT)
                log_info("filenames :{},{} ".format(file_name1,file_name2),MODULE_CONTEXT) 
            else:
                log_info("files : {} and {} not found".format(file_name1,file_name2),MODULE_CONTEXT)
                with app.app_context():
                    tdy_date    =   datetime.now(IST).strftime('%Y:%m:%d %H:%M:%S')
                    msg         =   Message(subject=f" ANUVAAD - Stats {tdy_date}",sender=config.MAIL_SENDER,recipients=users)
                    msg.html    = render_template('stats.html',date=tdy_date,downloadable_file1="could not get the data either role or org given is not present in the system please check your input and try again ")
                    mail.send(msg)
                    log_info(f"Generated alert email ",MODULE_CONTEXT)    

        except Exception as e:
            log_exception("Error in FetchJudgementCount: {}".format(e),MODULE_CONTEXT,e)
            status = Status.SYSTEM_ERR.value
            status['message'] = str(e)
            out = CustomResponse(status, None)                  
            return out.getres()

    threading.Thread(target=FetchJudgementCountRole_user_org_Wise).start()
    out = CustomResponse(Status.ACCEPTED.value, {"msg":"please check your email after some time for requested Stats"})                  
    return out.getres()