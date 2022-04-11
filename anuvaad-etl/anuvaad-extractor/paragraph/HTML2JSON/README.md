# HTML2JSON

HTML2JSON service Converts a html file into a required json format as per our need.

## Prerequisites
- python 3.7
- ubuntu 16.04

For HTML2JSON conversion, I have used this html2json opensource tool.
```
https://github.com/garyhurtz/html2json.py.git
```

You need to install some libraries. I have specified the names and versions of python libraries in requirements.txt
```bash
pip install -r requirements.txt
```
## APIs and Documentation
After successful installation of prerequisites, you will have to run app.py

```bash
python app.py
```
For every html file, user will receive json format of each tag that contains text. For example, this is json of single 'p' tag containing text:
```json
{
    "class": "ft00",
    "class_style": {
        "color": "#000009",
        "font-family": "BAAAAA+DejaVuSans",
        "font-size": "18px"
    },
    "is_bold": true,
    "page_height": "1263",
    "page_no": "1",
    "page_width": "892",
    "style": "position:absolute;top:108px;left:688px;white-space:nowrap",
    "text": "--------",
    "x": "688",
    "y": "108"
}
```
After initiating this service, hit: ```http://0.0.0.0:5001/api/v0/html-to-json```
### Request Format
```
POST/html-to-json
Accept list of files.

{
    "files": [ {
                "htmlFolderPath": "html files directory",
                "imageFolderPath": "image files directory",
                "locale": "en",
                "type": "folder"
               },
               {....},
               {....}   
        ]}
```
### Response
```
POST/html-to-json
Returns directory path which have html and image files.

{
    {
    "files": [
        {
            "inputFile": "input html files directory",
            "inputImageFolderPath": "directory containing image files",
            "outputHtml2JsonFilePath": {
                "0": {
                    "html_nodes": [
                         {
                            "class": "ft00",
                            "class_style": {
                                "color": "#000009",
                                "font-family": "BAAAAA+DejaVuSans",
                                "font-size": "18px"
                            },
                            "is_bold": true,
                            "page_height": "1263",
                            "page_no": "1",
                            "page_width": "892",
                            "style": "position:absolute;top:108px;left:688px;white-space:nowrap",
                            "text": "REPORTABLE",
                            "x": "688",
                            "y": "108"
                        },
                        .....
                        {}]},
                "1" : {},
                .....
                "n" : {}
            },
            "outputLocale": "en",
            "outputType": "json"
        },
        {....},
        {....}
    ],
    "state": "HTML-TO-JSON-PROCESSED",
    "status": "SUCCESS"
}
```
For more information about api documentation, please check @ ```https://github.com/project-anuvaad/anuvaad/blob/dev-sentence/anuvaad-etl/anuvaad-extractor/paragraph/HTML2JSON/docs/html2json-api-contract.yml```
## License
[MIT](https://choosealicense.com/licenses/mit/)
