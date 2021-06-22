
from ..ns import qn
from ..xmlchemy import BaseOxmlElement, OxmlElement, ZeroOrMore, ZeroOrOne


class CT_SDT(BaseOxmlElement):
    """
    ``<w:p>`` element, containing the properties and text for a paragraph.
    """
    sdtContent = ZeroOrMore('w:sdtContent')
    
    
class CT_SDTC(BaseOxmlElement):
    p = ZeroOrMore('w:p')

class CT_HYPERLINK(BaseOxmlElement):
    r = ZeroOrMore('w:r')


