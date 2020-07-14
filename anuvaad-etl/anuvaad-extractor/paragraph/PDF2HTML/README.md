# PDF2HTML

PDF2HTML service Converts a pdf file into html and image files pagewise.

## Prerequisites

You need to install system application for pdf2html. I am using ubuntu 16.04 and python 3.7.7.

```bash
sudo apt-get install poppler-utils
```
You need to install some libraries. I have specified the names and versions of python libraries in requirements.txt
```bash
pip install -r requirements.txt
```
## Usage
After successful installation of prerequisites, you will have to run app.py

```bash
python app.py
```
For every pdf file, user will receive html and image files for every page of pdf.


## License
[MIT](https://choosealicense.com/licenses/mit/)
