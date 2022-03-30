
import pandas as pd


def is_file_empty(file_bfr, file_path):
    file = file_bfr
    file_name = file.filename
    mime_type = file.mimetype
    if mime_type in ['text/csv']:
        csv_file = pd.read_csv(file_path)
        return csv_file.empty
    elif mime_type in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
        xls_file = pd.read_excel(file, engine='openpyxl')
        return xls_file.empty
    else:
        return False
