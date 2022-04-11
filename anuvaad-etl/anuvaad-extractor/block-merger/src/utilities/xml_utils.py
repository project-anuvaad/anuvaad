import os
import shutil
import glob
import pdf2image
from lxml import etree
from pathlib import Path
import base64
import pandas as pd
from anuvaad_auditor.loghandler import log_info
from anuvaad_auditor.loghandler import log_error

def get_top(style):
    top = style.split(';')[1]
    return top.split(':')[1].strip('px')

def bubble_sort_html(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if int(get_top(arr[j].attrib['style'])) > int(get_top(arr[j+1].attrib['style'])) :
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def bubble_sort_xml(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if int(arr[j].attrib['top']) > int(arr[j+1].attrib['top']) :
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def get_string_xmltree(xml):
    return etree.tostring(xml)

def get_xml_tree(xml_string):
    return etree.fromstring(xml_string)

def get_xmltree(filepath, parse='xml'):
    if parse == 'html':
        parser = etree.HTMLParser()
        tree   = etree.parse(open(filepath, mode='r', encoding='utf-8'), parser)
        return tree
    else:
        with open(filepath,encoding='utf-8') as file:
            xml_string    = file.read()
            return etree.fromstring(bytes(xml_string, encoding='utf-8'))

        

    return None

def check_html_element_is(element, type_char):
    word_schema1 = 'http://www.w3.org/1999/xhtml'
    word_schema2 = 'http://purl.oclc.org/ooxml/wordprocessingml/main'
     
    return (element.tag == '{%s}%s' % (word_schema1, type_char)) or (element.tag == '{%s}%s' % (word_schema2, type_char))

def check_element_is(element, type_char):     
    return (element.tag == type_char)

def get_specific_tags(node, type_char):
    nodes = []
    for elem in node.iter():
        if check_element_is(elem, type_char):
            nodes.append(elem)
    return nodes

def get_page_texts_ordered(node, tag):
    texts = get_specific_tags(node, tag)
    return bubble_sort_xml(texts)

def get_xml_font_info(fontspecs, font_index):
    for fontspec in fontspecs:
        if fontspec.attrib['id'] == font_index:
            return fontspec.attrib['size'], fontspec.attrib['family'], fontspec.attrib['color']

def get_page_text_element_attrib(fontspecs, page, text):
    font_size, font_family, font_color = get_xml_font_info(fontspecs, text.attrib['font'])
    
    return  int(page.attrib['top']), int(page.attrib['left']), int(page.attrib['width']), int(page.attrib['height']), \
            int(text.attrib['top']), int(text.attrib['left']), int(text.attrib['width']), int(text.attrib['height']),\
            int(font_size), font_family, font_color,\
            ''.join(text.itertext())

def get_page_image_element_attrib(page, image):

    with open(image.attrib['src'], "rb") as img_file:
        img_base64 = base64.b64encode(img_file.read())

        return  int(page.attrib['top']), int(page.attrib['left']), int(page.attrib['width']), int(page.attrib['height']), \
                int(image.attrib['top']), int(image.attrib['left']), int(image.attrib['width']), int(image.attrib['height']),\
                img_base64
    
    return  int(page.attrib['top']), int(page.attrib['left']), int(page.attrib['width']), int(page.attrib['height']), \
            int(image.attrib['top']), int(image.attrib['left']), int(image.attrib['width']), int(image.attrib['height']),\
            None

def get_image_base64(filepath):
    with open(filepath, "rb") as img_file:
        img_base64 = base64.b64encode(img_file.read())
    return img_base64


def get_html_page_df(nodes):
    tops  = []
    lefts = []
    texts = []
    lengths = []
    
    for node in nodes:
        attribs      = node.attrib['style'].split(';')
        top_attrib   = attribs[1].split(':')
        left_attrib  = attribs[2].split(':')
        
        tops.append(int(top_attrib[1][:-2]))
        lefts.append(int(left_attrib[1][:-2]))
        texts.append(''.join(node.itertext()))
        lengths.append(len(''.join(node.itertext())))
    
    # create dataframe
    df = pd.DataFrame(list(zip(tops, lefts, texts, lengths)),
                      columns=['text_top', 'text_left', 'text', 'text_length'])
    return df
        
'''
    - get n-gram of provided list
'''
def get_ngram(indices, window_size = 2):  
    ngrams = []
    count  = 0
    for token in indices[:len(indices)-window_size+1]:
        ngrams.append(indices[count:count+window_size])  
        count = count+1  
    return ngrams

'''
Check if  input pdf is digital or scanned 
'''
def check_text(xml_dfs) :
    if xml_dfs !=None:
        text_count = 0
        for xml_df in xml_dfs:
            text_count += len(xml_df)
        return text_count
    else:
        return 0