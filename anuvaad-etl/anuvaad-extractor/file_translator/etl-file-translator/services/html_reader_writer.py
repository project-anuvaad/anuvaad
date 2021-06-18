import os

from bs4 import BeautifulSoup

import config
from errors.errors_exception import FileErrors


class HtmlReaderWriter(object):
    def __init__(self, input_filename, html_file_path, html_file_out_path):
        self.file_name_without_ext = os.path.splitext(input_filename)[0]
        self.html_file_path = html_file_path
        self.html_file_out_path = html_file_out_path

    def read_html_file(self, html_path):
        if os.path.exists(html_path):
            with open(html_path, "rb") as html:
                return BeautifulSoup(html, 'html.parser')
        else:
            raise FileErrors("INPUT_FILE_DOESNT_EXISTS", "read_html_file : File Doesn't exist")

    def find_tags_in_html_file(self, soup_obj, tags):
        return soup_obj.find_all(name=tags)

    def get_img_url(self, img_file_name):
        image_url = config.ENV_HOST_URL + 'download/' + img_file_name
        return image_url

    def convert_img_name_to_url(self):
        soup = self.read_html_file(self.html_file_path)
        search_on_tags = 'img'
        tags = self.find_tags_in_html_file(soup_obj=soup, tags=search_on_tags)
        for tag in tags:
            img_file_name = tag['src']
            image_url = self.get_img_url(img_file_name=img_file_name)
            tag['src'] = image_url
        return soup

    def write_html(self, soup):

        with open(self.html_file_out_path, "w+", encoding='utf-8') as file:
            file.write(str(soup))
            file.close()

        return self.html_file_out_path

    def alter_img_src_to_url_and_save(self):
        soup = self.convert_img_name_to_url()
        html_file_out_path = self.write_html(soup=soup)
        return html_file_out_path
