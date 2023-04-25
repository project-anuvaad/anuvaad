import json
from urllib.parse import urljoin

import requests
from anuvaad_auditor import log_info

import config
# from errors.errors_exception import FormatError, FileErrors

class FormatError(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message

    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __str__(self):
        return self.__class__.__name__ + ': ' + self.message


class FileErrors(Exception):
    def __init__(self, code, message):
        self._code = code
        self._message = message

    @property
    def code(self):
        return self._code

    @property
    def message(self):
        return self._message

    def __repr__(self):
        return {"code": self.code, "message": self.__class__.__name__ + ': ' + self.message}

class FetchContent(object):
    # def __init__(self, record_id, json_data):
    #     self.json_data = json_data
    #     self.record_id = record_id
    #     self.block_trans_map = dict()

    def map_translated_text_with_blockid(self, page_id, page):
        if not page:
            log_info(f"map_translated_text_with_blockid: BLANK PAGE: {page_id}, so skipping the process", self.json_data)
            return
        for idx, text_block in enumerate(page['text_blocks']):
            trans_para = ''
            try:

                for id_ts, tokenized_sentence in enumerate(text_block['tokenized_sentences']):
                    trans_para += tokenized_sentence['tgt']

                text_block['trans_text'] = trans_para
                block_id = text_block['block_id']
                self.block_trans_map[block_id] = trans_para
            except Exception as e:
                log_info(
                    f'map_translated_text_with_blockid:: Got Exception while processing PAGE NO: {page_id}, PARA NO: {idx}', self.json_data)

    def generate_url_for_fetch_content(self, record_id, start_page, end_page):
        url = urljoin(config.CH_URL, config.FETCH_CONTENT_ENDPOINT)
        return url + '?record_id=' + record_id + '&start_page=' + str(start_page) + '&end_page=' + str(end_page)

    def fetch_content(self, record_id, start_page=0, end_page=0):
        log_info("fetch_content :: started fetching content for recordId: %s" % record_id, self.json_data)
        fetch_url = self.generate_url_for_fetch_content(record_id=record_id, start_page=start_page, end_page=end_page)

        # START:: TO TEST LOCALLY
        # HEADERS = {'content-type': 'application/json', 'auth-token': 'AUTH'}
        # rspn = requests.get(url=fetch_url, headers=HEADERS)
        # END :: TO TEST LOCALLY
        log_info('Fetch URL: %s' % fetch_url, self.json_data)

        rspn = requests.get(url=fetch_url)

        log_info("fetch_content :: received response for recordId: %s" % record_id, self.json_data)

        if rspn.status_code not in [200, 201]:
            log_info('Response:: %s' % rspn.text, None)
            raise FormatError(400, "Fetch Content failed for recordId: %s" % record_id)

        return rspn.json()

    def generate_map_from_fetch_content_response(self):
        response = self.fetch_content(record_id=self.record_id)
        for page_id, page in enumerate(response['data']):
            log_info(f"generate_map_from_fetch_content_response:: Processing page {page_id}", self.json_data)
            self.map_translated_text_with_blockid(page_id=page_id, page=page)
        log_info("generate_map_from_fetch_content_response :: Generated Map from fetch content.", self.json_data)

    def store_reference_link(self, job_id='', location=''):
        # Checking if any one of the para is blank or None
        # if len([para for para in [job_id, location] if not para]) > 0:
        #     raise FileErrors("INPUT_PARA_BLANK", "Input para can not be empty for store_reference_link")

        body = json.dumps({"records": [{"job_id": job_id, "file_link":{"parallel_doc":location}}]})

        store_url = urljoin(config.CH_URL, config.REF_LINK_STORE_ENDPOINT)
        log_info(f"store_reference_link:: STORE URL: {store_url}", None)
        log_info(f"store_reference_link:: STORE BODY:{body}, TYPE: {type(body)}", None)

        log_info(f'Store Reference Link STARTED for job id: {job_id}', None)

        # LOCAL TEST
        # headers = {'content-type': 'application/json', 'auth-token': ''}
        # LOCAL TEST

        headers = {'content-type': 'application/json'}

        rspn = requests.post(url=store_url, data=body, headers=headers)

        log_info(f'Store Reference Link ENDED for job id: {job_id}', None)

        # set_status = None
        if rspn.status_code in [200,201]:
            change_status = json.dumps({
                "granularity":["parallelDocumentUpload"],
                "jobID": job_id,
                })
            setGranularity = urljoin(config.WFM_GRANULARITY, config.WFM_GRANULARITY_END_POINT)
            set_status = requests.post(url=setGranularity, data=change_status, headers=headers)
            if set_status.status_code not in [200,201]:
                log_info('Response:: %s' % set_status.text, None)
                raise FormatError(400, f"Granularity Update for Parallel Doc failed for job Id: {job_id}")

        if rspn.status_code not in [200, 201]:
            log_info('Response:: %s' % rspn.text, None)
            raise FormatError(400, f"Store Reference Link failed for job Id: {job_id}")

        return rspn.json()
