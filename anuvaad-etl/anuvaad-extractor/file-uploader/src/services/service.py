import os

import docx
import pandas as pd
from docx import Document


def is_file_empty(file, file_size):
    file_name = file.filename
    mime_type = file.mimetype
    if mime_type in ['text/csv']:
        csv_file = pd.read_csv(file_name)
        return csv_file.empty
    elif mime_type in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
        xls_file = pd.read_excel(file)
        return xls_file.empty
    else:
        return file_size <= 0
