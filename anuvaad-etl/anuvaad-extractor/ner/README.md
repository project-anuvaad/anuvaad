# NER

NER service annotate the text as per .

## Prerequisites
- python 3.7
- ubuntu 16.04

We have used sapcy to train NER model.
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
hit: ```http://0.0.0.0:5001/api/v0/ner-annotation```
### Request Format
```json
POST/ner-annotation
Accept list of files

{
        "files": [
            {
                "locale": "en",
                "path": "text file which contains paragraphs",
                "type": "txt"
            },
            {...},
            {...}
        ]}
```
### Response
```
POST/ner-annotation
Returns json which have anntated data.

{
    "files": [
        {
            "inputFile": "input text file of paragraphs",
            "outputFile": {
                "0": {
                    "ner": [
                             {
                              "annotation_tag": "Fixed tag",
                              "tagged_value": "value that has to be tagged"
                             },
                             {
                              "annotation_tag": "",
                              "tagged_value": ""
                             },
                             ......
                           ]
                },
                "1": {
                    "ner": []
                },
                ......
                "n": {}
                }
            },
            "outputLocale": "en",
            "outputType": "json"
        }
    ],
    "state": "NER PROCESSED",
    "status": "SUCCESS"
}
```
## License
[MIT](https://choosealicense.com/licenses/mit/)
