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
This service is used to tokenise sentences from a paragraph. After initiating this service,
hit: ```http://0.0.0.0:5001/api/v0/tokenisation```
### Request Format
```json
POST/tokenisation
Accept list of files

{
        "files": [
            {
                "locale": "en",
                "path": "text file which contains paragraphs",
                "type": "txt"
            },
            {....},
            {....}
        ]}
```
### Response
```
POST/tokenisation
Returns txt file which have tokenised sentences

{
    "files": [
        {
            "inputFile": "input txt file",
            "outputFile": "text file conaining tokenised sentences",
            "outputLocale": "en",
            "outputType": "txt"
        },
        {....},
        {....}
    ],
    "state": "SENTENCE-TOKENISED",
    "status": "SUCCESS"
}
```
For more information about api documentation, please check @ ```https://github.com/project-anuvaad/anuvaad/blob/dev-sentence/anuvaad-etl/anuvaad-extractor/sentence/docs/sentence-api-contarct.yml```
## License
[MIT](https://choosealicense.com/licenses/mit/)
