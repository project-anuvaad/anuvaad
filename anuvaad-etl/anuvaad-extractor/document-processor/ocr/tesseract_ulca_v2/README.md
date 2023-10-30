
# Anuvaad OCR

Open source OCR models for Indic Languages, developed and used as part of project Anuvaad.
Repo contains tesseract service with REST interface, which is ULCA compliant:

input : image url
ouput : [sentences]

Hindi and Tamil use custom weights

detection of language and downloads tess-best weights if not already avilable  

**Sample curl** :



    curl --location 'http://localhost:5000/anuvaad/ocr/v0/ulca-ocr' \
    --header 'Content-Type: application/json' \
    --data '{
        "image" : [
                   { 
                      "imageUri": "https://anuvaad-raw-datasets.s3-us-west-2.amazonaws.com/anuvaad_ocr_hindi.jpg"
                   }
                ],
        "config": {
            "languages": [{
                   "sourceLanguage" : "hi"
            }]
        }
    }'
'

**Sample Response:**
```json
{
    "output" :  [
        {        
        "source" : "बिपिन रावत का एक माचिस की डिबिया के कारण हुआ था"
        }
          ],           
    "status" : {  
        "statusCode" : 200 ,
        "message" : "success"     
    }
}

```
**Deployment**
## **Deployment**
*Credentials must be added after cloning the repo*

```shell

docker build -t anuvaad_ocr_ulca_v2 .
docker run --name anuvaad_ocr_ulca_v2 -d --network host anuvaad_ocr_ulca_v2 
```


