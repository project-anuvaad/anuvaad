


A tesseract service with rest interface:
input : image url
ouput : [sentences]

Hindi and Tamil use custom weights

detection of language and downloading tess-best weights if not already avilable  

sample curl :

curl --location --request POST 'http://0.0.0.0:5000/anuvaad/ocr/v0/ulca-ocr' \
--header 'Content-Type: application/json' \
--data-raw '{
    "config": {
        "language": {
            "sourceLanguage": "en"
        }
    },
    "imageUri": ["https://anuvaad-raw-datasets.s3-us-west-2.amazonaws.com/anuvaad_ocr_english.jpg"
        
    ]
    }
'



