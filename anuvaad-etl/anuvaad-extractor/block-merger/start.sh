#!/bin/bash
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/eng.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/hin.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Malayalam.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Malayalam.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Devanagari.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Latin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Latin.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Kannada.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Kannada.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Tamil.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Tamil.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Telugu.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Telugu.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Bengali.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Bengali.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Arabic.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Arabic.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Gurmukhi.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/script/Gurmukhi.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/asm.traineddata https://github.com/tesseract-ocr/tessdata/raw/main/asm.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/bod.traineddata https://github.com/tesseract-ocr/tessdata/raw/main/bod.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/san.traineddata https://github.com/tesseract-ocr/tessdata/raw/main/san.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/guj.traineddata https://github.com/tesseract-ocr/tessdata/raw/main/guj.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/nep.traineddata https://github.com/tesseract-ocr/tessdata/raw/main/nep.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/sin.traineddata https://github.com/tesseract-ocr/tessdata/raw/main/sin.traineddata

modelpath='./src/utilities/primalaynet/model_final.pth'
#aws s3 presign s3://anuvaad-pubnet-weights/model_final.pth --expires-in 60480000
#url='https://anuvaad-pubnet-weights.s3.amazonaws.com/model_final.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB&Signature=tkvJtYR4bYKrkyRUX1RPC%2B1Et7s%3D&Expires=1672216087'
url="https://anuvaad-pubnet-weights.s3.amazonaws.com/model_final.pth?AWSAccessKeyId=$AWSACCESSKEYID_VALUE&Signature=1RvNYy98Xtx3GqdaLhcB0YIiekA%3D&Expires=1754637778"
# rm $modelpath
if ! [ -f $modelpath ]; then
  echo Downloading PRIMA weights
  curl -o $modelpath $url
fi


python app.py
