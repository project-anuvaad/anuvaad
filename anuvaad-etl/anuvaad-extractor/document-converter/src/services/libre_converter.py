import sys
import subprocess
import re
import shutil
from utilities import MODULE_CONTEXT
from anuvaad_auditor.loghandler import log_info

def delete_original_file(o_file):
    o_path = o_file.rsplit("/",1)[0]
    shutil.rmtree(o_path)
    log_info('PDF(reportlab) + folder deleted: %s' % (o_path),MODULE_CONTEXT)          


def convert_to(folder, source, timeout=None):
    args = [libreoffice_exec(), '--headless','--infilter="writer_pdf_import"', '--convert-to', 'pdf', '--outdir', folder, source]

    process = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
    filename = re.search('-> (.*?) using filter', process.stdout.decode())
    log_info('PDF(libreoffice) created: %s' % (filename),MODULE_CONTEXT)          
    delete_original_file(source)

    if filename is None:
        raise LibreOfficeError(process.stdout.decode())
    else:
        return filename.group(1)


def libreoffice_exec():
    # TODO: Provide support for more platforms
    if sys.platform == 'darwin':
        return '/Applications/LibreOffice.app/Contents/MacOS/soffice'
    return 'libreoffice'


class LibreOfficeError(Exception):
    def __init__(self, output):
        self.output = output


if __name__ == '__main__':
    print('Converted to ' + convert_to(sys.argv[1], sys.argv[2]))