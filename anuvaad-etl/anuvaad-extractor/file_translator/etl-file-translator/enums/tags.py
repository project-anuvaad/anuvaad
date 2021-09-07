import enum


class DocxTag(enum.Enum):
    PARAGRAPH = 'p'
    TABLE = 'tbl'
    SDTCONTENT = 'sdtContent'
    TXBXCONTENT = 'txbxContent'
    MATH = 'oMath'
    DRAWING = 'drawing'
    SMARTTAG = 'smartTag'