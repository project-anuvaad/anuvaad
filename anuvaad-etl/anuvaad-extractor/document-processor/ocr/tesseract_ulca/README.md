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

Changes in contract defination :
https://raw.githubusercontent.com/ULCA-IN/ulca/master/specs/model-schema.yml
https://github.com/project-anuvaad/ULCA/blob/main/specs/document-ocr-schema.yml

following :



A tesseract service with rest interface:
input : image 
ouput : [sentences]

Hindi and Tamil use custom weights

detection of language and downloading tess-best weights if not already avilable  

tesseract --- two option over entire image, over co-ordinates 
