import os
import config
import csv
import pandas as pd
from anuvaad_auditor import log_info
from utilities import MODULE_CONTEXT


def write_to_csv(data_list, orgID, filename):
    if not data_list:
        return
    else:
        try:
            fieldnames = [
                "orgID",
                "_id",
                "doc_sent_count",
                "avg_sent_bleu_score",
                "total_time_spent",
                "saved_sent_count",
            ]
            if not os.path.exists(filename):
                f_output = open(filename, "w")
                dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)
                dict_writer.writeheader()
            else:
                f_output = open(filename, "a")
                dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)

            for data in data_list:
                data["orgID"] = orgID
                dict_writer.writerow(data)
            return
        except Exception as e:
            print(str(e))
            pass


def convert_from_ms(milliseconds):

    seconds, millisecond = divmod(milliseconds, 1000)
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    days, hours = divmod(hours, 24)
    # seconds = seconds + millisecond/1000
    Total_time = f"{days} days, {hours} hours, {minutes} minutes"
    # Total_time = str((days)+" "+"days" , (hours) +" "+"hours" , (minutes) +" "+"minutes" , (seconds) +" "+"seconds" )
    # Total_time_spent=[str(time1[0])+'days'+' '+str(time1[1])+'hours'+' '+str(time1[2])+'minutes'+' '+str(time1[3])+'seconds'   for time1 in   total_time]
    return Total_time


def org_level_csv(file_save, file1, file2):
    df = pd.read_csv(file1)
    df2 = pd.read_csv(file2)
    # print(df.columns)
    orgs1 = (df["orgID"].value_counts()).to_dict()
    # orgs2 =(df2['orgID'].value_counts()).to_dict()
    output = []
    for org in orgs1:
        stats = {}

        sub_df1 = df[(df["orgID"] == org)]
        sub_df2 = df2[(df2["orgID"] == org)]
        stats["ORG/HC"] = org
        stats["Total Sentences Translated"] = sub_df1["doc_sent_count"].sum()
        stats["Total Time Spent (millisecond)"] = sub_df1["total_time_spent"].sum()
        avg_time = stats["Total Time Spent (millisecond)"]
        stats["Total Time Spent (D|H|M)"] = convert_from_ms(avg_time)
        bleu_scores = (
            sub_df2.loc[sub_df2["total_time_spent"] > 0, "avg_sent_bleu_score"]
        ).to_list()
        if not bleu_scores:
            stats["Average Sentence Bleu Score"] = None
        else:
            stats["Average Sentence Bleu Score"] = sum(bleu_scores) / len(bleu_scores)

        stats["Total Documents Translated"] = orgs1[org]
        # stats['Total Documents with Bleu & Saved Sentences'] = orgs2[org]
        stats["Total Saved Sentences"] = sub_df2["saved_sent_count"].sum()

        output.append(stats)

    fieldnames = [
        "ORG/HC",
        "Total Documents Translated",
        "Total Sentences Translated",
        "Total Time Spent (millisecond)",
        "Total Time Spent (D|H|M)",
        "Average Sentence Bleu Score",
        "Total Saved Sentences",
    ]
    with open(config.DOWNLOAD_FOLDER + "/" + file_save, "a") as output_file:
        dict_writer = csv.DictWriter(
            output_file, fieldnames=fieldnames, extrasaction="ignore"
        )
        dict_writer.writeheader()
        for data in output:
            dict_writer.writerow(data)


def write_to_csv_user(data_list, filename):
    if not data_list:
        return
    else:
        try:
            fieldnames = [
                "_id",
                "created_on",
                "src_lang",
                "tgt_lang",
                "orgID",
                "userName",
                "name",
                "is_active",
                "userId",
                "doc_sent_count",
                "avg_sent_bleu_score",
                "total_time_spent",
                "saved_sent_count",
            ]
            if not os.path.exists(filename):
                f_output = open(filename, "w")
                dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)
                dict_writer.writeheader()
            else:
                f_output = open(filename, "a+")
                # lines = open(filename, "r").read()
                dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)

            for data in data_list:
                # if data['_id'] in lines:
                #     log_info(f"the job_id already present skiping : {data['_id']}", MODULE_CONTEXT)
                # else:
                dict_writer.writerow(data)
                log_info(
                    f"{data['_id']}|{data['created_on']} : written to csv for weekly",
                    MODULE_CONTEXT,
                )
            return
        except Exception as e:
            print(str(e))
            pass


def write_to_csv_user_daily_crn(data_list, filename):
    if not data_list:
        return
    else:
        try:
            fieldnames = [
                "_id",
                "created_on",
                "src_lang",
                "tgt_lang",
                "orgID",
                "userName",
                "name",
                "is_active",
                "userId",
                "doc_sent_count",
                "avg_sent_bleu_score",
                "total_time_spent",
                "saved_sent_count",
            ]
            if not os.path.exists(filename):
                f_output = open(filename, "w")
                dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)
                dict_writer.writeheader()
            else:
                f_output = open(filename, "a+")
                lines = open(filename, "r").read()
                dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)

            for data in data_list:
                if data["_id"] in lines:
                    log_info(
                        f"the job_id already present skiping : {data['_id']}",
                        MODULE_CONTEXT,
                    )
                else:
                    dict_writer.writerow(data)
                    log_info(
                        f"{data['_id']}|{data['created_on']} : written to csv for daily",
                        MODULE_CONTEXT,
                    )
            return
        except Exception as e:
            print(str(e))
            pass


def org_level_csv_user(file_save, file1, file2):
    df = pd.read_csv(file1)
    df2 = pd.read_csv(file2)
    orgs1 = (df["userName"].value_counts()).to_dict()
    # orgs2 =(df2['orgID'].value_counts()).to_dict()
    output = []
    for i, org in enumerate(orgs1):
        stats = {}
        sub_df1 = df[(df["userName"] == org)]
        sub_df2 = df2[(df2["userName"] == org)]
        stats["userName"] = org
        stats["Org/HC"] = sub_df1["orgID"].sum()
        stats["is_active"] = sub_df1["is_active"]
        stats["Total Sentences Translated"] = sub_df1["doc_sent_count"].sum()
        stats["Total Time Spent (millisecond)"] = sub_df1["total_time_spent"].sum()
        avg_time = stats["Total Time Spent (millisecond)"]
        stats["Total Time Spent (D|H|M)"] = convert_from_ms(avg_time)
        bleu_scores = (
            sub_df2.loc[sub_df2["total_time_spent"] > 0, "avg_sent_bleu_score"]
        ).to_list()
        if not bleu_scores:
            stats["Average Sentence Bleu Score"] = None
        else:
            stats["Average Sentence Bleu Score"] = sum(bleu_scores) / len(bleu_scores)

        stats["Total Documents Translated"] = orgs1[org]
        # stats['Total Documents with Bleu & Saved Sentences'] = orgs2[org]
        stats["Total Saved Sentences"] = sub_df2["saved_sent_count"].sum()

        output.append(stats)

    fieldnames = [
        "userName",
        "Org/HC",
        "is_active",
        "Total Documents Translated",
        "Total Sentences Translated",
        "Total Time Spent (millisecond)",
        "Total Time Spent (D|H|M)",
        "Average Sentence Bleu Score",
        "Total Saved Sentences",
    ]
    with open(file_save, "a") as output_file:
        dict_writer = csv.DictWriter(
            output_file, fieldnames=fieldnames, extrasaction="ignore"
        )
        dict_writer.writeheader()
        for data in output:
            dict_writer.writerow(data)
