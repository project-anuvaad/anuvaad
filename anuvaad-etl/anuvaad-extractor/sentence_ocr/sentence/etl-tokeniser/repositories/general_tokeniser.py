import re

"""
Utility tokenizer class for anuvaad project
"""

class AnuvaadTokenizer(object):
    
    """
    abbrevations generalisation
    unicode range for indian vernacular scripts : '\u0900-\u0D7F'
    """

    _text_colon_abbreviations_pattern = r'(([\u0900-\u0D7F])?[:](\s)?([\u0900-\u0D7F])?)'
    _text_colon_abbreviations = []
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
    DELIM_PAT = re.compile(r'[\.\?!\u0964\u0965]')
    
    def __init__(self):
        self._text_colon_abbreviations = []
        self._date_abbrevations = []
        self._time_abbreviations = []
        self._table_points_abbrevations = []
        self._brackets_abbrevations = []
        self._dot_with_char_abbrevations = []
        self._dot_with_quote_abbrevations = []
        self._dot_with_number_abbrevations = []
        self._decimal_abbrevations = []
        self._url_abbrevations = []
        self._dot_with_beginning_number_abbrevations = []

    def tokenize(self, text):
        print('--------------Process started-------------')
        text = self.serialize_dates(text)
        text = self.serialize_time(text)
        text = self.serialize_colon_abbreviations(text)
        text = self.serialize_table_points(text)
        text = self.serialize_url(text)
        text = self.serialize_pattern(text)
        # text = self.serialize_end(text)
        text = self.serialize_dots(text)
        text = self.serialize_brackets(text)
        text = self.serialize_dot_with_number(text)
        text = self.serialize_dot_with_number_beginning(text)
        text = self.serialize_quotes_with_number(text)
        text = self.serialize_bullet_points(text)
        text = self.serialize_decimal(text)
        text = self.add_space_after_sentence_end(text)
        sentences = self.sentence_split(text)
        output = []
        for se in sentences:
            se = self.deserialize_dates(se)
            se = self.deserialize_time(se)
            se = self.deserialize_pattern(se)
            se = self.deserialize_url(se)
            #se = self.deserialize_end(se)
            se = self.deserialize_dots(se)
            se = self.deserialize_decimal(se)
            se = self.deserialize_brackets(se)
            se = self.deserialize_dot_with_number(se)
            se = self.deserialize_dot_with_number_beginning(se)
            se = self.deserialize_quotes_with_number(se)
            se = self.deserialize_colon_abbreviations(se)
            #se = self.deserialize_with_abbrevations(se)
            se = self.deserialize_bullet_points(se)
            se = self.deserialize_table_points(se)
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
        sentence_ends = ['.','?','!',';',':','।', '॥']
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
        pattern = re.compile(r'(?!^)[•]')
        text = pattern.sub('TT__TT UU__UU', text)
        return text

    def deserialize_bullet_points(self, text):
        pattern = re.compile(re.escape('TT__TT'), re.IGNORECASE)
        text = pattern.sub('', text)
        pattern = re.compile(re.escape('UU__UU'), re.IGNORECASE)
        text = pattern.sub('•', text)
        return text

    def serialize_table_points(self, text):
        patterns = re.findall(r'(?:(?:(?:[ ][(]?(?:(?:[0,9]|[i]|[x]|[v]){1,3}|[a-zA-Z\u0900-\u0D7F]{1,1})[)])|(?:[ ](?:(?:[0-9]|[i]|[x]|[v]){1,3}|[a-zA-Z\u0900-\u0D7F]{1,1})[.][ ])))',text)
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
        patterns = re.findall(r'(?:[(](?:[0-9\u0900-\u0D7Fa-zA-Z.-]|[ ]){1,}[)])',text)
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
        patterns = re.findall(r'[0-9]{1,4}[.][0-9]{1,2}[.][0-9]{1,4}',text)   # [0-9]{,2}[.][0-9]{,2}[.][0-9]{2,4}   [0-9]{1,4}[.][0-9]{1,2}[.][0-9]{1,4}
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
        patterns = re.findall(r'([ ][“][0-9a-zA-Z\u0900-\u0D7F]{1,}[.])',text)
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
        patterns = re.findall(r'(^[\s]?[0-9]{1,}[-]?[.])',text)
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
        patterns = re.findall(r'([\u0900-\u0D7F][.]){2,}',text)
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
           
    def sentence_split(self, text):
        line = text
        ### Phase 1: break on sentence delimiters.
        cand_sentences=[]
        begin=0
        text = text.strip()
        for mo in self.DELIM_PAT.finditer(text):
            p1=mo.start()
            p2=mo.end()
            ## NEW
            if p1>0 and text[p1-1].isnumeric():
                continue

            end=p1+1
            s= text[begin:end].strip()
            if len(s)>0:
                cand_sentences.append(s)
            begin=p1+1
        s= text[begin:].strip()
        if len(s)>0:
            cand_sentences.append(s)
        final_sentences=[]
        sen_buffer=''        
        bad_state=False
        for i, sentence in enumerate(cand_sentences):
            print("sentence", sentence) 
            if i < len(cand_sentences)-1:
                next_sentence = cand_sentences[i+1]
            next_sentence_words = next_sentence.split(' ')
            words=sentence.split(' ')
            #print("words", words)
            print("next sentence", next_sentence)
            #if len(words)<=2 and words[-1]=='.':
            if len(words)==1 and sentence[-1]=='.':
                print("11111111")
                bad_state=True
                sen_buffer = sen_buffer + ' ' + sentence
                print("senteces bobobob", sen_buffer)
            elif len(next_sentence_words)==1 and sentence[-1]=='.':
                print("222222222")
                bad_state=True
                sen_buffer = sen_buffer + ' ' + sentence + ' ' + next_sentence
                print("buffer2", sen_buffer)
                # if len(sen_buffer)>0:
                #     final_sentences.append(sen_buffer)
                if i < len(cand_sentences)-1:
                    cand_sentences[i+1] = sen_buffer
                else:
                    sentence = sen_buffer
                sen_buffer=''
            # elif words[-1][-1]=='.' and next_sentence[-1] == '.':
            #     print(sentence)
            ## NEW condition    
            # elif sentence[-1]=='.' and is_acronym_abbvr(words[-1][:-1],lang):
            #     if len(sen_buffer)>0 and  not bad_state:
            #         final_sentences.append(sen_buffer)
            #     bad_state=True
            #     sen_buffer = sentence
            elif bad_state:
                print("33333333333333", bad_state)
                sen_buffer = sen_buffer + ' ' + sentence + next_sentence
                # if len(sen_buffer)>0:
                #     final_sentences.append(sen_buffer)
                print("sen buffer bad", sen_buffer)
                if i < len(cand_sentences)-1:
                    cand_sentences[i+1] = sen_buffer
                else:
                    sentence = sen_buffer
                sen_buffer=''
                bad_state=False
            else: ## good state   
                print("444444444444", sentence)                 
                if len(sen_buffer)>0:
                    final_sentences.append(sen_buffer)
                sen_buffer=sentence
                bad_state=False

        if len(sen_buffer)>0:
            final_sentences.append(sen_buffer)
        print("finals", final_sentences)
        return final_sentences

   # def 

    def serialize_with_abbrevations(self, text):
        index_cic = 0
        index_cci = 0
        index_for_without_space = 0
        # for abbrev in self._abbrevations_without_space_pattern:
        #     pattern = re.compile(abbrev, re.IGNORECASE)
        #     text = pattern.sub('#'+str(index_for_without_space)+'##', text)
        #     index_for_without_space += 1
        patterns_wo = re.findall(self._text_abbrevations_without_space_pattern, text)
        patterns_wo = [tuple(j for j in pattern if j)[0] for pattern in patterns_wo]
        patterns_wo = list(sorted(patterns_wo, key = len))
        patterns_wo = patterns_wo[::-1]
        if patterns_wo is not None and isinstance(patterns_wo, list):
            for pattern in patterns_wo:
                pattern_obj = re.compile(re.escape(pattern))
                self._text_abbrevations_without_space.append(pattern)
                text = pattern_obj.sub('#W'+str(index_for_without_space)+'S#', text)
                index_for_without_space+=1
        patterns_cic = re.findall(self._text_abbrevations_pattern_cic, text)
        patterns_cic = [tuple(j for j in pattern if j)[0] for pattern in patterns_cic]
        patterns_cic = list(sorted(patterns_cic, key = len))
        patterns_cic = patterns_wo[::-1]
        if patterns_cic is not None and isinstance(patterns_cic, list):
            for pattern in patterns_cic:
                pattern_obj = re.compile(re.escape(pattern))
                self._text_abbrevations_cic.append(pattern)
                text = pattern_obj.sub('#CI'+str(index_cic)+'C#', text)
                index_cic+=1
        patterns = re.findall(self._text_abbrevations_pattern_cci, text)
        patterns = [tuple(j for j in pattern if j)[0] for pattern in patterns]
        patterns = list(sorted(patterns, key = len))
        patterns = patterns[::-1]
        if patterns is not None and isinstance(patterns, list):
            for pattern in patterns:
                pattern_obj = re.compile(re.escape(pattern))
                self._text_abbrevations_cci.append(pattern)
                text = pattern_obj.sub('##C'+str(index_cci)+'CI##', text)
                index_cci+=1        
        return text

    def deserialize_with_abbrevations(self, text):
        index_cic = 0
        index_cci = 0
        index_for_without_space = 0
        # for abbrev in self._abbrevations_without_space:
        #     pattern = re.compile(re.escape('#'+str(index_for_without_space)+'##'), re.IGNORECASE)
        #     text = pattern.sub(abbrev, text)
        #     index_for_without_space += 1
        # for abbrev in self._abbrevations_with_space:
        #     pattern = re.compile(re.escape(' #'+str(index)+'#'), re.IGNORECASE)
        #     text = pattern.sub(abbrev, text)
        #     index += 1
        if self._text_abbrevations_without_space is not None and isinstance(self._text_abbrevations_without_space, list):
            for pattern in self._text_abbrevations_without_space:
                pattern_obj = re.compile(re.escape('#W'+str(index_for_without_space)+'S#'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index_for_without_space+=1
        if self._text_abbrevations_cic is not None and isinstance(self._text_abbrevations_cic, list):
            for pattern in self._text_abbrevations_cic:
                pattern_obj = re.compile(re.escape('#CI'+str(index_cic)+'C#'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index_cic+=1
        if self._text_abbrevations_cci is not None and isinstance(self._text_abbrevations_cci, list):
            for pattern in self._text_abbrevations_cci:
                pattern_obj = re.compile(re.escape('##C'+str(index_cci)+'CI##'), re.IGNORECASE)
                text = pattern_obj.sub(pattern, text)
                index_cci+=1
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


# class SentenceEndLangVars(PunktLanguageVars):
#     text = []
#     with open('repositories/tokenizer_data/end.txt', encoding='utf8') as f:
#         text = f.read()
#     sent_end_chars = text.split('\n')
    
    # # punkt = PunktTrainer()
    # # punkt.train(text,finalize=False, verbose=False)
    # # punkt.finalize_training(verbose=True)
# text = "जिन मुख्य जिन्स समूहों  के मूल्यों में अप्रैल 2020 में अप्रैल 2019 की तुलना में नकारात्मक वृद्धि दर्ज की गई वो हैं- रत्न और आभूषण (-98.74%), चमड़ा और चमड़े के उत्पाद (-93.28%), "
# # with open('data5.txt', encoding='utf8') as f:
# #     text = f.read()
# tokenizer = AnuvaadHinTokenizer()
# print(tokenizer.tokenize(text))