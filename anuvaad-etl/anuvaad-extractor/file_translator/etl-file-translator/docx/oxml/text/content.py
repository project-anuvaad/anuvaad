
from ..ns import qn
from ..xmlchemy import BaseOxmlElement, OxmlElement, ZeroOrMore, ZeroOrOne

# TODO Added new file to add tags which are not supported by docx library.

class CT_SDT(BaseOxmlElement):
    """
    ``<w:psdt>`` element, containing the properties and text for a sdt.
    """
    sdtContent = ZeroOrMore('w:sdtContent')
    
    
class CT_SDTC(BaseOxmlElement):
    p = ZeroOrMore('w:p')

class CT_HYPERLINK(BaseOxmlElement):
    r = ZeroOrMore('w:r')

class CT_TXBXCONTENT(BaseOxmlElement):
    p = ZeroOrMore('w:p')

class CT_PICTURE(BaseOxmlElement):
    pic = ZeroOrMore('w:pict')

class CT_MATH(BaseOxmlElement):
    m = ZeroOrMore('m:r')

class CT_DRAWING(BaseOxmlElement):
    d = ZeroOrMore('w:drawing')

class CT_SMARTTAG(BaseOxmlElement):
    r = ZeroOrMore('w:r')
    smt = ZeroOrMore('w:smartTag')