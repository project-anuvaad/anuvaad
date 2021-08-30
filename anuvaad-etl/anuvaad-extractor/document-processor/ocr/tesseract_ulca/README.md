# TOKENISATION

Tokenisation service Converts a paragraph into sentences.

## Prerequisites
- python 3.7
- ubuntu 16.04

You need to install some libraries. I have specified the names and versions of python libraries in requirements.txt
```bash
pip install -r requirements.txt
```
## APIs and Documentation
After successful installation of prerequisites, you will have to run app.py

```bash
python app.py
```

Some clarity on io, would be gcp link will downloadable with curl ?
Change in structure of contract 


Changes in contract defination :
https://raw.githubusercontent.com/ULCA-IN/ulca/master/specs/model-schema.yml
https://github.com/project-anuvaad/ULCA/blob/main/specs/document-ocr-schema.yml

following :



A tesseract service with rest interface:
input : image 
ouput : [sentences]

hindi and Tamil use custom weights : {mapping with language codes }

detect and download

tesseract --- two option over entire image, over co-ordinates 

Line level grouping 
generate response 


gunicorn -w 3 -b :5001 -t 100 wsgi:app



