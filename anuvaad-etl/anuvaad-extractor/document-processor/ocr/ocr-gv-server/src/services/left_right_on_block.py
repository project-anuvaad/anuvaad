from collections import Counter
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import math
from src.utilities.region_operations import get_ngram, are_hlines,merge_children
import copy
import src.utilities.app_context as app_context
from src.utilities.region_operations import MapKeys

#need to check for line with more than 2 children
def next_gen_children(child):
    try:
        sub_children = child['children']
        top_diff = max(sub_children, key=lambda x: x['boundingBox']['vertices'][0]['y'])['boundingBox']['vertices'][0]['y'] - \
                   min(sub_children, key=lambda x: x['boundingBox']['vertices'][0]['y'])['boundingBox']['vertices'][0]['y']
        flag = False;
        count = 0;
        threshold = 50
        if abs(top_diff )> 20:
            return flag
        #for i in range(len(ind)):
        for index, sub_child in enumerate(sub_children):
            sub_child = MapKeys(sub_children[index])
            right1 = sub_child.get_right()

            if index + 1 < len(sub_children):
                left2 = MapKeys(sub_children[index +1]).get_left()
                if abs(left2 - right1) > threshold:
                    count = count + 1
        if count >= len(sub_children) - 1:
            flag = True
        else:
            flag = False
    except:
        pass
    return flag


def children_condition(children):
    try:
        return  merge_children(children)

    except Exception as e:
        log_error("Error breaking regions type1 " + str(e), app_context.application_context, e)
        return None




'''
    left_right_condition:
        - To check all types of possibility of line break
        - Line connected on basis of left and right margin
'''


def left_right_condition(flag, child_index, children_list, skip, para_right, para_left, block_configs):
    right_margin_threshold = block_configs["right_margin_threshold"];
    left_margin_threshold = block_configs["left_margin_threshold"]
    right_break_threshold = block_configs["right_break_threshold"];
    left_break_threshold = block_configs["left_break_threshold"]
    header_left_threshold = block_configs["header_left_threshold"];
    header_right_threshold = block_configs["header_right_threshold"]
    space_multiply_factor = block_configs["space_multiply_factor"]

    #try:
    for line_index , line in enumerate(children_list[child_index + 1:]):

        current_line = MapKeys(children_list[line_index -1])
        next_line     = MapKeys(children_list[line_index])
        left1 = current_line.get_left()
        right1 = current_line.get_right()
        h1 = current_line.get_bottom()
        h2 = next_line.get_top()
        left2 = next_line.get_left()
        right2 = next_line.get_right()
        right_margin = right_margin_threshold * current_line.get_width()
        left_margin = left_margin_threshold * current_line.get_width()
        v_spacing = abs(h2 - h1)

        space_factor = max(current_line.get_height(), next_line.get_height())

        ## CONDITION BASED ON LENGTH RATIO OF TWO CONSECUTIVE LINES W.R.T BLOCK
        if length_ratio(para_right, para_left, left2, right2, left1, right1):
            break

        ### CONDITION BASED ON VERTICAL SPACING OF TWO CONSECUTIVE LINES
        if v_spacing > space_factor * space_multiply_factor or left2 > right1 or left1 > right2:
            break
            ### CONDITION BASED ON POSITION OF LINE IN BLOCK (MOSTLY FOR HEADER TYPE CONDITION)
        if (left1 * (header_left_threshold - 0.08) > para_left and right1 < para_right * header_right_threshold):
            break
        if (left2 * (
                header_left_threshold - 0.20) > para_left and left1 != left2 and right2 < para_right * header_right_threshold) or (
                left2 * (
                header_left_threshold - .20) > left1 and left1 != left2 and right2 < right1 * header_right_threshold):
            break
        ## CURRENT LINE BREAK WHEN NEXT LINE IS NOT IN MARGIN WITH FIRST LINE
        # if (left1 == left2 and right1 < right2 - right2 * right_break_threshold) or (
        #         left1 - left_break_threshold * current_line.get_left() > left2 and right1 <= right2 - right_break_threshold * current_line.get_right()):
        #     break
        #
        # ### IF LINES ARE IN LEFT AND RIGHT MARGIN MEANS THAY ARE CONNECTED WITH EACH OTHERS
        # elif (left1 == left2 and right1 == right2) or (left1 == left2 and right2 >= right1 - right_margin):
        #     if v_spacing > space_factor * 2.0:
        #         break
        #     else:
        #         skip = skip + 1
        # elif (left1 + left_margin >= left2 and left2 > left1 and right1 == right2) or (
        #         left1 + left_margin >= left2 and left2 > left1 and right2 >= right1 - right_margin):
        #     if v_spacing > space_factor * 2.0:
        #         break
        #     else:
        #         skip = skip + 1
        # elif (left1 - left_margin <= left2 and left2 < left1 and right1 == right2) or (
        #         left1 - left_margin <= left2 and left2 < left1 and right2 >= right1 - right_margin):
        #     if v_spacing > space_factor * 2.0:
        #         break
        #     else:
        #         skip = skip + 1
        # elif (right2 < right1 - 40):
        #     if v_spacing > space_factor * 2.0:
        #         break
        #     else:
        #         skip = skip + 1
        #         break
        # else:
        #     if v_spacing > space_factor * 2.0:
        #         break
        #     else:
        #         skip = skip + 1
        # if line_index == (len(children_list[child_index + 1:]) -1):
        #     skip = skip + 1
        #     flag = True
        #     break
    #except Exception as e:
    #   print(e)

    return flag, skip


def left_right_margin(v_block, block_configs):
    #try:

    para  = MapKeys(v_block)
    children_list = v_block['children']
    block_list = []
    skip = 0;
    flag = False;
    block_index = 0
    for child_index,child in enumerate(children_list):
        child_corrds = MapKeys(child)
        if skip != 0:
            skip = skip - 1
            continue
        # if child['children'] != None :
        #     if next_gen_children(child):
        #         #c_df = pd.read_json(df['children'][index])
        #         children_flag = False
        #         for i in child['children']:
        #             block_list += [children_condition(child['children'])]
        #         continue

        skip = 0
        flag, skip = left_right_condition(flag, child_index, children_list, skip, para.get_right(), para.get_left(),
                                         block_configs)

        flag=True
        skip = 1
        if flag:
            sub_children_list = children_list[child_index:child_index + skip]
            # children_flag = False
            # if len(children_df) != len(df):
            #     children_flag = True
            if sub_children_list != []:
                if type(sub_children_list) != list :
                    sub_children_list = copy.deepcopy(sub_children_list)
                block_list += [children_condition(sub_children_list)]
            break
        else:
            #children_flag = False
            sub_children_list = children_list[child_index:child_index + skip+1]
            # if len(children_df) != len(df):
            #     children_flag = True

            if sub_children_list != []:
                if type(sub_children_list) != list :
                    sub_children_list = copy.deepcopy(sub_children_list)
                block_list += [children_condition(sub_children_list)]

    #except Exception as e:
    #   log_error("Error in left right margin", app_context.application_context, e)
    #  return None

    return block_list


### If left right margin are same and both lines are independent so by this logic they will be seperated
def length_ratio(para_right, para_left, left2, right2, left1, right1):
    try:
        para_length = para_right - para_left;
        prev_line_length = right1 - left1;
        current_line_length = right2 - left2
        prev_line_ratio = para_length / prev_line_length
        next_line_ratio = para_length / current_line_length

        if prev_line_ratio > 2.5 and next_line_ratio > 2.5:
            return True
        else:
            return False
    except:
        pass


def most_frequent(List):
    try:
        occurence_count = Counter(List)
    except:
        pass
    return occurence_count.most_common(1)[0][0]