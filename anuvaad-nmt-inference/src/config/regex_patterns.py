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
