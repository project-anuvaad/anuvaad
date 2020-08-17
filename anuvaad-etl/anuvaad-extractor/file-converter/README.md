# FILE CONVERTER

This Service converts different file format supported by Libreoffice to PDF.

## Prerequisites
- python 3.7
- ubuntu 17.04
- libreoffice

You need to install some libraries. I have specified the names and versions of python libraries in requirements.txt
```bash
pip install -r requirements.txt
```
## APIs and Documentation
After successful installation of prerequisites, you will have to run app.py

```bash
python app.py
```
This service is used to tokenise sentences from a paragraph. After initiating this service,
hit: ```http://0.0.0.0:5001/api/v0/convert-pdf```
### Request Format
```json
POST/convert-pdf
Accept single filename

{
	"filename":"file id"
}

```
### Response
```
POST/convert-pdf
Returns file path for generated pdf file

{
  "count": 0,
  "data": "cd95c0c8-aba9-4660-a9c7-9b041b1c937e.pdf",
  "http": {
    "status": 200
  },
  "ok": true,
  "why": "request successful"
}
```
For more information about api documentation, please check @ ```https://github.com/project-anuvaad/anuvaad/blob/dev-sentence/anuvaad-etl/anuvaad-extractor/file-converter/docs/pdf-converter-api-contract.yml```
## License
[MIT](https://choosealicense.com/licenses/mit/)
