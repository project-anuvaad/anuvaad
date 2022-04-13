import pandas as pd
import numpy as np
from PIL import Image, ImageDraw, ImageFont


class BlockBreak:

    def __init__(self, page_width, page_df, page_num, config):

        #self.page_image = np.array(page_image)
        self.page_df = page_df
        self.response = {}
        self.page_num = page_num
        self.config = config
        self.margin_support = 3
        self.page_width = page_width

    def median_spacing(self, line_spacing):
        spacing = []
        for i in range(len(line_spacing) - 1):
            spacing.append(line_spacing[i + 1] - line_spacing[i])
        spacing_median = np.median(spacing)

        return spacing_median

    def extract_region(self, row):
        sub_text_df = self.page_df[
            (self.page_df['text_left'] >= row['left']) & (
                        self.page_df['text_right'] <= (row['left'] + row['width'])) & (
                    self.page_df['text_top'] >= row['top']) & (
                        self.page_df['text_bottom'] <= (row['top'] + row['height']))]

        return sub_text_df

    def line_start_and_end_stats(self):
        lines = list(range(len(self.page_df)))
        lines_df = pd.DataFrame(lines, columns=['line'])
        lines_df['start'] = self.page_df['text_left']
        lines_df['end'] = self.page_df['text_right']
        return lines_df

    def get_left_margin(self):
        line_start_distribution = np.array(sorted(self.line_df['start']))
        threshold = self.page_df['font_size'].median()
        # check support

        for starting_point in line_start_distribution:
            delta = abs(line_start_distribution - starting_point)
            margin_delta = delta < threshold
            if margin_delta.sum() > self.margin_support:
                break

        return starting_point

    def get_right_margin(self):
        line_end_distribution = np.array(sorted(self.line_df['end'], reverse=True))
        threshold = self.page_df['font_size'].median()
        # check support

        for end_point in line_end_distribution:
            delta = abs(line_end_distribution - end_point)
            margin_delta = delta < threshold
            if margin_delta.sum() > self.margin_support:
                break

        return end_point

    '''

    def find_and_sort_contours(self,bloated_image):
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



    def bloat_text(self):
        # converitng image to binary
        #image = image > 100
        #image = image.astype(np.uint8)
        # Bloating
        ystart = self.page_df['text_top'].min()
        yend   = self.page_df['text_bottom'].max()
        xstart = self.page_df['text_left'].min()
        xend   = self.page_df['text_right'].max()

        crop   = self.page_image[int(ystart): int(yend), int(xstart):int(xend)]
        image  = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        dist_transform = cv2.distanceTransform(image, cv2.DIST_L2, 5)
        ret, sure_fg = cv2.threshold(dist_transform, self.line_spacing_median * 0.5, 255, 0)
        #cv2.imwrite( str(uuid.uuid1()) +'.png' ,sure_fg)
        return sure_fg.astype(np.uint8)


    def sort_contours(self, contours_df, sorted_contours=None):

        if sorted_contours is None:
            sorted_contours = []
        check_y = contours_df.iloc[0]['top']

        same_line = contours_df[abs(contours_df['top'] - check_y) < self.line_spacing_median*0.5]
        next_lines = contours_df[abs(contours_df['top'] - check_y) >= self.line_spacing_median*0.5]
        sort_lines = same_line.sort_values(by=['left'])
        for index, row in sort_lines.iterrows():
            sorted_contours.append(row)
        if len(next_lines) > 0:
            self.sort_contours(next_lines, sorted_contours)

        return sorted_contours

    '''

    def line_start_and_end_stats(self):
        lines = list(range(len(self.page_df)))
        lines_df = pd.DataFrame(lines, columns=['line'])
        lines_df['start'] = self.page_df['text_left']
        lines_df['end'] = self.page_df['text_right']
        return lines_df

    def get_left_margin(self):
        line_start_distribution = np.array(sorted(self.line_df['start']))
        threshold = self.page_df['font_size'].median()
        # check support

        for starting_point in line_start_distribution:
            delta = abs(line_start_distribution - starting_point)
            margin_delta = delta < threshold
            if margin_delta.sum() > self.margin_support:
                break

        return starting_point

    def get_right_margin(self):
        line_end_distribution = np.array(sorted(self.line_df['end'], reverse=True))
        threshold = self.page_df['font_size'].median()
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

    def extraction_helper(self):

        if len(self.page_df) > 0:
            self.page_df['text_bottom'] = self.page_df['text_top'] + self.page_df['text_height']
            self.page_df['text_right'] = self.page_df['text_left'] + self.page_df['text_width']
            self.page_df['text'] = self.page_df['text'].astype(str)

            lines = list(range(len(self.page_df)))
            self.page_df['line'] = lines

            self.median_height = self.page_df['font_size'].median()

            self.page_df = self.page_df.reset_index()
            self.line_df = self.line_start_and_end_stats()
            self.line_spacing_median = self.median_spacing(self.page_df['text_top'])
            # bloated_image = self.bloat_text()
            # self.sorted_contours = self.find_and_sort_contours(bloated_image)
            # self.sorted_contours['left'] += self.page_df['text_left'].min()
            # self.sorted_contours['top'] +=  self.page_df['text_top'].min()

            return 'Found text'
        else:
            return None

    '''
    def line_parser(self,page_number):
        lines_data = []

        # page_number = 1
        # pdf_index =   0
        last_line   = len(self.page_df) -1
        for index, row in self.sorted_contours.iterrows():
            extracted_region = self.extract_region(row)
            if len(extracted_region) > 0:
                lines_in_blob = extracted_region['line'].unique()
                lines_count = len(lines_in_blob)
                first_line = lines_in_blob[0]
                last_line = lines_in_blob[-1]
                for line_id in lines_in_blob:
                    line = {}
                    line['visual_break'] = self.break_condition( line_id, last_line, page_number, lines_count)
                    line['blob_id']      = index
                    line['data']         = self.page_df.iloc[line_id]

                    lines_data.append(line)

        return lines_data
    '''

    def line_parser(self, page_number):
        lines_data = []

        last_line = len(self.page_df) - 1
        for index, row in self.page_df.iterrows():
            line = {}
            line['visual_break'] = self.break_condition(line_id=index, line_width=row['text_width'],
                                                        last_line=last_line, page_number=page_number,
                                                        lines_count=last_line + 1)
            # line['blob_id']     = index
            line['data'] = row[
                ['xml_index', 'text_top', 'text_left', 'text_width', 'text_height', 'text', 'font_size', 'font_family',
                 'font_color', 'children']]

            lines_data.append(line)

        return lines_data

    def line_metadata(self):
        check_for_text = self.extraction_helper()

        if (check_for_text != None):
            lines_data = self.line_parser(self.page_num)
            self.response['lines_data'] = lines_data
        else:
            self.response['lines_data'] = None

    # visual_break for judgement documents
    def break_condition(self, line_id, line_width, last_line, page_number, lines_count):
        left_margin = self.get_left_margin()
        right_margin = self.get_right_margin()
        line_start = self.line_df['start'][line_id]
        line_ending = self.line_df['end'][line_id]
        start_delta = abs(line_start - left_margin)
        end_delta = abs(right_margin - line_ending)

        # print(page_number)

        if line_id == last_line:
            # Adding exception for last line of page
            #if (start_delta < 3 * self.median_height) & (end_delta < 2 * self.median_height):
            #return 0
            #else:
            return 1
        #else:
            # First pages uses centre alignment for headings and titles
            # if page_number == 1:
            '''
            if (line_width / self.page_width) < self.config['width_threshold']:
                # print(line_width / self.page_width)
                if page_number == 1:
                    return 1
                else:
                    if (line_width / self.page_width) < (self.config['width_threshold'] / 2):
                        return 1  '''

            # Supreme court uses justified text alignment
            # if start_delta < 2 * self.median_height:
            #     if end_delta > 2 * self.median_height:
            #         return 1
            #     else :
            #         return 0
            #
            # else:
            if abs(line_start - self.line_df['start'][line_id + 1]) > 2 * self.median_height:
                if abs(line_ending - self.line_df['end'][line_id + 1]) > 2 * self.median_height:
                    return 1

        return 0


def group_by_visual_break(block_df):
    text_chunks = ['']
    chunk_data = [None]
    text_chunks = text_chunks * len(block_df)
    chunk_data = chunk_data * len(block_df)
    visual_index = 0
    for index, row in block_df.iterrows():
        text_chunks[visual_index] = text_chunks[visual_index] + ' ' + row['data']['text']
        if chunk_data[visual_index] == None:
            chunk_data[visual_index] = []
            chunk_data[visual_index].append(block_df['data'][index])
        else:
            chunk_data[visual_index].append(block_df['data'][index])
        visual_index += row['visual_break']

    text_chunks = [text for text in text_chunks if text != '']
    chunk_data = [data for data in chunk_data if data != None]

    return text_chunks, chunk_data


def sub_block(text_chunks, chunk_data):
    sub_block_list = []
    for index in range(len(text_chunks)):
        sub_dic = {}
        tmp_df = pd.DataFrame()
        chunk_df = pd.DataFrame(chunk_data[index])
        tmp_df['text_right'] = chunk_df['text_left'] + chunk_df['text_width']
        tmp_df['text_bottom'] = chunk_df['text_top'] + chunk_df['text_height']

        sub_dic['text_top'] = chunk_df['text_top'].min()
        sub_dic['text_left'] = chunk_df['text_left'].min()
        sub_dic['text_width'] = tmp_df['text_right'].max() - sub_dic['text_left']
        sub_dic['text_height'] = tmp_df['text_bottom'].max() - sub_dic['text_top']
        sub_dic['text'] = text_chunks[index]
        sub_dic['font_size'] = chunk_df['font_size'].max()
        sub_dic['font_family'] = chunk_df.iloc[0]['font_family']
        sub_dic['font_color'] = chunk_df.iloc[0]['font_color']
        sub_dic['children'] = chunk_df.to_json()

        sub_block_list.append(sub_dic)

    return pd.DataFrame(sub_block_list)


def process_block(children, page_width, page_num, configs):
    # Assuming PIL image as input
    in_df = pd.read_json(children)

    breaks = BlockBreak(page_width, in_df, page_num, configs)
    breaks.line_metadata()
    block_df = pd.DataFrame(breaks.response['lines_data'])
    text_chunks, chunk_data = group_by_visual_break(block_df)
    sub_block_df = sub_block(text_chunks, chunk_data)

    return sub_block_df


def process_page_blocks(page_df, page_widht, page_num, configs, debug=False):
    list_of_blocks = []

    block_index = 0
    for index, row in page_df.iterrows():
        if row['children'] == None:
            list_of_blocks.append(page_df.iloc[index].to_frame().transpose())
            block_index += 1
        else:
            list_of_blocks.append(process_block(page_df.iloc[index]['children'], page_widht, page_num, configs))
            block_index += 1
    return list_of_blocks

def draw_sub_blocks(list_of_blocks, image, margin=2, color="green", save=False):
    draw = ImageDraw.Draw(image)

    if len(list_of_blocks) > 0:
        for block in list_of_blocks:
            for _, row in block.iterrows():
                # print(row)
                left = int(row['text_left']) + margin
                right = int(row['text_width'] + left) - 2 * margin
                top = int(row['text_top']) + margin
                bottom = int(row["text_height"] + top) - 2 * margin
                draw.rectangle(((left, top), (right, bottom)), outline=color,width =3)
    return image
