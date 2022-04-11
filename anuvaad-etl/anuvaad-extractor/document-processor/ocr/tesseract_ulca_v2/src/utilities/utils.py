import os
from pathlib import Path
import time
import numpy as np
import json,cv2,uuid
from anuvaad_auditor.errorhandler import post_error
from anuvaad_auditor.errorhandler import post_error_wf
from src.utilities.app_context import LOG_WITHOUT_CONTEXT
from anuvaad_auditor.loghandler import log_info, log_exception
from anuvaad_auditor.loghandler import log_error
import config


class FileOperation(object):
    def __init__(self):
        self.download_folder = None

    # creating directory if it is not existed before.
    def create_file_download_dir(self, downloading_folder):
        self.download_folder = downloading_folder
        download_dir = Path(os.path.join(os.getcwd(), self.download_folder))
        if download_dir.exists() is False:
            os.makedirs(download_dir)
        return str(download_dir)

    def accessing_files(self, files):
        try:
            filepath = files["name"]
            file_type = files["type"]
            identifier = files["identifier"]
        except Exception as e:
            log_exception("accessing_files, keys not found ", LOG_WITHOUT_CONTEXT, e)

        return filepath, file_type, identifier

    # generating input filepath for input filename
    def input_path(self, input_filename):
        input_filepath = os.path.join("upload", input_filename)
        return input_filepath

    # extracting data from received json input
    def json_input_format(self, json_data):
        try:
            input_data = json_data["input"]["inputs"]
            workflow_id = json_data["workflowCode"]
            jobid = json_data["jobID"]
            tool_name = json_data["tool"]
            step_order = json_data["stepOrder"]
        except Exception as e:
            log_exception(
                "json_input_format, keys not found or mismatch in json inputs ",
                LOG_WITHOUT_CONTEXT,
                e,
            )
        return input_data, workflow_id, jobid, tool_name, step_order

    # output format for individual pdf file
    def one_filename_response(self, output_json_file, langs):
        file_res = {
            "outputFile": output_json_file,
            "outputType": "json",
            "outputLocale": langs,
        }
        return file_res

    # checking file extension of received file type
    def check_file_extension(self, file_type):
        allowed_extensions = ["pdf"]
        if file_type in allowed_extensions:
            return True
        else:
            return False

    # checking directory exists or not
    def check_path_exists(self, dir):
        if dir is not None and os.path.exists(dir) is True:
            return True
        else:
            return False

    # generating output filepath for output filename
    def output_path(self, index, DOWNLOAD_FOLDER):
        output_filename = "%d-" % index + str(time.time()).replace(".", "") + ".json"
        output_filepath = os.path.join(DOWNLOAD_FOLDER, output_filename)
        return output_filepath, output_filename

    # writing json file of service response
    def writing_json_file(self, index, json_data, DOWNLOAD_FOLDER):
        output_filepath, output_filename = self.output_path(index, DOWNLOAD_FOLDER)
        with open(output_filepath, "w") as f:
            json_object = json.dumps(json_data)
            f.write(json_object)
        return output_filename

    # error manager integration
    def error_handler(self, object_in, code, iswf):
        if iswf:
            job_id = object_in["jobID"]
            task_id = object_in["taskID"]
            state = object_in["state"]
            status = object_in["status"]
            code = code
            message = object_in["message"]
            error = post_error_wf(code, message, object_in, None)
            return error
        else:
            code = object_in["error"]["code"]
            message = object_in["error"]["message"]
            error = post_error(code, message, None)
            return error
def draw_box(image,regions)  :      
    for line_index, line in enumerate(regions):
        ground = line['boundingBox']['vertices']
        color = (255, 0, 0)
        thickness = 2
        pts = []
        #thresh= abs(ground[0]['y']-ground[3]['y'])
        thresh= 0
        for i,pt in enumerate(ground):
            if i in [0,1]:
                pts.append([int(pt['x']) ,int(pt['y']-thresh)])
            else:
                pts.append([int(pt['x']) ,int(pt['y']+thresh)])
        cv2.polylines(image, [np.array(pts)],True, color, thickness -2)
    cv2.imwrite(config.SAVE_PATH_BOX+str(uuid.uuid4())+".jpg", image)
    return "None"

def sort_regions(regions,check_rows_cols=False,col_count=0,sorted_region=[]):
    check_y =regions[0]['boundingBox']['vertices'][0]['y']
    spacing_threshold = abs(check_y - regions[0]['boundingBox']['vertices'][3]['y'])* 0.5  # *2 #*0.5
    same_region =  list(filter(lambda x: (abs(x['boundingBox']['vertices'][0]['y']  - check_y) <= spacing_threshold), regions))
    if check_rows_cols:
        col_count=max(len(same_region),col_count)
    next_region =   list(filter(lambda x: (abs(x['boundingBox']['vertices'][0]['y']  - check_y) > spacing_threshold), regions))
    if len(same_region) >1 :
       same_region.sort(key=lambda x: x['boundingBox']['vertices'][0]['x'],reverse=False)
    sorted_region += same_region
    if len(next_region) > 0:
        sort_regions(next_region,check_rows_cols, col_count,sorted_region)
    return sorted_region,col_count


def end_point_correction(region, y_margin,x_margin, ymax,xmax):
    # check if after adding margin the endopints are still inside the image
    x = region["boundingBox"]['vertices'][0]['x']; y = region["boundingBox"]['vertices'][0]['y']
    w = abs(region["boundingBox"]['vertices'][0]['x']-region["boundingBox"]['vertices'][1]['x'])
    h = abs(region["boundingBox"]['vertices'][0]['y']-region["boundingBox"]['vertices'][2]['y'])
    if abs(h-ymax)<50:
        return False,False,False,False,False
    ystart = y - y_margin
    yend = y + h + y_margin
    xstart = x - x_margin
    xend = x + w + x_margin
    return True,int(ystart), int(yend), int(xstart), int(xend)

def mask_image(image, page_regions,margin= 0 ,fill=255):
    try:
        y_margin=0; x_margin=0
        image_height = image.shape[0];  image_width = image.shape[1]
        for region in page_regions:
            is_correction,row_top, row_bottom,row_left,row_right = end_point_correction(region, y_margin,x_margin,image_height,image_width)
            if len(image.shape) == 2 :
                image[row_top - margin : row_bottom + margin , row_left - margin: row_right + margin] = fill
            if len(image.shape) == 3 :
                image[row_top - margin: row_bottom + margin, row_left - margin: row_right + margin,:] = fill
        return image
    except Exception as e :
        print('Service Tesseract Error in masking out image {}'.format(e))
        return None