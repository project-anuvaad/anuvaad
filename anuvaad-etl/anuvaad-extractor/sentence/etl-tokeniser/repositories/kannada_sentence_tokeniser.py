import re
from nltk.tokenize.punkt import PunktSentenceTokenizer, PunktParameters, PunktTrainer, PunktLanguageVars
from nltk.tokenize import sent_tokenize

class AnuvaadKannadaTokenizer(object):

    """
    Default abbrevations
    incomplete char range = ([\u0C80-\u0C84,\u0CBC-\u0CD6,\u0CE2-\u0CE3,\u0CF1-\u0CF2])
    complete char range = ([\u0C85-\u0CB9,\u0CDE-\u0CE1])    
    number range = ([\u0CE6-\u0CEF])
    source for unicodes : https://unicode.org/charts/PDF/U0C80.pdf
    """
    _abbrevations_with_space_pattern = r'((\s)(([\u0C85-\u0CB9,\u0CDE-\u0CE1])([\u0C85-\u0CB9,\u0CDE-\u0CE1])?([\u0C80-\u0C84,\u0CBC-\u0CD6,\u0CE2-\u0CE3,\u0CF1-\u0CF2])?([\u0C85-\u0CB9,\u0CDE-\u0CE1])?([\u0C80-\u0C84,\u0CBC-\u0CD6,\u0CE2-\u0CE3,\u0CF1-\u0CF2])?(\u002e)(\s)?){1,})'
    _abbrevations_without_space_pattern = r'(^(([\u0C85-\u0CB9,\u0CDE-\u0CE1])([\u0C85-\u0CB9,\u0CDE-\u0CE1])?([\u0C80-\u0C84,\u0CBC-\u0CD6,\u0CE2-\u0CE3,\u0CF1-\u0CF2])?([\u0C85-\u0CB9,\u0CDE-\u0CE1])?([\u0C80-\u0C84,\u0CBC-\u0CD6,\u0CE2-\u0CE3,\u0CF1-\u0CF2])?(\u002e)(\s)?){1,})'
    _text_colon_abbreviations_pattern = r'([\u0C85-\u0CB9,\u0CDE-\u0CE1])([\u0C80-\u0C84,\u0CBC-\u0CD6,\u0CE2-\u0CE3,\u0CF1-\u0CF2])?[:](\s)?([\u0C85-\u0CB9,\u0CDE-\u0CE1])([\u0C80-\u0C84,\u0CBC-\u0CD6,\u0CE2-\u0CE3,\u0CF1-\u0CF2])?'
    _abbrevations_with_space = []
    _abbrevations_without_space = []
    _text_colon_abbreviations = []
    _tokenizer = None
    _regex_search_texts = []
    _date_abbrevations  = []
    _time_abbreviations = []
    _table_points_abbrevations = []
    _brackets_abbrevations = []
    _decimal_abbrevations = []
    _url_abbrevations = []
    _dot_with_char_abbrevations = []
    _dot_with_quote_abbrevations = []
    _dot_with_number_abbrevations = []
    _dot_with_beginning_number_abbrevations = []

    def __init__(self, abbrevations = None):
        if abbrevations is not None:
            self._abbrevations_without_space.append(abbrevations)
        self._abbrevations_with_space = []
        self._abbrevations_without_space = []
        self._text_colon_abbreviations = []
        self._regex_search_texts = []
        self._date_abbrevations  = []
        self._time_abbreviations = []
        self._table_points_abbrevations = []
        self._brackets_abbrevations = []
        self._decimal_abbrevations = []
        self._url_abbrevations = []
        self._dot_with_char_abbrevations = []
        self._dot_with_quote_abbrevations = []
        self._dot_with_number_abbrevations = []
        self._dot_with_beginning_number_abbrevations = []
        self._tokenizer = PunktSentenceTokenizer(lang_vars=SentenceEndLangVars())

    def tokenize(self, text):
        print('--------------Process kn started-------------')
        text = self.serialize_with_abbrevations(text)
        text = self.serialize_colon_abbreviations(text)
        text = self.serialize_dates(text)
        text = self.serialize_time(text)
        text = self.serialize_table_points(text)
        text = self.serialize_url(text)
        text = self.serialize_pattern(text)
        text = self.serialize_dots(text)
        test = self.serialize_end(text)
        text = self.serialize_brackets(text)
        text = self.serialize_dot_with_number(text)
        text = self.serialize_dot_with_number_beginning(text)
        text = self.serialize_quotes_with_number(text)
        text = self.serialize_bullet_points(text)
        text = self.serialize_decimal(text)
        text = self.add_space_after_sentence_end(text)
        sentences = self._tokenizer.tokenize(text)
        output = []
        for se in sentences:
            se = self.deserialize_dates(se)
            se = self.deserialize_time(se)
            se = self.deserialize_pattern(se)
            se = self.deserialize_url(se)
            se = self.deserialize_dots(se)
            se = self.deserialize_end(se)
            se = self.deserialize_decimal(se)
            se = self.deserialize_brackets(se)
            se = self.deserialize_dot_with_number(se)
            se = self.deserialize_dot_with_number_beginning(se)
            se = self.deserialize_quotes_with_number(se)
            se = self.deserialize_with_abbrevations(se)
            se = self.deserialize_colon_abbreviations(se)
            se = self.deserialize_bullet_points(se)
            se = self.deserialize_table_points(se)
            if se != '':
                output.append(se.strip())
        print('--------------Process finished-------------')
        return output

    def serialize_url(self, text):
        patterns = re.findall(r'(?:(?:https?):?:(?:(?://)|(?:\\\\))+(?:(?:[\w\d:#@%/;$()~_?\+-=\\\.&](?:#!)?))*)',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._url_abbrevations.append(pattern)
                text = pattern_obj.sub('URL_'+str(index)+'_URL', text)
                index+=1
        return text

    def deserialize_url(self, text):
        index = 0
        if self._url_abbrevations is not None and isinstance(self._url_abbrevations, list):
            for pattern in self._url_abbrevations:
                pattern_obj = re.compile(re.escape('URL_'+str(index)+'_URL'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_decimal(self, text):
        patterns = re.findall(r'(?:(?:[ ]|[(]|[-])[0-9]{1,}[.][0-9]{1,}(?:[ ]|[)]|[%]))',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._decimal_abbrevations.append(pattern)
                text = pattern_obj.sub('DE_'+str(index)+'_DE', text)
                index+=1
        return text

    def deserialize_decimal(self, text):
        index = 0
        if self._decimal_abbrevations is not None and isinstance(self._decimal_abbrevations, list):
            for pattern in self._decimal_abbrevations:
                pattern_obj = re.compile(re.escape('DE_'+str(index)+'_DE'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def add_space_after_sentence_end(self, text):
        sentence_ends = ['.','?','!',';',':','।']
        for sentence_end in sentence_ends:
            pattern = re.compile(r'['+sentence_end+'][ ]') #remove already correct patterns
            text = pattern.sub(sentence_end, text)
            pattern = re.compile(r'['+sentence_end+']')
            text = pattern.sub(sentence_end + ' ', text)
        return text

    def serialize_end(self, text):
        pattern_d = re.compile(r'(\u0965)')
        text = pattern_d.sub(' END_||_END', text)
        pattern = re.compile(r'(\u0964)')
        text = pattern.sub(' END_|_END ', text)
        return text

    def deserialize_end(self, text):
        pattern = re.compile(re.escape(' END_|_END'), re.IGNORECASE)
        text = pattern.sub('।', text)
        pattern = re.compile(re.escape(' END_||_END'), re.IGNORECASE)
        text = pattern.sub('॥', text)
        return text

    def serialize_bullet_points(self, text):
        pattern1 = re.compile(r'(?!^)[•]')
        text = pattern1.sub('TT__TT UU_0_UU', text)
        pattern2 = re.compile(r'(?!^)[▪]')
        text = pattern2.sub('TT__TT UU_1_UU', text)
        pattern3 = re.compile(r'(?!^)[●]')
        text = pattern3.sub('TT__TT UU_2_UU', text)
        return text

    def deserialize_bullet_points(self, text):
        pattern = re.compile(re.escape('TT__TT'), re.IGNORECASE)
        text = pattern.sub('', text)
        pattern = re.compile(re.escape('UU_0_UU'), re.IGNORECASE)
        text = pattern.sub('•', text)
        pattern = re.compile(re.escape('UU_1_UU'), re.IGNORECASE)
        text = pattern.sub('▪', text)
        pattern = re.compile(re.escape('UU_2_UU'), re.IGNORECASE)
        text = pattern.sub('●', text)
        return text

    def serialize_table_points(self, text):
        patterns = re.findall(r'(?:(?:(?:[ ][(]?(?:(?:[0,9]|[i]|[x]|[v]){1,3}|[a-zA-Z\u0C80-\u0CF2]{1,1})[)])|(?:[ ](?:(?:[0-9]|[i]|[x]|[v]){1,3}|[a-zA-Z\u0C80-\u0CF2]{1,1})[.][ ])))',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._table_points_abbrevations.append(pattern)
                text = pattern_obj.sub(' TT__TT RR_'+str(index)+'_RR', text)
                index+=1
        return text

    def deserialize_table_points(self, text):
        index = 0
        if self._table_points_abbrevations is not None and isinstance(self._table_points_abbrevations, list):
            for pattern in self._table_points_abbrevations:
                pattern_obj = re.compile(re.escape('RR_'+str(index)+'_RR'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_brackets(self, text):
        patterns = re.findall(r'(?:[(](?:[0-9\u0C80-\u0CF2a-zA-Z][.]?|[ ]){1,}[)]?).',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._brackets_abbrevations.append(pattern)
                text = pattern_obj.sub('WW_'+str(index)+'_WW', text)
                index+=1
        return text

    def deserialize_brackets(self, text):
        index = 0
        if self._brackets_abbrevations is not None and isinstance(self._brackets_abbrevations, list):
            for pattern in self._brackets_abbrevations:
                pattern_obj = re.compile(re.escape('WW_'+str(index)+'_WW'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_dates(self, text):
        patterns = re.findall(r'[0-9]{1,4}[.][0-9]{1,2}[.][0-9]{1,4}',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._date_abbrevations.append(pattern)
                text = pattern_obj.sub('DD_'+str(index)+'_DD', text)
                index+=1
        return text

    def deserialize_dates(self, text):
        index = 0
        if self._date_abbrevations is not None and isinstance(self._date_abbrevations, list):
            for pattern in self._date_abbrevations:
                pattern_obj = re.compile(re.escape('DD_'+str(index)+'_DD'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_time(self, text):
        patterns = re.findall(r'[0-9]{1,2}[:][0-9]{1,2}',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._time_abbreviations.append(pattern)
                text = pattern_obj.sub('TI_'+str(index)+'_ME', text)
                index+=1
        return text

    def deserialize_time(self, text):
        index = 0
        if self._time_abbreviations is not None and isinstance(self._time_abbreviations, list):
            for pattern in self._time_abbreviations:
                pattern_obj = re.compile(re.escape('TI_'+str(index)+'_ME'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text


    def serialize_quotes_with_number(self, text):
        patterns = re.findall(r'([ ][“][0-9a-zA-Z\u0C80-\u0CF2]{1,}[.])',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._dot_with_quote_abbrevations.append(pattern)
                text = pattern_obj.sub(' ZZ_'+str(index)+'_ZZ', text)
                index+=1
        return text

    def deserialize_quotes_with_number(self, text):
        index = 0
        if self._dot_with_quote_abbrevations is not None and isinstance(self._dot_with_quote_abbrevations, list):
            for pattern in self._dot_with_quote_abbrevations:
                pattern_obj = re.compile(re.escape('ZZ_'+str(index)+'_ZZ'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_dot_with_number_beginning(self, text):
        patterns = re.findall(r'(^[0-9]{1,}[.])',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._dot_with_beginning_number_abbrevations.append(pattern)
                text = pattern_obj.sub('YY_'+str(index)+'_YY', text)
                index+=1
        return text

    def deserialize_dot_with_number_beginning(self, text):
        index = 0
        if self._dot_with_beginning_number_abbrevations is not None and isinstance(self._dot_with_beginning_number_abbrevations, list):
            for pattern in self._dot_with_beginning_number_abbrevations:
                pattern_obj = re.compile(re.escape('YY_'+str(index)+'_YY'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_dot_with_number(self, text):
        patterns = re.findall(r'(?:[ ][0-9]{,2}[.][ ])',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._dot_with_number_abbrevations.append(pattern)
                text = pattern_obj.sub(' XX_'+str(index)+'_XX', text)
                index+=1
        return text

    def deserialize_dot_with_number(self, text):
        index = 0
        if self._dot_with_number_abbrevations is not None and isinstance(self._dot_with_number_abbrevations, list):
            for pattern in self._dot_with_number_abbrevations:
                pattern_obj = re.compile(re.escape('XX_'+str(index)+'_XX'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_dots(self, text):
        pattern = re.compile(r'([.]{3,})')
        text = pattern.sub('XX__XX', text)
        return text

    def deserialize_dots(self, text):
        pattern = re.compile(re.escape('XX__XX'), re.IGNORECASE)
        text = pattern.sub('......', text)
        return text

    def serialize_pattern(self, text):
        patterns = re.findall(r'([\u0C80-\u0CF2][.]){2,}',text)
        index = 0
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._dot_with_char_abbrevations.append(pattern)
                text = pattern_obj.sub('$$_'+str(index)+'_$$', text)
                index+=1
        return text

    def deserialize_pattern(self, text):
        index = 0
        if self._dot_with_char_abbrevations is not None and isinstance(self._dot_with_char_abbrevations, list):
            for pattern in self._dot_with_char_abbrevations:
                pattern_obj = re.compile(re.escape('$$_'+str(index)+'_$$'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_with_abbrevations(self, text):
        index = 0
        index_for_without_space = 0
        patterns_wos = re.findall(self._abbrevations_without_space_pattern, text)
        patterns_wos = [tuple(j for j in pattern if j)[0] for pattern in patterns_wos]
        patterns_wos = list(sorted(patterns_wos, key = len))
        patterns_wos = patterns_wos[::-1]
        if patterns_wos is not None and isinstance(patterns_wos, list):
            for pattern in patterns_wos:
                pattern_obj = re.compile(re.escape(pattern))
                self._abbrevations_without_space.append(pattern)
                text = pattern_obj.sub('#WO'+str(index)+'S##', text)
                index_for_without_space+=1

        patterns = re.findall(self._abbrevations_with_space_pattern, text)
        patterns = [tuple(j for j in pattern if j)[0] for pattern in patterns]
        patterns = list(sorted(patterns, key = len))
        patterns = patterns[::-1]
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._abbrevations_with_space.append(pattern)
                text = pattern_obj.sub('##'+str(index)+'##', text)
                index+=1
        return text

    def deserialize_with_abbrevations(self, text):
        index = 0
        index_for_without_space = 0
        if self._abbrevations_without_space is not None and isinstance(self._abbrevations_without_space, list):
            for pattern in self._abbrevations_without_space:
                pattern_obj = re.compile(re.escape('#WO'+str(index)+'S##'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index_for_without_space+=1
        if self._abbrevations_with_space is not None and isinstance(self._abbrevations_with_space, list):
            for pattern in self._abbrevations_with_space:
                pattern_obj = re.compile(re.escape('##'+str(index)+'##'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

    def serialize_colon_abbreviations(self, text):
        index = 0
        patterns = re.findall(self._text_colon_abbreviations_pattern, text)
        patterns = [tuple(j for j in pattern if j)[0] for pattern in patterns]
        patterns = list(sorted(patterns, key = len))
        patterns = patterns[::-1]
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._text_colon_abbreviations.append(pattern)
                text = pattern_obj.sub('#C'+str(index)+'C#', text)
                index+=1
        return text

    def deserialize_colon_abbreviations(self, text):
        index = 0
        if self._text_colon_abbreviations is not None and isinstance(self._text_colon_abbreviations, list):
            for pattern in self._text_colon_abbreviations:
                pattern_obj = re.compile(re.escape('#C'+str(index)+'C#'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index+=1
        return text

class SentenceEndLangVars(PunktLanguageVars):
    text = []
    with open('repositories/tokenizer_data/end.txt', encoding='utf8') as f:
        text = f.read()
    sent_end_chars = text.split('\n')