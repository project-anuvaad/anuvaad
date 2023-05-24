import config
import time
import cv2
import pandas as pd
from src.services import get_xml
from src.utilities.remove_water_mark import clean_image
from anuvaad_auditor.loghandler import log_info
from src.services.get_response import process_image_df, process_table_df, df_to_json, process_line_df, adopt_child
from src.utilities.xml_utils import check_text
import src.utilities.app_context as app_context
from src.utilities.class_2.break_block_condition_single_column import process_page_blocks as process_block_single_column
from src.utilities.class_2.page_layout.double_column import get_column
from src.utilities.class_2.page_layout.utils import collate_regions
from src.utilities.primalaynet.infer import predict_primanet
from src.utilities.primalaynet.header_footer import PRIMA
from anuvaad_auditor.loghandler import log_error

primalaynet = PRIMA()


def doc_pre_processing(filename, base_dir, lang):
    '''
        Preprocessing on input pdf to get:
            - xml files
            - images
            - background images
            - classify digital and scanned documents

    '''

    log_info("document preprocessing started ===>", app_context.application_context)
    flags = {}
    #pdf_data={}
    
    img_dfs, xml_dfs,page_width, page_height,working_dir, pdf_bg_img_filepaths, pdf_image_paths, = get_xml.process_input_pdf(
        filename, base_dir, lang)
    
    pdf_img_height = []
    pdf_img_width  = []
    for idx,i in enumerate(pdf_image_paths):

        img_filepath = pdf_image_paths[idx]

        image        = cv2.imread(img_filepath,0)
        # image = clean_image(image)
        # cv2.imwrite(img_filepath, image)
        pdf_image_height, pdf_image_width = image.shape[:2]
        # pdf_image_height  = image.shape[0]
        pdf_img_height.append(pdf_image_height)
        # pdf_image_width = image.shape[1]
        pdf_img_width.append(pdf_image_width)
        text_blocks_count = check_text(xml_dfs)
        if (text_blocks_count == 0) or (lang in config.CLASS_2_LANG):
            #print("DocumentStructure : looks like the file is either empty or scanned")
            log_info("DocumentStructure : looks like the file is either empty or scanned", app_context.application_context)
            flags['doc_class'] = 'class_2'
        else:
            flags['doc_class'] = 'class_1'
        pdf_data = {'in_dfs':xml_dfs,'img_dfs':img_dfs , 'page_width':page_width,'page_height':page_height,
                        'pdf_bg_img_filepaths':pdf_bg_img_filepaths ,'pdf_image_paths':pdf_image_paths,
                        'pdf_image_height':pdf_img_height,'pdf_image_width':pdf_img_width
                        }
    return pdf_data, flags

def get_layout_proposals(pdf_data,flags) :

    for indx in range(len(pdf_data["page_width"])):
        width_ratio = pdf_data['page_width'][indx] / pdf_data['pdf_image_width'][indx]
        height_ratio = pdf_data['page_height'][indx]/ pdf_data['pdf_image_height'][indx]

        if (flags['page_layout'] =='single_column')or(flags['doc_class'] == 'class_1') :

            h_dfs = get_xml.get_hdfs(pdf_data['in_dfs'],  pdf_data['header_region'], pdf_data['footer_region'],width_ratio,height_ratio ,images=pdf_data['pdf_image_paths'])
            return h_dfs
        else :
            h_dfs = []
            pdf_data['sub_in_dfs'] = []
            if flags['page_layout'] == 'double_column' :

                #for page_index, pdf_image in enumerate(pdf_data['pdf_image_paths']):
                    
                    #regions = get_column(pdf_image, width_ratio)
                regions = predict_primanet(pdf_data['pdf_image_paths'][indx], pdf_data['in_dfs'][indx],width_ratio,height_ratio)
                sub_in_dfs = collate_regions(regions,pdf_data['in_dfs'][indx])
                pdf_data['sub_in_dfs'].append(sub_in_dfs)

                if config.HEADER_FOOTER_BY_PRIMA:
                    region_df = primalaynet.predict_primanet(pdf_data['pdf_image_paths'][indx], [])
                    sub_h_dfs = get_xml.get_hdfs(sub_in_dfs,region_df, pd.DataFrame(),width_ratio,height_ratio)
                else:
                    sub_h_dfs  = get_xml.get_hdfs(sub_in_dfs,  pdf_data['header_region'], pdf_data['footer_region'],width_ratio,height_ratio)
                for df in sub_in_dfs:
                    if len(df)<=1:
                        df['children']=None
                        sub_h_dfs.append(df)  
                h_dfs.append(sub_h_dfs)
        return h_dfs

        #integrate pubnet
    #    pass
    #if flags['page_layout'] == 'dict' :

def vertical_merging(pdf_data,flags):

    if flags['doc_class'] == 'class_1' :
        return get_xml.get_vdfs(pdf_data['h_dfs'])
    else :
        v_dfs = []
        columns = ['xml_index', 'text_top', 'text_left', 'text_width', 'text_height',
                         'text', 'font_size', 'font_family', 'font_color', 'attrib']
        for h_df in pdf_data['h_dfs'] :
            v_df = pd.DataFrame(columns=columns)
            if flags['page_layout'] == 'single_column':
                v_df['text_height'] = [pdf_data['page_height']]
                v_df['text_width'] = pdf_data['page_width']
                v_df['text_top'] = 0
                v_df['text_left'] = 0
                v_df['children'] = h_df.to_json()
            else:
                for sub_h_df in h_df :
                    if len(sub_h_df)>0:
                        sub_dic = {}
                        chunk_df = sub_h_df.copy()
                        chunk_df['text_right'] = chunk_df['text_left'] + chunk_df['text_width']
                        chunk_df['text_bottom'] = chunk_df['text_top'] + chunk_df['text_height']
                        sub_dic['text_top'] = chunk_df['text_top'].min()
                        sub_dic['text_left'] = chunk_df['text_left'].min()
                        sub_dic['text_width'] = chunk_df['text_right'].max() - sub_dic['text_left']
                        sub_dic['text_height'] = chunk_df['text_bottom'].max() - sub_dic['text_top']
                        sub_dic['text'] = ''

                        sub_dic['children'] = sub_h_df.to_json()

                        v_df = v_df.append([sub_dic])
                    
            v_df = v_df.reset_index(drop=True)
            v_dfs.append(v_df)

        return v_dfs

def breaK_into_paragraphs(pdf_data,flags):
    #if flags['page_layout'] == 'single_column':

    #if flags['doc_class'] == 'class_1' :
    return get_xml.get_pdfs(pdf_data['v_dfs'], pdf_data['lang'])
    
    #else : 
    '''
    p_dfs = []
    for page_index ,v_df in enumerate(pdf_data['v_dfs']) :
        p_df = pd.concat(process_block_single_column(v_df, pdf_data['page_width'],page_num= page_index +1, configs=config.BLOCK_BREAK_CONFIG))
        p_dfs.append(p_df)
    return p_dfs  '''


def doc_structure_response(pdf_data,flags):
    '''
        To build required response in json format;
            -  page level information:
                    - page_no
                    - page_width
                    - page_height
                    - images
                    - tables
                    - text_blocks
            -  convert dataframe into proper json format:
                    - img_df
                    - text_df
                    - tabel_df
    '''
    try :
        bg_dfs          = pdf_data['bg_dfs']
        img_dfs         = pdf_data['img_dfs']
        text_block_dfs  = pdf_data['p_dfs']
        table_dfs       = pdf_data['table_dfs']
        line_dfs        = pdf_data['line_dfs']
        #if flags['doc_class'] == 'class_1':
        # page_width      = pdf_data['page_width']
        # page_height     = pdf_data['page_height']
        # else :
        #     page_width = pdf_data['pdf_image_width']
        #     page_height = pdf_data['pdf_image_height']

        log_info("document structure response started  ===>", app_context.application_context)
        start_time = time.time()
        response = {'result': []}
        pages = len(text_block_dfs)

        for page_index in range(pages):
            page_width      = pdf_data['page_width'][page_index]
            page_height     = pdf_data['page_height'][page_index]
            img_df    = bg_dfs[page_index].append(img_dfs[page_index])
            text_df   = text_block_dfs[page_index]
            text_df   = get_xml.drop_update_col(text_df)
            table_df  = table_dfs[page_index]
            line_df   = line_dfs[page_index]
            # text_df    = adopt_child(text_df)

            page_json = response_per_page(text_df, img_df, table_df, line_df, page_index, page_width, page_height)
            response['result'].append(page_json)
        end_time = time.time() - start_time
        log_info("document structure response successfully completed {}".format(end_time), app_context.application_context)

        return response
    except Exception as e:
        log_error('Error in response generation' + str(e), app_context.application_context, e)


def response_per_page(p_df, img_df, table_df, line_df, page_no, page_width, page_height):
    # p_df['block_id']     = range(len(p_df))
    img_df['image_id'] = range(len(img_df))
    table_df['table_id'] = range(len(table_df))
    line_df['line_id'] = range(len(line_df))

    res_dict = {'page_no': page_no + 1, 'page_width': page_width, 'page_height': page_height, 'lines': [], 'tables': [],
                'images': [], 'text_blocks': []}
    image_data = process_image_df(img_df)
    table_data = process_table_df(table_df)
    line_data = process_line_df(line_df)

    text_data = df_to_json(p_df, block_key='')
    text_data = adopt_child(text_data)
    res_dict['images'] = image_data
    res_dict['tables'] = table_data
    res_dict['lines'] = line_data
    res_dict['text_blocks'] = text_data

    return res_dict

#
# def DocumentStructure(app_context, file_name, lang='en', base_dir=config.BASE_DIR):
#     log_debug('Block merger starting processing {}'.format(app_context.application_context),
#               app_context.application_context)
#     img_dfs, xml_dfs, page_width, page_height, pdf_bg_img_filepaths, pdf_image_paths = doc_pre_processing(file_name,
#                                                                                                           base_dir,
#                                                                                                           lang)
#
#     if xml_dfs == None:
#         return {
#             'code': 400,
#             'message': 'Document pre-processing failed, check your installation',
#             'rsp': None
#         }
#
#     text_blocks_count = check_text(xml_dfs)
#     if text_blocks_count == 0:
#         log_info(
#             "DocumentStructure : looks like the file is either empty or scanned type, currently we support Class-1 document.",
#             app_context.application_context)
#         return {
#             'code': 400,
#             'message': 'looks like the file is of scanned type, currently we support Class-1 document.',
#             'rsp': None
#         }
#
#     try:
#         text_block_dfs, table_dfs, line_dfs, bg_dfs = doc_structure_analysis(xml_dfs, img_dfs, lang, page_width,
#                                                                              page_height, pdf_bg_img_filepaths,
#                                                                              pdf_image_paths)
#         response = doc_structure_response(bg_dfs, text_block_dfs, table_dfs, line_dfs, page_width, page_height)
#         log_info("DocumentStructure : successfully received blocks in json response", app_context.application_context)
#         return {
#             'code': 200,
#             'message': 'request completed',
#             'rsp': response
#         }
#
#     except Exception as e:
#         log_exception("Error occured during pdf to blocks conversion", app_context.application_context, e)
#         return {
#             'code': 400,
#             'message': 'Error occured during pdf to blocks conversion',
#             'rsp': None
#         }
