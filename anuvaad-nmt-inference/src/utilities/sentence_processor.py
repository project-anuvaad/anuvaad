import tools.indic_detokenize as indic_detok
import tools.indic_tokenize as indic_tok
import tools.apply_bpe as subword_enc
import subprocess
import sys
import codecs
import os
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
from sacremoses import MosesTokenizer, MosesDetokenizer

def indic_tokenizer(s):
    #log_info("indic_tokenizing",MODULE_CONTEXT)
    return ' '.join(indic_tok.trivial_tokenize_indic(s))

def indic_detokenizer(s):
    #log_info("detokenizing using indic",MODULE_CONTEXT)
    return indic_detok.trivial_detokenize_indic(s)

def moses_tokenizer_(text):
    log_info("moses_tokenizing",MODULE_CONTEXT)
    tokenizer_path = "src/tools/tokenizer.perl" 
    text = text 
    lang = "en" 
    pipe = subprocess.Popen(["perl", tokenizer_path, '-l', lang, text], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    pipe.stdin.write(text.encode('utf-8'))
    pipe.stdin.close()
    tokenized_output = pipe.stdout.read()
    return tokenized_output.strip().decode('utf-8')

def moses_detokenizer_(text):
    detokenizer_path = "src/tools/detokenize.perl"
    text = text 
    lang = "en" 
    log_info("moses detokenizing",MODULE_CONTEXT)
    pipe = subprocess.Popen(["perl", detokenizer_path, '-l', lang, text], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    pipe.stdin.write(text.encode('utf-8'))
    pipe.stdin.close()
    detokenized_output = pipe.stdout.read()
    return detokenized_output.strip().decode('utf-8')

def truecaser(text):
    truecaser_path = "tools/truecaser.perl"
    text = text 
    model = "truecaseModel_en100919"
    log_info("truecasing",MODULE_CONTEXT)
    pipe = subprocess.Popen(["perl", truecaser_path, '--model', model, text], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    pipe.stdin.write(text.encode('utf-8'))
    pipe.stdin.close()
    truecased_output = pipe.stdout.read()
    return truecased_output.strip().decode('utf-8')

def detruecaser(text):
    detruecaser_path = "tools/detrucaser.perl"
    text = text 
    log_info("detruecasing",MODULE_CONTEXT)
    pipe = subprocess.Popen(["perl", detruecaser_path, text], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    pipe.stdin.write(text.encode('utf-8'))
    pipe.stdin.close()
    detruecased_output = pipe.stdout.read()
    return detruecased_output.strip().decode('utf-8')    

def apply_bpe(bpe_model,text):
    log_info("subword encoding",MODULE_CONTEXT)
    codes = codecs.open(bpe_model, encoding='utf-8')
    bpe = subword_enc.BPE(codes)
    return bpe.process_line(text)

def decode_bpe(text):
    log_info("subword decoding",MODULE_CONTEXT)
    with open("intermediate_data/subword.txt","w") as f:
        f.write(text)
    # pipe = subprocess.call(["echo %s|sed -r 's/(@@ )|(@@ ?$)//g'" % text],shell=True)
    decoded_text = os.popen("sed -r 's/(@@ )|(@@ ?$)//g' intermediate_data/subword.txt").read()
    return decoded_text

def moses_tokenizer(text):
    #log_info("sacremoses_tokenizing",MODULE_CONTEXT)
    mt = MosesTokenizer(lang='en')
    tokenized_output = mt.tokenize(text, return_str=True)
    return tokenized_output

def moses_detokenizer(text):
    #log_info("sacremoses detokenizing",MODULE_CONTEXT)
    md = MosesDetokenizer(lang='en')
    detokenized_output = md.detokenize(text.split())
    return detokenized_output

