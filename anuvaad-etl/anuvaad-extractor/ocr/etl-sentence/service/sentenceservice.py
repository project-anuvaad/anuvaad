 import pytesseract
from pytesseract import Output
import cv2
from pdf2image import convert_from_path
import os
import glob
from kafkawrapper.sentenceproducer import Producer
from utilities.sentenceutils import SentenceExtractionUtils
from repository.sentencerepository import SentenceRepository
from validator.sentencevalidator import SentenceValidator
from .sentencewflowservice import SentenceWflowService

import datetime as dt
import logging
import uuid
import pandas as pd
import numpy as np

log = logging.getLogger('file')
directory_path = os.environ.get('SA_DIRECTORY_PATH', r'C:\Users\Vishal\Desktop\anuvaad\Facebook LASER\resources\Input\length-wise')
res_suffix = 'response-'
man_suffix = 'manual-'
nomatch_suffix = 'nomatch-'
file_path_delimiter = '/'

sentence_topic = ""

repo = SentenceRepository()
producer = Producer()
util = SentenceExtractionUtils()
validator = SentenceValidator()
wflowservice = SentenceWflowService()


class SentenceService():

    # Service method to register the alignment job
    def register_job(self, object_in):
        job_id = util.generate_job_id()
        response = {"input": object_in, "jobID": job_id, "status": "START"}
        self.update_job_details(response, True)
        producer.push_to_queue(response, sentence_extraction_topic)
        return response

    # Service method to register the alignment job
    def wf_process(self, object_in):
        object_in["taskID"] = util.generate_task_id()
        self.update_job_details(object_in, True)
        result = self.process(object_in, True)
        return result

    # Method to update the status of job.
    def update_job_details(self, object_in, iscreate):
        if iscreate:
            repo.create_job(object_in)
            del object_in["_id"]
        else:
            jobID = object_in["jobID"]
            repo.update_job(object_in, jobID)

    # Service layer to update job status
    def update_job_status(self, status, object_in, cause):
        object_in["status"] = status
        object_in["endTime"] = str(dt.datetime.now())
        if cause is not None:
            object_in["cause"] = cause
        self.update_job_details(object_in, False)

    # Wrapper method to categorise sentences into MATCH, ALMOST-MATCH and NO-MATCH
    def process(self, object_in, iswf):
        log.info("Alignment process starts for job: " + str(object_in["jobID"]))

        path = object_in["input"]["path"]
        full_path = directory_path + file_path_delimiter + path


        object_in["status"] = "INPROGRESS"
        object_in["startTime"] = str(dt.datetime.now())
        self.update_job_details(object_in, False)

        try:
            #Tesseract ocr
            Ocrlinewise = SentenceExtractorV3(full_path)
            output_dict =Ocrlinewise.response
            if output_dict is not None:
                result = self.build_final_response( output_dict, object_in)
                self.update_job_details(result, False)
                if iswf:
                    wflowservice.update_wflow_details(result, object_in, None)
            else:
                self.update_job_status("FAILED", object_in, "Exception while writing the output")
                if iswf:
                    error = validator.get_error("OUTPUT_ERROR", "Exception while writing the output")
                    wflowservice.update_wflow_details(None, object_in, error)
            log.info("Sentences extracted Successfully! JOB ID: " + str(object_in["jobID"]))
        except Exception as e:
            log.error("Exception while writing the output: ", str(e))
            self.update_job_status("FAILED", object_in, "Exception while writing the output")
            if iswf:
                error = validator.get_error("OUTPUT_ERROR", "Exception while writing the output: " + str(e))
                wflowservice.update_wflow_details(None, object_in, error)
            return {}



    def build_final_response(self, output, object_in):
        result = {"status": "COMPLETED",
                  "jobID": object_in["jobID"],
                  "startTime": object_in["startTime"],
                  "endTime": str(dt.datetime.now()),
                  "input": object_in['input'],
                  "output": output}

        return result

    def search_jobs(self, job_id):
        return repo.search_job(job_id)





class SentenceExtractorV3:

    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.response = {'resolution': None, 'lines_data': []}
        self.language_map = {'Malayalam': 'mal', 'Tamil': 'tam', 'Devanagari': 'hin', 'Telugu': 'tel', 'Latin': 'eng'}
        self.margin_support = 4
        self.tesseract_conf = 0
        self.page_df = None
        self.pdf_to_image()
        self.pdf_language_detect()
        self.line_metadata()
        self.delete_images()

    # Process logic
    def pdf_to_image(self):
        self.pdf_name = self.pdf_path.split('/')[-1].split('.')[0]
        self.pdf_to_image_dir = 'tmp/images/' + self.pdf_name + str(uuid.uuid1())
        os.system('mkdir -p {0}'.format(self.pdf_to_image_dir))
        convert_from_path(self.pdf_path, output_folder=self.pdf_to_image_dir, fmt='jpeg', output_file='')
        os.system(' pdftohtml -s -c -p {0} {1}/c'.format(self.pdf_path, self.pdf_to_image_dir))
        self.num_of_pages = len(glob.glob(self.pdf_to_image_dir + '/*.png'))
        self.number_of_digits = len(str(self.num_of_pages))

    def pdf_language_detect(self):
        page_file = self.pdf_to_image_dir + '/-' + self.page_num_correction(0) + '.jpg'
        osd = pytesseract.image_to_osd(page_file)
        language_script = osd.split('\nScript')[1][2:]
        self.pdf_language = 'eng+' + self.language_map[language_script]
        print('Language detected {0}'.format(self.pdf_language))

    def mask_out_tables(self, table_detect_file, page):
        # loading and binarisation
        page_image = cv2.imread(page, 0)

        table_image = cv2.imread(table_detect_file, 0)
        table_image = table_image > 100
        table_image = table_image.astype(np.uint8) * 255
        # cv2.imwrite('1.png',table_image )

        tables = TableRepositories(table_image)
        y_scale = page_image.shape[0] / float(tables.input_image.shape[0])
        x_scale = page_image.shape[1] / float(tables.input_image.shape[1])
        table_rois = tables.response["response"]["tables"]

        Rects = RectRepositories(table_image)
        lines, _ = Rects.get_tables_and_lines()
        lines = self.scale_lines(lines, x_scale, y_scale)
        # print(tables.response)
        table_text = []
        if len(table_rois) != 0:
            # images extracted by pdftohtml and pdftoimage have different resolutions
            # y_scale = page_image.shape [0] / float (tables.input_image.shape [0])
            # x_scale = page_image.shape [1] / float (tables.input_image.shape [1])
            # if len(table_rois) != 0
            for table in table_rois:
                table = self.table_parser(table, page_image, y_scale, x_scale)
                x = table['x']
                y = table['y']
                w = table['w']
                h = table['h']
                table_text.append(table)
                print(x, y, w, h)
                # page_image [int (y):int (y + h), int (x):int (x + w)] = 255
                # print(table)
            return page_image, table_text, lines
        else:
            return page_image, [], lines

    def scale_lines(self, lines, x_scale, y_scale):
        len_lines = len(lines)
        if len_lines > 0:
            for i in range(len_lines):
                lines[i]['x'] = int(lines[i]['x'] * x_scale)
                lines[i]['y'] = int(lines[i]['y'] * y_scale)
                lines[i]['w'] = int(lines[i]['w'] * x_scale)
                lines[i]['h'] = int(lines[i]['h'] * y_scale)

        return lines

    def table_parser(self, table_response, page_image, y_scale, x_scale):
        cells = table_response['rect']
        origin_x = table_response['x'] * x_scale
        origin_y = table_response['y'] * y_scale

        cells_count = len(cells)
        if cells_count > 0:
            for i in range(cells_count):
                xstart = origin_x + table_response['rect'][i]['x'] * x_scale
                xend = xstart + table_response['rect'][i]['w'] * x_scale
                ystart = origin_y + table_response['rect'][i]['y'] * y_scale
                yend = ystart + table_response['rect'][i]['h'] * y_scale

                crop_fraction = page_image[int(ystart): int(yend), int(xstart):int(xend)]
                text = pytesseract.image_to_string(crop_fraction, lang=self.pdf_language, config='--psm 11')
                table_response['rect'][i] = {'x': int(xstart), 'y': int(ystart), 'w': int(xend - xstart),
                                             'h': int(yend - ystart), 'index': table_response['rect'][i]['index'],
                                             'text': text}
        table_response['x'] = int(origin_x)
        table_response['y'] = int(origin_y)
        table_response['w'] = int(table_response['w'] * x_scale)
        table_response['h'] = int(table_response['h'] * y_scale)

        return table_response

    def bloat_text(self, image):
        # converitng image to binary
        # image = image > 100
        # image = image.astype(np.uint8)
        # Bloating
        dist_transform = cv2.distanceTransform(image, cv2.DIST_L2, 5)
        ret, sure_fg = cv2.threshold(dist_transform, self.line_spacing_median * 0.5, 255, 0)
        # cv2.imwrite( str(uuid.uuid1()) +'.png' ,sure_fg)
        return sure_fg.astype(np.uint8)

    def sort_words(self, group, sorted_group=[], line_spacing=[], line=0):

        semi_height = group.iloc[0]['height'].mean() / 2.0
        check_y = group.iloc[0]['top']
        same_line = group[abs(group['top'] - check_y) < semi_height]
        next_lines = group[abs(group['top'] - check_y) >= semi_height]
        sort_lines = same_line.sort_values(by=['left'])
        sort_lines['line'] = line
        line_spacing.append(same_line['ymid'].mean())
        line += 1
        for index, row in sort_lines.iterrows():
            sorted_group.append(row)

        if len(next_lines) > 0:
            self.sort_words(next_lines, sorted_group, line_spacing, line)

        return sorted_group, line_spacing, line

    def sort_contours(self, contours_df, sorted_contours=[]):

        check_y = contours_df.iloc[0]['top']

        same_line = contours_df[abs(contours_df['top'] - check_y) < self.line_spacing_median * 0.5]
        next_lines = contours_df[abs(contours_df['top'] - check_y) >= self.line_spacing_median * 0.5]
        sort_lines = same_line.sort_values(by=['left'])
        for index, row in sort_lines.iterrows():
            sorted_contours.append(row)
        if len(next_lines) > 0:
            self.sort_contours(next_lines, sorted_contours)

        return sorted_contours

    def median_spacing(self, line_spacing):
        spacing = []
        for i in range(len(line_spacing) - 1):
            spacing.append(line_spacing[i + 1] - line_spacing[i])
        spacing_median = np.median(spacing)

        return spacing_median

    def find_and_sort_contours(self, bloated_image):
        contours = cv2.findContours(bloated_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours = contours[0] if len(contours) == 2 else contours[1]
        image_area = bloated_image.shape[0] * bloated_image.shape[1]
        contours_list = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            if (w * h) < (image_area * 0.95):
                contours_list.append([x, y, w, h])
        contours_df = pd.DataFrame(contours_list, columns=['left', 'top', 'width', 'height'])
        contours_df = contours_df.sort_values(by=['top'])
        sorted_contours = self.sort_contours(contours_df, [])
        sorted_contours = pd.DataFrame(sorted_contours).reset_index()

        return sorted_contours

    def extract_region(self, row):
        sub_text_df = self.page_df[
            (self.page_df['left'] >= row['left']) & (self.page_df['right'] <= (row['left'] + row['width'])) & (
                    self.page_df['top'] >= row['top']) & (self.page_df['bottom'] <= (row['top'] + row['height']))]

        return sub_text_df

    def line_start_and_end_stats(self):
        lines = self.page_df['line'].unique()
        lines_df = pd.DataFrame(lines, columns=['line'])
        lines_df['start'] = 0
        lines_df['end'] = 0
        for line in lines:
            sub_sorted_df = self.page_df[self.page_df['line'] == line]
            lines_df['start'][line] = sub_sorted_df['left'].min()
            lines_df['end'][line] = sub_sorted_df['right'].max()

        return lines_df

    def extraction_helper(self, input_image):
        # input_image = input_image > 125
        # input_image = input_image.astype(np.uint8)
        # cv2.imwrite('in.png',input_image*255)

        text_df = pytesseract.image_to_data(input_image, lang=self.pdf_language, output_type=Output.DATAFRAME)
        text_df = text_df[text_df['conf'] > self.tesseract_conf]
        if len(text_df) > 0:
            text_df['bottom'] = text_df['top'] + text_df['height']
            text_df['right'] = text_df['left'] + text_df['width']
            text_df['ymid'] = text_df['top'] + text_df['height'] * 0.5
            text_df = text_df.sort_values(by=['top'])
            text_df['text'] = text_df['text'].astype(str)
            text_df['line'] = None
            text_df['line_key'] = text_df['block_num'].astype(str) + text_df['par_num'].astype(str) + text_df[
                'line_num'].astype(str)
            self.median_height = text_df['height'].median()
            # Removing noise
            text_df = text_df[text_df['height'] > (self.median_height / 2.0)]
            text_df = text_df[text_df['text'] != ' ']

            sorted_df, line_spacing, line = self.sort_words(text_df, sorted_group=[], line_spacing=[], line=0)

            self.page_df = pd.DataFrame(sorted_df).reset_index()
            self.line_df = self.line_start_and_end_stats()
            self.line_spacing_median = self.median_spacing(line_spacing)
            bloated_image = self.bloat_text(input_image)
            self.sorted_contours = self.find_and_sort_contours(bloated_image)

            return 'Found text'
        else:
            return None

    def get_left_margin(self):
        line_start_distribution = np.array(sorted(self.line_df['start']))
        threshold = self.page_df['height'].median()
        # check support

        for starting_point in line_start_distribution:
            delta = abs(line_start_distribution - starting_point)
            margin_delta = delta < threshold
            if margin_delta.sum() > self.margin_support:
                break

        return starting_point

    def get_right_margin(self):
        line_end_distribution = np.array(sorted(self.line_df['end'], reverse=True))
        threshold = self.page_df['height'].median()
        # check support

        for end_point in line_end_distribution:
            delta = abs(line_end_distribution - end_point)
            margin_delta = delta < threshold
            if margin_delta.sum() > self.margin_support:
                break

        return end_point

    def word_conf(self, sub_df):
        word_conf = []
        for index, row in sub_df.iterrows():
            word_conf.append({row['text']: row['conf']})

        return word_conf

    def line_parser(self, page_number, pdf_index):
        lines_data = []
        # page_number = 1
        # pdf_index =   0

        for index, row in self.sorted_contours.iterrows():
            extracted_region = self.extract_region(row)
            blob_start = row['left']
            if len(extracted_region) > 0:
                # print(extracted_region)
                lines_in_blob = extracted_region['line'].unique()
                lines_count = len(lines_in_blob)
                first_line = lines_in_blob[0]
                last_line = lines_in_blob[-1]
                for line_id in lines_in_blob:
                    line = {}
                    same_line = extracted_region[extracted_region['line'] == line_id]
                    # print(same_line)
                    line['text'] = ' '.join(same_line['text'].values)
                    line['top'] = int(same_line['top'].min())
                    line['left'] = int(same_line['left'].min())
                    line['height'] = int(same_line['height'].max())
                    line['right'] = int(same_line['right'].max())
                    line['bottom'] = int(same_line['bottom'].max())

                    line['block_num'] = int(same_line['block_num'].iloc[0])
                    line['blob_id'] = int(index)
                    line['pdf_index'] = int(pdf_index)
                    line['page_no'] = int(page_number)
                    line['avrage_conf'] = float(same_line['conf'].mean())
                    line['page_line_index'] = int(line_id)
                    line['word_conf'] = self.word_conf(same_line)
                    line['visual_break'] = self.break_condition(line_id, last_line, page_number, lines_count)

                    pdf_index += 1
                    lines_data.append(line)

        return lines_data, pdf_index

    # visual_break
    def break_condition(self, line_id, last_line, page_number, lines_count):
        left_margin = self.get_left_margin()
        right_margin = self.get_right_margin()
        line_start = self.line_df['start'][line_id]
        line_ending = self.line_df['end'][line_id]
        start_delta = abs(line_start - left_margin)
        end_delta = abs(right_margin - line_ending)

        if line_id == last_line:
            # Adding exception for last line of page
            if (start_delta < 2 * self.median_height) & (end_delta < 2 * self.median_height):
                return 0
            else:
                return 1
        else:
            # First pages uses centre alignment fo headings and titles
            if page_number == 1:
                if start_delta > 3 * self.median_height:
                    if end_delta > 2 * self.median_height:
                        return 1
                else:
                    if lines_count > 3:
                        if end_delta > 2 * self.median_height:
                            return 1
            else:
                # Supreme court uses justified text alignment
                if start_delta < 2 * self.median_height:
                    if end_delta > 2 * self.median_height:
                        return 1
                else:
                    if abs(line_start - self.line_df['start'][line_id + 1]) > 2 * self.median_height:
                        if abs(line_ending - self.line_df['end'][line_id + 1]) > 2 * self.median_height:
                            return 1

        return 0

    def page_num_correction(self, page_num, num_size=None):
        padding = '0'
        if num_size == None:
            max_length = self.number_of_digits
        else:
            max_length = num_size
        corrction_factor = max_length - len(str(page_num + 1))
        return padding * corrction_factor + str(page_num + 1)

    def line_metadata(self):
        pdf_index = 0
        for page_num in range(self.num_of_pages):
            page_file = self.pdf_to_image_dir + '/-' + self.page_num_correction(page_num) + '.jpg'
            table_detect_file = self.pdf_to_image_dir + '/c' + self.page_num_correction(page_num, 3) + '.png'
            page_image, table_text, lines = self.mask_out_tables(table_detect_file, page_file)
            print(table_detect_file, page_file)
            #
            # try :
            #     check_for_text = self.extraction_helper(page_image)
            # except :
            #     check_for_text = None
            check_for_text = self.extraction_helper(page_image)

            if (check_for_text != None):
                line_data, pdf_index = self.line_parser(page_num + 1, pdf_index)
                self.response['lines_data'].append({'line_data': line_data, 'table_data': table_text, 'lines': lines})
            else:
                if (table_text != None):
                    self.response['lines_data'].append({'line_data': None, 'table_data': table_text, 'lines': lines})
                else:
                    self.response['lines_data'].append({'line_data': None, 'table_data': None, 'lines': lines})

            if self.response['resolution'] == None:
                self.response['resolution'] = {'x': page_image.shape[1], 'y': page_image.shape[0]}

    def delete_images(self):
        os.system('rm -r {0}'.format(self.pdf_to_image_dir))


class TableRepositories:
    def __init__(self, filepath, rect=None, SORT_METHOD='top-to-bottom', MAX_THRESHOLD_VALUE=255, BLOCK_SIZE=15,
                 THRESHOLD_CONSTANT=0, SCALE=15):
        '''
        :param filepath: absolute path of input image file , or a grayscale image as a numpy array
        :param SORT_METHOD: order of indexing of cells in a table
        :param BLOCK_SIZE: size of neighbourhood taken in account for calculating adaptive threshold
        :param THRESHOLD_CONSTANT: offset used for adaptive thresholding
        :param SCALE: size of pattern finding kernel (line elements in this case)
        '''

        self.image_path = filepath
        self.rect = rect
        self.response = {"response": {"tables": []}}
        self.MAX_THRESHOLD_VALUE = MAX_THRESHOLD_VALUE
        self.BLOCK_SIZE = BLOCK_SIZE
        self.THRESHOLD_CONSTANT = THRESHOLD_CONSTANT
        self.SCALE = SCALE
        self.SORT_METHOD = SORT_METHOD

        self.load_image()
        self.get_table_mask()
        self.table_indexing()

    def load_image(self):

        IMAGE_BUFFER = 10
        if type(self.image_path) == str:
            image = cv2.imread(self.image_path, 0)
        else:
            image = self.image_path
        self.input_image = image  # [self.rect['y']-IMAGE_BUFFER:self.rect['y']+self.rect['h']+IMAGE_BUFFER,self.rect['x']-IMAGE_BUFFER:self.rect['x']+self.rect['w']+IMAGE_BUFFER]
        self.slate = np.zeros(self.input_image.shape)

    def get_table_mask(self):
        # binarization of image
        filtered = cv2.adaptiveThreshold(~self.input_image, self.MAX_THRESHOLD_VALUE, cv2.ADAPTIVE_THRESH_MEAN_C,
                                         cv2.THRESH_BINARY, self.BLOCK_SIZE, self.THRESHOLD_CONSTANT)
        self.filtered = filtered
        # Finding srtuctre elements (horizontal and vertical lines)
        horizontal = filtered.copy()
        vertical = filtered.copy()

        horizontal_size = int(horizontal.shape[1] / self.SCALE)
        horizontal_structure = cv2.getStructuringElement(cv2.MORPH_RECT, (horizontal_size, 1))
        horizontal = cv2.erode(horizontal, horizontal_structure)
        horizontal = cv2.dilate(horizontal, horizontal_structure)

        # height_to_width_ratio = self.input_image.shape[0] / float(self.input_image.shape[1])
        # print(height_to_width_ratio)
        # vertical_size = int (vertical.shape [0] / (self.SCALE * height_to_width_ratio))
        # print(vertical_size , 'vetical_size')
        vertical_size = int(vertical.shape[0] / (self.SCALE * 4))
        vertical_structure = cv2.getStructuringElement(cv2.MORPH_RECT, (1, vertical_size))
        vertical = cv2.erode(vertical, vertical_structure)
        vertical = cv2.dilate(vertical, vertical_structure)

        # generating table borders
        self.mask = horizontal + vertical
        self.intersections = cv2.bitwise_and(horizontal, vertical)

    def sort_contours(self, cnts):
        contours_list = []
        for c in cnts:
            x, y, w, h = cv2.boundingRect(c)
            contours_list.append([x, y, w, h])
        contours_df = pd.DataFrame(contours_list, columns=['left', 'top', 'width', 'height'])
        contours_df = contours_df.sort_values(by=['top'])
        sorted_contours = self.sort_contours_helper(contours_df, [])
        return sorted_contours

    def sort_contours_helper(self, contours_df, sorted_contours=[]):

        check_y = contours_df.iloc[0]['top']
        spacing_threshold = 10  # contours_df.iloc[0]['height'] *0.5

        same_line = contours_df[abs(contours_df['top'] - check_y) < spacing_threshold]
        next_lines = contours_df[abs(contours_df['top'] - check_y) >= spacing_threshold]
        sort_lines = same_line.sort_values(by=['left'])
        for index, row in sort_lines.iterrows():
            sorted_contours.append(row)
        if len(next_lines) > 0:
            self.sort_contours_helper(next_lines, sorted_contours)

        return sorted_contours

    def draw_contours_index(self, contours, img):
        '''

        :param contours:  contours present cropped fraction of mask image
        :param img: cropped portion of mask image having one table (in case when input image has multiple tables )
        :return: image indexed with cell location, list of bounding box coordinates of every individual cell
        '''
        image_area = img.shape[0] * img.shape[1]
        draw_conts = np.zeros(img.shape)
        # margin = 10
        midpoints = []
        rects = []
        xi, yi = 0, 0
        # count_contours = len (contours)
        # for i in range (count_contours):
        for contour in contours:
            # cont_area = cv2.contourArea (contours [count_contours - i -1])
            # x1, y1, w1, h1 = cv2.boundingRect (contours [count_contours - i - 1])

            cont_area = contour['height'] * contour['width']
            x1, y1, w1, h1 = contour['left'], contour['top'], contour['width'], contour['height']

            area_ratio = cont_area / float(image_area)
            # print(area_ratio, i)

            # filtering out lines and noise
            if (area_ratio < 0.8) & (area_ratio > 0.003):
                midpoint = [int(x1 + w1 / 2), int(y1 + h1 / 2)]  # np.mean(contours[i],axis=0)
                midpoints.append(midpoint)
                if len(midpoints) > 1:
                    shift = midpoints[-1][1] - midpoints[-2][1]
                    shift = abs(shift)

                    # Detecting change in column by measuring difference in x coordinate of current and previous cell
                    # (cells already sored based on their coordinates)
                    if shift < 10:  # h1*0.5:
                        xi = xi + 1
                    else:
                        xi = 0
                        yi = yi + 1
                rects.append({"x": int(x1), "y": int(y1), "w": int(w1), "h": int(h1), "index": (int(yi), int(xi))})
                cv2.rectangle(draw_conts, (x1, y1), (x1 + w1, y1 + h1), 255, 1)
                cv2.putText(draw_conts, str((xi, yi)), (int(midpoint[0]), int(midpoint[1])),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.3, 255, 1, cv2.LINE_AA)
                # cv2.imwrite('out/slate' + str(i) + '.png' , draw_conts)
        return draw_conts, rects

    def end_point_correction(self, x, y, w, h, margin):
        # check if after adding margin the endopints are still inside the image

        ymax = self.input_image.shape[0]
        xmax = self.input_image.shape[1]

        if (y - margin) < 0:
            ystart = 0
        else:
            ystart = y - margin
        if (y + h + margin) > ymax:
            yend = ymax
        else:
            yend = y + h + margin
        if (x - margin) < 0:
            xstart = 0
        else:
            xstart = x - margin
        if (x + w + margin) > xmax:
            xend = xmax
        else:
            xend = x + w + margin

        return ystart, yend, xstart, xend

    def table_indexing(self):

        # list_of_tables = []
        image_area = float(self.input_image.shape[0] * self.input_image.shape[1])

        # finding all the tables in the image, cv2.RETR_EXTERNAL gives only the outermost border of an
        # enclosed figure.
        contours = cv2.findContours(self.mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = contours[0] if len(contours) == 2 else contours[1]

        if len(contours) > 0:
            # Indexing one table at a time
            for c in contours:
                x, y, w, h = cv2.boundingRect(c)
                area_ratio = (w * h) / image_area

                # Filtering for noise
                if (area_ratio < 0.9) & (area_ratio > 0.005):
                    margin = 2
                    # check if after adding margin the endopints are still inside the image
                    ystart, yend, xstart, xend = self.end_point_correction(x, y, w, h, margin)
                    table_dic = {"x": int(xstart), "y": int(ystart), "w": int(xend - xstart), "h": int(yend - ystart)}

                    crop_fraction = self.mask[ystart: yend, xstart:xend]

                    sub_contours = cv2.findContours(crop_fraction, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
                    sub_contours = sub_contours[0] if len(sub_contours) == 2 else sub_contours[1]
                    sorted_conts = self.sort_contours(sub_contours)

                    indexed_sub_image, rects = self.draw_contours_index(sorted_conts, img=crop_fraction)
                    table_dic['rect'] = rects
                    if len(rects) > 0:
                        self.response["response"]["tables"].append(table_dic)

                    # self.slate stores an image indexed with cell location for all available tables
                    self.slate[ystart: yend, xstart:xend] = indexed_sub_image

        # cv2.imwrite ('out/slate.png', self.slate)
        # cv2.imwrite ('out/mask.png', self.mask)
        # cv2.imwrite ('out/filtered.png', self.filtered)


class RectRepositories:
    def __init__(self, filepath):
        self.filepath = filepath

    def get_tables_and_lines(self):
        tables = []
        lines = []
        imgs = []

        img, intersection, shapes = self.get_contours_and_intersections()
        for idx, shape in enumerate(shapes):
            x, y, w, h = shape
            rect = self.get_external_coordinates(intersection[y:y + h, x:x + w])
            if len(rect) == 0:
                lines.append({'x': x, 'y': y, 'w': w, 'h': h})
            else:
                tables.append({'x': x, 'y': y, 'w': w, 'h': h})
        return lines, tables

    def get_external_coordinates(self, intersection):
        contours = cv2.findContours(intersection, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
        contours = contours[0] if len(contours) == 2 else contours[1]
        rects = []
        if len(contours) == 0:
            return rects

        contours, boundingBoxes = self.sort_contours(contours)
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            rects.append((x, y, w, h))
        return rects

    def get_contours_and_intersections(self):
        logging.debug(self.filepath)
        if type(self.filepath) == str:
            img = cv2.imread(self.filepath, 0)
        else:
            img = self.filepath

        MAX_THRESHOLD_VALUE = 255
        BLOCK_SIZE = 15
        THRESHOLD_CONSTANT = 0
        SCALE = 15

        filtered = cv2.adaptiveThreshold(~img, MAX_THRESHOLD_VALUE, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY,
                                         BLOCK_SIZE, THRESHOLD_CONSTANT)
        horizontal = filtered.copy()
        vertical = filtered.copy()

        horizontal_size = int(horizontal.shape[1] / SCALE)
        horizontal_structure = cv2.getStructuringElement(cv2.MORPH_RECT, (horizontal_size, 1))
        horizontal = cv2.erode(horizontal, horizontal_structure)
        horizontal = cv2.dilate(horizontal, horizontal_structure)

        vertical_size = int(vertical.shape[0] / SCALE)
        vertical_structure = cv2.getStructuringElement(cv2.MORPH_RECT, (1, vertical_size))
        vertical = cv2.erode(vertical, vertical_structure)
        vertical = cv2.dilate(vertical, vertical_structure)

        mask = horizontal + vertical
        contours = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = contours[0] if len(contours) == 2 else contours[1]
        intersection = cv2.bitwise_and(horizontal, vertical)

        rects = []
        if len(contours) == 0:
            return img, intersection, rects

        contours, boundingBoxes = self.sort_contours(contours)
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            rects.append((x, y, w, h))

        return img, intersection, rects

    def sort_contours(self, cnts, method="left-to-right"):
        reverse = False
        i = 0
        if method == "right-to-left" or method == "bottom-to-top":
            reverse = True
        if method == "top-to-bottom" or method == "bottom-to-top":
            i = 1
        boundingBoxes = [cv2.boundingRect(c) for c in cnts]
        (cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes), key=lambda b: b[1][i], reverse=reverse))
        return (cnts, boundingBoxes)
