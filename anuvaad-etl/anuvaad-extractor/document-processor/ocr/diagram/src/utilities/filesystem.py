import os
import shutil
import glob
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error

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


