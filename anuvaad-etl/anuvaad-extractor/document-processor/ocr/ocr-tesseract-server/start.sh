#!/bin/bash
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/eng.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/hin.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Malayalam.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Malayalam.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Devanagari.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Latin.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Latin.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Kannada.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Kannada.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Tamil.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Tamil.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Telugu.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Telugu.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Bengali.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Bengali.traineddata?raw=true

tam_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_tam.traineddata"
url_tam="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_tam.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=CowFK0IhJ1EFIM8NVCAqVUxon8M%3D&Expires=1766687518"

hin_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_hin.traineddata"
url_hin="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_hin.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=RbghEZIRd9RFE5l8DCB0che703w%3D&Expires=1766687597"

kan_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_kan.traineddata"
url_kan="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_kan.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=U8dfCpsDzCpzb8mSto0padd1Tdc%3D&Expires=1768473758"

ben_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ben.traineddata"
url_ben="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ben.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=CMe5pWFDyVKq63nmFk91%2FvW%2BNqY%3D&Expires=1768473639"

mal_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mal.traineddata"
url_mal="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mal.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=%2FCWKdGK5XmGMZ16NnXNZic2hlFs%3D&Expires=1768473671"

mar_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mar.traineddata"
url_mar="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mar.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=5fcsqBO42d%2B7jQS1ra8fbmNL%2Bws%3D&Expires=1768473699"

ori_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ori.traineddata"
url_ori="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ori.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=PCRwTTSqO2QB%2FmHE8vNhAQunyLw%3D&Expires=1768473718"

ta_hw_path="./src/utilities/indic_hw_ocr/models/Tamil_indic_pretrained_best_wer.pth"
ta_hw="https://anuvaad-pubnet-weights.s3.amazonaws.com/tamil_indic_pretrained_best_wer.pth?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=v6CxjzuQtoX271FKjWr4i8N3jDg%3D&Expires=1766987053"
#rm $tam_modelpath

hi_hw_path="./src/utilities/indic_hw_ocr/models/Devanagari_indic_pretrained_best_wer.pth"
hi_hw="https://anuvaad-pubnet-weights.s3.amazonaws.com/hindi_indic_pretrained_best_wer.pth?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=YYvqhFAK6stC90anxJpybBBJv7I%3D&Expires=1766986966"

if ! [ -f $ta_hw_path ]; then
  curl -o $ta_hw_path $ta_hw
  echo downloading handwritten tamil weight file
fi

if ! [ -f $hi_hw_path ]; then
  curl -o $hi_hw_path $hi_hw
  echo downloading handwritten hindi weight file
fi

if ! [ -f $tam_modelpath ]; then
  curl -o $tam_modelpath $url_tam
  echo downloading tamil weight file
fi

if ! [ -f $hin_modelpath ]; then
  curl -o $hin_modelpath $url_hin
  echo downloading hindi weight file
fi

if ! [ -f $kan_modelpath ]; then
  curl -o $kan_modelpath $url_kan
  echo downloading kannada weight file
fi
if ! [ -f $ben_modelpath ]; then
  curl -o $ben_modelpath $url_ben
  echo downloading bengali weight file
fi
if ! [ -f $mal_modelpath ]; then
  curl -o $mal_modelpath $url_mal
  echo downloading malyalam weight file
fi
if ! [ -f $mar_modelpath ]; then
  curl -o $mar_modelpath $url_mar
  echo downloading marathi weight file
fi
if ! [ -f $ori_modelpath ]; then
  curl -o $ori_modelpath $url_ori
  echo downloading oriya weight file
fi

python app.py