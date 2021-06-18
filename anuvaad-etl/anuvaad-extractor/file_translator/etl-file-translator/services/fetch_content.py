import requests
from anuvaad_auditor import log_info

import config
from errors.errors_exception import FormatError


class FetchContent(object):
    def __init__(self, record_id):
        self.record_id = record_id
        self.block_trans_map = dict()

    def map_translated_text_with_blockid(self, page):
        for idx, text_block in enumerate(page['text_blocks']):
            trans_para = ''
            for id_ts, tokenized_sentence in enumerate(text_block['tokenized_sentences']):
                trans_para += tokenized_sentence['tgt']

            text_block['trans_text'] = trans_para
            block_id = text_block['block_id']
            self.block_trans_map[block_id] = trans_para

    def generate_url(self, record_id, start_page, end_page):
        url = config.FC_URL
        return url + '?record_id=' + record_id + '&start_page=' + str(start_page) + '&end_page=' + str(end_page)

    def fetch_content(self, record_id, start_page=0, end_page=0):
        log_info("fetch_content :: started fetching content for recordId: %s" % record_id, None)
        fetch_url = self.generate_url(record_id=record_id, start_page=start_page, end_page=end_page)

        # START:: TO TEST LOCALLY
        # HEADERS = {'auth-token': 'AUTH'}
        # rspn = requests.get(url=fetch_url, headers=HEADERS)
        # END :: TO TEST LOCALLY
        log_info('Fetch URL: %s' % fetch_url, None)

        rspn = requests.get(url=fetch_url)

        log_info("fetch_content :: received response for recordId: %s" % record_id, None)

        if rspn.status_code not in [200]:
            log_info('Response:: %s' % rspn.text, None)
            raise FormatError(400, "Fetch Content failed for recordId: %s" % record_id)

        return rspn.json()

    def generate_map_from_fetch_content_response(self):
        response = self.fetch_content(record_id=self.record_id)
        for page in response['data']:
            self.map_translated_text_with_blockid(page)
        log_info("generate_map_from_fetch_content_response :: Generated Map from fetch content.", None)
