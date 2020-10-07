import tools.indic_detokenize as indic_detok
import tools.indic_tokenize as indic_tok
import tools.apply_bpe as subword_enc
import subprocess
import sys
import codecs
import os
from onmt.utils.logging import logger

def indic_tokenizer(s):
    logger.info("indic_tokenizing")
    return ' '.join(indic_tok.trivial_tokenize_indic(s))

def indic_detokenizer(s):
    logger.info("detokenizing using indic")
    return indic_detok.trivial_detokenize_indic(s)

def moses_tokenizer(text):
    logger.info("moses_tokenizing")
    tokenizer_path = "src/tools/tokenizer.perl" 
    text = text 
    lang = "en" 
    pipe = subprocess.Popen(["perl", tokenizer_path, '-l', lang, text], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    pipe.stdin.write(text.encode('utf-8'))
    pipe.stdin.close()
    tokenized_output = pipe.stdout.read()
    return tokenized_output.strip().decode('utf-8')

def moses_detokenizer(text):
    logger.info("moses_detokenizing")
    detokenizer_path = "src/tools/detokenize.perl"
    text = text 
    lang = "en" 
    logger.info("moses detokenizing")
    pipe = subprocess.Popen(["perl", detokenizer_path, '-l', lang, text], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    pipe.stdin.write(text.encode('utf-8'))
    pipe.stdin.close()
    detokenized_output = pipe.stdout.read()
    return detokenized_output.strip().decode('utf-8')

def truecaser(text):
    truecaser_path = "tools/truecaser.perl"
    text = text 
    model = "truecaseModel_en100919"
    logger.info("truecasing")
    pipe = subprocess.Popen(["perl", truecaser_path, '--model', model, text], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    pipe.stdin.write(text.encode('utf-8'))
    pipe.stdin.close()
    truecased_output = pipe.stdout.read()
    return truecased_output.strip().decode('utf-8')

def detruecaser(text):
    detruecaser_path = "tools/detrucaser.perl"
    text = text 
    logger.info("detruecasing")
    pipe = subprocess.Popen(["perl", detruecaser_path, text], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    pipe.stdin.write(text.encode('utf-8'))
    pipe.stdin.close()
    detruecased_output = pipe.stdout.read()
    return detruecased_output.strip().decode('utf-8')    

def apply_bpe(bpe_model,text):
    logger.info("subword encoding")
    codes = codecs.open(bpe_model, encoding='utf-8')
    bpe = subword_enc.BPE(codes)
    return bpe.process_line(text)

def decode_bpe(text):
    logger.info("subword decoding")
    with open("intermediate_data/subword.txt","w") as f:
        f.write(text)
    # pipe = subprocess.call(["echo %s|sed -r 's/(@@ )|(@@ ?$)//g'" % text],shell=True)
    decoded_text = os.popen("sed -r 's/(@@ )|(@@ ?$)//g' intermediate_data/subword.txt").read()
    return decoded_text

