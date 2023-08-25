import hashlib
import logging

import zipfile

import os

import boto3 as boto3
from anuvaad_auditor import log_info, log_exception

import config
from config import aws_access_key, aws_secret_key, aws_bucket_name, aws_link_prefix

boto3.set_stream_logger(name='boto3', level=logging.ERROR)

mongo_instance = None


class S3BucketUtils(object):
    def __init__(self):
        self.s3_client = boto3.client('s3', aws_access_key_id=aws_access_key, aws_secret_access_key=aws_secret_key)

    # Utility to get tags out of an object
    def get_tags(self, d):
        for v in d.values():
            if isinstance(v, dict):
                yield from self.get_tags(v)
            elif isinstance(v, list):
                for entry in v:
                    if isinstance(entry, dict):
                        yield from self.get_tags(entry)
                    elif isinstance(entry, int) or isinstance(entry, float):
                        continue
                    else:
                        yield entry
            elif isinstance(v, int) or isinstance(v, float):
                continue
            else:
                yield v

    # def push_result_to_s3(self, result, service_req_no, size):
    #     log.info(f'Pushing results and sample to S3......')
    #     try:
    #         res_path = f'{shared_storage_path}{service_req_no}-ds.json'
    #         with open(res_path, 'w') as f:
    #             json.dump(result, f)
    #         res_path_aws = f'{aws_dataset_prefix}{service_req_no}-ds.json'
    #         upload = self.upload_file(res_path, res_path_aws)
    #         res_path_sample = f'{shared_storage_path}{service_req_no}-sample-ds.json'
    #         with open(res_path_sample, 'w') as f:
    #             json.dump(result[:size], f)
    #         res_path_sample_aws = f'{aws_dataset_prefix}{service_req_no}-sample-ds.json'
    #         upload = self.upload_file(res_path_sample, res_path_sample_aws)
    #         if upload:
    #             os.remove(res_path)
    #             os.remove(res_path_sample)
    #             return f'{aws_link_prefix}{res_path_aws}', f'{aws_link_prefix}{res_path_sample_aws}'
    #         else:
    #             return False, False
    #     except Exception as e:
    #         log.exception(f'Exception while pushing search results to s3: {e}', e)
    #         return False, False

    def delete_from_s3(self, file):
        log_info(f'Deleting {file} from S3......', None)
        s3_client = boto3.client('s3', aws_access_key_id=aws_access_key, aws_secret_access_key=aws_secret_key)
        try:
            objects = [{"Key": file}]
            response = s3_client.delete_objects(Bucket=aws_bucket_name, Delete={"Objects": objects})
            return response
        except Exception as e:
            log_exception('delete_from_s3: DELETION FAILED', None, e)
            return False

    # Utility to hash a file
    def hash_file(self, filename):
        h = hashlib.sha256()
        try:
            with open(filename, 'rb') as file:
                chunk = 0
                while chunk != b'':
                    chunk = file.read(1024)
                    h.update(chunk)
            return h.hexdigest()
        except Exception as e:
            log_exception("hash_file: HASH FAILED.", None, e)
            return None

    def upload_dir(self, dir_path):
        urls = []
        log_info(f"upload_dir:: UPLOADING dir to s3. DIR: {dir_path}", None)
        for root, dirs, files in os.walk(dir_path):
            for filename in files:
                if config.GENERATED_HTML_FILE_PATTERN in filename:
                    ExtraArgs = {'ContentType': 'text/html'}
                elif config.GENERATED_PDF_FILE_PATTERN in filename:
                    ExtraArgs = {'ContentType': 'application/pdf'}
                else:
                    ExtraArgs = ''

                s3_file_name = os.path.join(dir_path, filename)
                file_name = os.path.join(dir_path, filename)
                file_url = self.upload_file(file_name=file_name, s3_file_name=s3_file_name,
                                            ExtraArgs=ExtraArgs)
                if file_url:
                    urls.append(file_url)

        log_info(f"upload_dir:: UPLOADED dir to s3. DIR: {dir_path}", None)
        return urls

    # Utility to upload files to Anuvaad1 S3 Bucket
    def upload_file(self, file_name, s3_file_name, ExtraArgs=''):
        if s3_file_name is None:
            s3_file_name = file_name
        log_info(f'Pushing {file_name} to S3 at {s3_file_name} ......', None)
        try:
            if ExtraArgs:
                self.s3_client.upload_file(file_name, aws_bucket_name, s3_file_name, ExtraArgs=ExtraArgs)
            else:
                self.s3_client.upload_file(file_name, aws_bucket_name, s3_file_name)

            return f'{aws_link_prefix}{s3_file_name}'
        except Exception as e:
            log_exception(f'Exception while pushing to s3: {e}', None, e)
        return False

    # Utility to download files to ULCA S3 Bucket
    def download_file(self, s3_file_name):
        s3_client = boto3.client('s3', aws_access_key_id=aws_access_key, aws_secret_access_key=aws_secret_key)
        try:
            response = s3_client.download_file(aws_bucket_name, s3_file_name)
            return response
        except Exception as e:
            log_exception("download_file: EXCEPTION ", None, e)
            return False
        
    def compress(self,file_names,zip_name):

        paths = config.download_folder

        # Select the compression mode ZIP_DEFLATED for compression
        # or zipfile.ZIP_STORED to just store the file
        compression = zipfile.ZIP_DEFLATED

        # create the zip file first parameter path/name, second mode
        # zip_name =str(job)+".zip"
        zip_path = os.path.join(paths,zip_name)
        zf = zipfile.ZipFile(zip_path, mode="w")
        try:
            for file_name in file_names:
                # Add file to the zip file
                # first parameter file to zip, second filename in zip
                zf.write(paths +"/"+ file_name, file_name,compress_type=compression)

        except FileNotFoundError:
            print("An error occurred")
        finally:
            # Don't forget to close the file!
            zf.close()

