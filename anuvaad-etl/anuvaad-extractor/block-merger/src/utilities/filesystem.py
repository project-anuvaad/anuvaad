import os
import shutil
import glob
import pdf2image
import xml.etree.ElementTree as ET
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error
import src.utilities.app_context as app_context

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
    paths           = pdf2image.convert_from_path(filepath, dpi=300, output_file=image_filename, output_folder=working_dir, fmt='jpg', paths_only=True)
    return paths

def remove_extra_images(xml_file):
    # Parse the XML file
    output_path = xml_file
    tree = ET.parse(xml_file)
    root = tree.getroot()
    # Find all page elements in the XML file
    page_elements = root.findall('.//page')
    # Iterate over the page elements
    for page_element in page_elements:
        # Find all image elements within the page element
        image_elements = page_element.findall('image')

        # Track the first image per page
        first_image_per_page = None

        # Iterate over the image elements
        for image_element in image_elements:
            # Remove image elements except the first per page
            if first_image_per_page is None:
                first_image_per_page = image_element
            elif image_element != first_image_per_page:
                page_element.remove(image_element)
                # Remove the corresponding image file
                image_path = image_element.attrib['src']
                # image_path = os.path.join(image_dir, image_filename)
                if os.path.exists(image_path):
                    os.remove(image_path)

    # Save the modified XML file\
    tree.write(output_path)


def extract_xml_path_from_digital_pdf(filepath, workspace_output_dir):
    """
        function extracts the XML by using PDF2HTML commandline tool
        and returns the path of XML file.
    """
    working_dir    = os.path.join(workspace_output_dir, 'pdftohtml')
    create_directory(working_dir)
    log_info('pdf to html working dir created  :', app_context.application_context)

    working_dir     = os.path.join(working_dir, 'xml')
    create_directory(working_dir)

    log_info('pdf to html xml working dir created  :', app_context.application_context)


    shutil.copy(filepath, os.path.join(working_dir, os.path.basename(filepath)))
    cmd             = ( 'pdftohtml -xml %s' % (os.path.join(working_dir, os.path.basename(filepath))) )
    os.system(cmd)
    
    xml_files      = read_directory_files(working_dir, pattern='*.xml')

    remove_extra_images(xml_files[0])
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
