# PDF2HTML

PDF2HTML service Converts a pdf file into html and image files pagewise.

## Prerequisites
- python 3.7
- ubuntu 16.04
- system install  ```sudo apt-get install -y poppler-utils```

You need to install some libraries. I have specified the names and versions of python libraries in requirements.txt
```bash
pip install -r requirements.txt
```
## APIs and Documentation
After successful installation of prerequisites, you will have to run app.py

```bash
python app.py
```
This service is used to convert pdf file into html and image files pagewise. After initiating this service,
hit: ```http://0.0.0.0:5001/api/v0/pdf-to-html```
### Request Format
```
POST/pdf-to-html
Accept list of files.

{
        "files": [
            {
                "locale": "en",
                "path": "pdf file",
                "type": "txt"
            },
            {....},
            {....}   
        ]}
```
### Response
```
POST/pdf-to-html
Returns directory path which have html and image files.

{
    "files": [
        {
            "inputFile": "input pdf file",
            "outputHtmlFilePath": "directory containing html files",
            "outputImageFilePath": "directory containing image files",
            "outputLocale": "en",
            "outputType": "directory"
        },
        {....},
        {....}
    ],
    "state": "PDF-TO-HTML-PROCESSED",
    "status": "SUCCESS"
}
```
For more information about api documentation, please check @ ```https://github.com/project-anuvaad/anuvaad/blob/dev-sentence/anuvaad-etl/anuvaad-extractor/paragraph/PDF2HTML/docs/pdf2html-api-contract.yml```
## License
[MIT](https://choosealicense.com/licenses/mit/)
