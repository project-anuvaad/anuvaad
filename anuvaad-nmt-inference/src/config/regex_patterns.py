'''
Various regex patterns used to support translation
'''

patterns = {
    "p1" : { "regex":r'(\d+,)\s(\d+)', "description":"remove space between number separated by ," },
    "p2" : { "regex":r'(\d+.)\s(\d+)', "description":"remove space between number separated by ." },
    "p3" : { "regex":r'\d+', "description":"indentify numbers in a string" },
    "p4" : { "regex":r'(NnUuMm.,)\s(NnUuMm+)', "replacement":r'\1\2',"description":"remove space between number separated by ," },
    "p5" : { "regex":r'(NnUuMm..)\s(NnUuMm+)', "replacement":r'\1\2',"description":"remove space between number separated by ." },
    "p6" : { "regex":r'(NnUuMm.,)\s(0NnUuMm+)', "replacement":r'\1\2',"description":"remove space between number separated by ," },
    "p7" : { "regex":r'(NnUuMm..)\s(0NnUuMm+)', "replacement":r'\1\2',"description":"remove space between number separated by ." },
    "p8" : { "regex":r'(NnUuMm..)\s(NnUuMm..)\s(NnUuMm+)', "replacement":r'\1\2\3',"description":"remove space between 3 number separated by ," },
    "p9" : { "regex":r'(NnUuMm.,)\s(NnUuMm.,)\s(NnUuMm+)', "replacement":r'\1\2\3',"description":"remove space between 3 number separated by ." },
    "p10": { "regex":r'^(\(|\[|\{)(\d+|\d+.|\d+.\d+)(\)|\]|\})$', "description":\
        "regex for handling different types of number prefix ie in first token only,brackets variations"},
    "p11": { "regex":r'^(\d+|\d+.|\d+.\d+)$', "description":\
        "regex for handling different types of number prefix ie in first token only, no brackets variations"},
    "p12": { "regex":r'\d+,\d+,\d+,\d+,\d+|\d+,\d+,\d+,\d+|\d+,\d+,\d+|\d+,\d+|\d+', "description":\
        "indentify all numbers in a string including thousand separated numbers" },
    "p13": { "regex":r'http[s]?\s*:\s*/\s*/\s*(?:\s*[a-zA-Z]|[0-9]\s*|[$-_@.&+]|\s*[!*\(\), ]|(?:%[0-9a-fA-F][0-9a-fA-F]\s*))+',"description":\
        "identify url" },
    "p14": { "regex":r'[a-zA-Z0-9०-९_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]+',"description":\
        "identify email id" }
}

hindi_numbers = ['०','१','२','३','४','५','६','७','८','९','१०','११','१२','१३','१४','१५','१६','१७','१८','१९','२०','२१','२२','२३','२४','२५','२६','२७','२८','२९','३०']

digit_dict = {"bn" : {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}\
            #   "hi" : {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},\
            #   "ta" : {'0':'௦','1':'௧','2':'௨','3':'௩','4':'௪','5':'௫','6':'௬','7':'௭','8':'௮','9':'௯'},\
            #   "kn" : {'0':'೦','1':'೧','2':'೨','3':'೩','4':'೪','5':'೫','6':'೬','7':'೭','8':'೮','9':'೯'},\
            #   "te" : {'0':'౦','1':'౧','2':'౨','3':'౩','4':'౪','5':'౫','6':'౬','7':'౭','8':'౮','9':'౯'},\
            #   "ml" : {'0':'൦','1':'൧','2':'൨','3':'൩','4':'൪','5':'൫','6':'൬','7':'൭','8':'൮','9':'൯'},\
            #   "mr" : {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},\
            #   "gu" : {'0':'૦','1':'૧','2':'૨','3':'૩','4':'૪','5':'૫','6':'૬','7':'૭','8':'૮','9':'૯'},\
            #   "pa" : {'0':'੦','1':'੧','2':'੨','3':'੩','4':'੪','5':'੫','6':'੬','7':'੭','8':'੮','9':'੯'}   
             }
