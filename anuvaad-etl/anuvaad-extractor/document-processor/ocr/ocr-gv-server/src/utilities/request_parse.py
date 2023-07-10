import src.utilities.app_context as app_context
from anuvaad_auditor.loghandler import log_exception
import copy
import os,json

def log_error(method):
    def wrapper(*args, **kwargs):
        try:
            output = method(*args, **kwargs)
            return output
        except Exception as e:
            log_exception('Invalid request, required key missing of {}'.format(e), app_context.application_context, e)
            return None
    return wrapper


class File:

    def __init__(self, file):
        self.file = file
        self.file_schema = file.get('schema','LEGACY')
        self.set_page_meta()

    @log_error
    def get_schema(self):
        return self.file_schema

    @log_error
    def get_format(self):
        return self.file['file']['type']

    @log_error
    def get_language(self):
        return self.file['config']['OCR']['language']
   
    @log_error
    def get_name(self):
        return self.file['file']['name']

    @log_error
    def get_watermark_remove_config(self):
        print(self.file['config']['OCR'].keys())
        if 'watermark' not in self.file['config']['OCR'].keys():
            return None
        else:
            return self.file['config']['OCR']['watermark']

    @log_error
    def get_pages(self):
        return ['/'.join(page_path.split('/')[-4:]) for page_path in self.file['page_info']]

    @log_error
    def get_words(self, page_index):
        return self.file['pages'][page_index]['words']

    @log_error
    def get_lines(self, page_index):
        return self.file['pages'][page_index]['lines']

    @log_error
    def get_regions(self, page_index):
        return self.file['pages'][page_index].get('regions',[])

    @log_error
    def get_fontinfo(self, page_index):
        return self.file['pages'][page_index]['font_properties']

    @log_error
    def pop_fontinfo(self, page_index):
        self.file['pages'][page_index].pop('font_properties')

    @log_error
    def get_file(self):
        return self.file
    @log_error
    def get_config(self):
        return self.file

    @log_error  
    def get_pageinfo(self, page_index):
        if self.file_schema == "COMMON":
            width = self.file['pages'][page_index]['info']['width']
            height = self.file['pages'][page_index]['info']['height']
        elif self.file_schema == "TRANSLATION":
            width = self.file['pages'][page_index]['page_width']
            height = self.file['pages'][page_index]['page_height']
        else:
            width = self.file['pages'][page_index]['boundingBox']['vertices'][1]['x']
            height = self.file['pages'][page_index]['boundingBox']['vertices'][3]['y']
        return width, height
   
    @log_error
    def get_region_lines(self, page_index,region_index,page_region):
        
        if 'regions' in page_region.keys():
            return page_region['regions']
        else:
            return None
    @log_error
    def get_region_words(self, page_index,region_index,child_index,page_region):
        if 'regions' in page_region.keys():
            return page_region['regions']
        else:
            return None

    @log_error
    def set_regions(self, page_index, regions):
        if self.file_schema == "TRANSLATION":
            regions = change_regions_to_childrens(regions)
            self.file['pages'][page_index]["text_blocks"] = regions
        else:
            self.file['pages'][page_index]["regions"] = regions
    
    @log_error
    
    def delete_regions(self, page_index):
        if 'words' in self.file['pages'][page_index].keys():
            del self.file['pages'][page_index]["words"]
        if 'lines' in self.file['pages'][page_index].keys():
            del self.file['pages'][page_index]["lines"]

    @log_error
    def set_page_meta(self):
        for page_index, page_path in enumerate(self.get_pages()) :
            self.file['pages'][page_index]['path'] = page_path
            self.file['pages'][page_index]['page_no'] = page_index 

class MapKeys:
    def __init__(self):
        self.left    =  None
        self.right   =  None
        self.top     =  None
        self.bottom  =  None

    def get_left(self,box):
        if 'info' in box.keys():
            return int(box['info']['left'])
        elif 'text_top' in box.keys():
            return int(box['text_left'])
        else:
            return int(box['boundingBox']['vertices'][0]['x'])

    def get_right(self,box):
        if 'info' in box.keys():
            return int(box['info']['left'] + box['info']['width'])
        elif 'text_top' in box.keys():
            return int(box['text_left'] + box['text_width'])
        else:
            return int(box['boundingBox']['vertices'][1]['x'])

    def get_top(self,box):
        if 'info' in box.keys():
            return int(box['info']['top'])
        elif 'text_top' in box.keys():
            return int(box['text_top'])
        else:
            return int(box['boundingBox']['vertices'][0]['y'])

    def get_bottom(self,box):
        if 'info' in box.keys():
            return int(box['info']['top'] + box['info']['height'])
        elif 'text_top' in box.keys():
            return int(box['text_top'] + box['text_height'])
        else:
            return int(box['boundingBox']['vertices'][3]['y'])
    def get_height(self,box):
        if 'info' in box.keys():
            return int(box['info']['height'])
        elif 'text_top' in box.keys():
            return int(box['text_height'])
        else:
            return int(abs(self.get_top(box) - self.get_bottom(box)))
    def get_width(self,box):
        if 'info' in box.keys():
            return int(box['info']['width'])
        elif 'text_top' in box.keys():
            return int(box['text_width'])
        else:
            return int(abs(self.get_left(box) - self.get_right(box)))

class UpdateKeys:
    def __init__(self):
        self.left    =  None
        self.right   =  None
        self.top     =  None
        self.bottom  =  None

    def update_x(self,box,val,idx):
        box['boundingBox']['vertices'][idx]['x'] = val
        return box
    def update_y(self,box,val,idx):
        box['boundingBox']['vertices'][idx]['y'] = val
        return box


def get_files(application_context):
    files = copy.deepcopy(application_context['input']['inputs'])
    return files
def get_json(base_dir,path):
    path = os.path.join(base_dir, path)
    with open (path, "r") as f:
        data = json.loads(f.read())
    json_data = data['outputs']
    return json_data

def change_regions_to_childrens(regions):
    for region in regions:
        if 'regions' in region.keys():
            for wregion in region['regions']:
                if 'regions' in wregion.keys():
                    wregion['children'] = wregion.pop('regions')
            region['children'] = region.pop('regions')
    return regions
