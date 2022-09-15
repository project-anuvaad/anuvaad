import os
import shutil
import glob
import pdf2image
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import config
def create_directory(path):
    try:
        os.mkdir(path)
        return True
    except FileExistsError as fe_error:
        return True
    except OSError as error:
        log_info('unable to create directory : {}'.format(path), app_context.application_context)

    return False

def read_directory_files(path, pattern='*'):
    files = [f for f in sorted(glob.glob(os.path.join(path, pattern)))]
    return files

def get_subdirectories(path):
    return [f.path for f in os.scandir(path) if f.is_dir()]

def extract_image_paths_from_pdf(filepath, workspace_output_dir):
    '''
        function extracts image per page of the given PDF file.
        return list of path of extracted images 
    '''
    working_dir     = os.path.join(workspace_output_dir, 'images')
    image_filename  = os.path.splitext(os.path.basename(filepath))[0]
    
    create_directory(working_dir)
    info = pdf2image.pdfinfo_from_path(filepath, userpw=None, poppler_path=None)

    maxPages = info["Pages"]
# print(maxPages)
    for page in range(1, maxPages+1, 10) : 
        # convert_from_path(pdf_file, dpi=300, first_page=page, last_page = min(page+10-1,maxPages))

        paths           = pdf2image.convert_from_path(filepath, dpi=config.EXRACTION_RESOLUTION,first_page=page, last_page = min(page+10-1,maxPages), output_file=image_filename, output_folder=working_dir, fmt='jpg', paths_only=True)
    return paths

def extract_xml_path_from_digital_pdf(filepath, workspace_output_dir):
    """
        function extracts the XML by using PDF2HTML commandline tool
        and returns the path of XML file.
    """

    working_dir    = os.path.join(workspace_output_dir, 'pdftohtml')
    create_directory(working_dir)

    working_dir     = os.path.join(working_dir, 'xml')
    create_directory(working_dir)

    shutil.copy(filepath, os.path.join(working_dir, os.path.basename(filepath)))
    
    cmd             = ( 'pdftohtml -xml %s' % (os.path.join(working_dir, os.path.basename(filepath))) )
    os.system(cmd)

    xml_files      = read_directory_files(working_dir, pattern='*.xml')

    return xml_files[0]

def extract_html_bg_image_paths_from_digital_pdf(filepath, workspace_output_dir):
    """
        function extracts the HTML and Background empty image files
        and return the paths of background image file paths
    """

    working_dir    = os.path.join(workspace_output_dir, 'pdftohtml')
    create_directory(working_dir)

    working_dir    = os.path.join(working_dir, 'html')
    create_directory(working_dir)

    shutil.copy(filepath, os.path.join(working_dir, os.path.basename(filepath)))
    
    cmd             = ( 'pdftohtml -c %s' % (os.path.join(working_dir, os.path.basename(filepath))) )
    os.system(cmd)

    bg_img_files    = read_directory_files(working_dir, pattern='*.png')

    return bg_img_files
