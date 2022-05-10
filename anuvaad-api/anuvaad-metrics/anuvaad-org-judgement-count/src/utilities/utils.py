import os
import json
import config
import glob
import csv
import pandas as pd
import uuid

def write_to_csv(data_list,orgID,filename):
        if not data_list:
            return
        else:
            try: 
                #/opt/jud_stats.csv
                fieldnames = ["orgID","_id","doc_sent_count","avg_sent_bleu_score","total_time_spent","saved_sent_count"]
                if not os.path.exists(filename ):
                    f_output = open(filename ,'w')
                    dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)
                    dict_writer.writeheader()
                else:
                    f_output = open(filename ,'a')
                    dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)

                # with open(filename, 'a') as output_file:
                #     dict_writer = csv.DictWriter(output_file,fieldnames=fieldnames,extrasaction='ignore')
                #     dict_writer.writeheader()
                for data in data_list:
                    # print(data,"**")
                    data["orgID"] =orgID
                    dict_writer.writerow(data)
                return
            except Exception as e:
                print(str(e))
                pass



def org_level_csv(file_save,file1,file2):
    df = pd.read_csv(file1)
    df2 =pd.read_csv(file2)
    #print(df.columns)
    orgs1 =(df['orgID'].value_counts()).to_dict()
    #orgs2 =(df2['orgID'].value_counts()).to_dict()
    output =[]
    for org in orgs1:
        stats={}
        
        sub_df1 =  df[(df["orgID"] == org )]
        sub_df2 =  df2[(df2["orgID"] == org )]
        stats["ORG/HC"] = org
        stats["Total Sentences Translated"]=sub_df1["doc_sent_count"].sum()
        stats["Total Time Spent (millisecond)"]=sub_df1["total_time_spent"].sum()
        stats["Total Time Spent (minutes)"] = (stats["Total Time Spent (millisecond)"]/(1000*60))%60
        bleu_scores=(sub_df2.loc[sub_df2['total_time_spent'] > 0, 'avg_sent_bleu_score']).to_list()
        if not bleu_scores:
            stats["Average Sentence Bleu Score"]= None
        else:
            stats["Average Sentence Bleu Score"] = sum(bleu_scores)/len(bleu_scores)
            
        stats['Total Documents Translated'] = orgs1[org]
        #stats['Total Documents with Bleu & Saved Sentences'] = orgs2[org]
        stats["Total Saved Sentences"] =sub_df2["saved_sent_count"].sum()
        
        output.append(stats)

    fieldnames = ['ORG/HC','Total Documents Translated', 'Total Sentences Translated',
     'Total Time Spent (millisecond)','Total Time Spent (minutes)',
     'Average Sentence Bleu Score', 'Total Saved Sentences']
    with open(config.DOWNLOAD_FOLDER+'/'+file_save, 'a') as output_file:
                    dict_writer = csv.DictWriter(output_file,fieldnames=fieldnames,extrasaction='ignore')
                    dict_writer.writeheader()
                    for data in output:
                        dict_writer.writerow(data)


def write_to_csv_user(data_list,filename):
    if not data_list:
            return
    else:
        try: 
            #/opt/jud_stats.csv
            fieldnames = [ "_id","created_on","src_lang","tgt_lang","orgID","userName","name","is_active","userId","doc_sent_count","avg_sent_bleu_score","total_time_spent","saved_sent_count"]
            if not os.path.exists(filename ):
                f_output = open(filename ,'w')
                dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)
                dict_writer.writeheader()
            else:
                f_output = open(filename ,'a')
                dict_writer = csv.DictWriter(f_output, fieldnames=fieldnames)

            # with open(filename, 'a') as output_file:
            #     dict_writer = csv.DictWriter(output_file,fieldnames=fieldnames,extrasaction='ignore')
            #     dict_writer.writeheader()
            for data in data_list:
#                 data["orgID"] =orgID
                dict_writer.writerow(data)
            return
        except Exception as e:
            print(str(e))
            pass



def org_level_csv_user(file_save,file1,file2):
    df = pd.read_csv(file1)
    df2 =pd.read_csv(file2)
    #print(df.columns)
    orgs1 =(df['userName'].value_counts()).to_dict()
    print(orgs1)
    #orgs2 =(df2['orgID'].value_counts()).to_dict()
    output =[]
    for i,org in enumerate(orgs1):
        stats={}
        sub_df1 =  df[(df["userName"] == org )]
        sub_df2 =  df2[(df2["userName"] == org )]
        stats["userName"] = org
        stats["Org/HC"] = sub_df1["orgID"].sum()
        stats["is_active"] = sub_df1["is_active"]
        stats["Total Sentences Translated"]=sub_df1["doc_sent_count"].sum()
        stats["Total Time Spent (millisecond)"]=sub_df1["total_time_spent"].sum()
        stats["Total Time Spent (minutes)"] = (stats["Total Time Spent (millisecond)"]/(1000*60))%60
        bleu_scores=(sub_df2.loc[sub_df2['total_time_spent'] > 0, 'avg_sent_bleu_score']).to_list()
        if not bleu_scores:
            stats["Average Sentence Bleu Score"]= None
        else:
            stats["Average Sentence Bleu Score"] = sum(bleu_scores)/len(bleu_scores)
            
        stats['Total Documents Translated'] = orgs1[org]
        #stats['Total Documents with Bleu & Saved Sentences'] = orgs2[org]
        stats["Total Saved Sentences"] =sub_df2["saved_sent_count"].sum()
        
        output.append(stats)

    fieldnames = ['userName','Org/HC','is_active','Total Documents Translated', 'Total Sentences Translated',
     'Total Time Spent (millisecond)','Total Time Spent (minutes)',
     'Average Sentence Bleu Score', 'Total Saved Sentences']
    with open(file_save, 'a') as output_file:
                    dict_writer = csv.DictWriter(output_file,fieldnames=fieldnames,extrasaction='ignore')
                    dict_writer.writeheader()
                    for data in output:
                        dict_writer.writerow(data)