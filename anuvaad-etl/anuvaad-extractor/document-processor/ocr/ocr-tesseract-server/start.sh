#!/bin/bash
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Malayalam.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Malayalam.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Devanagari.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Latin.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Latin.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Kannada.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Kannada.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Tamil.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Tamil.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Telugu.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Telugu.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Bengali.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Bengali.traineddata?raw=true

tam_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_tam.traineddata"
url_tam="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_tam.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=g9dkSw6f5uFQ3YAhK2VsuWqEn9E%3D&Expires=1702454086"

hin_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_hin.traineddata"
url_hin="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_hin.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=%2BlmA7lZYPHHJA1TRYD20tawzrVM%3D&Expires=1702454120"

kan_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_kan.traineddata"
url_kan="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_kan.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=sKWhdkS1Ddd037%2FeK2IfgsDJSl8%3D&Expires=1702454148"

ben_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ben.traineddata"
url_ben="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ben.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=MXYh1ywXM43cPtoHhAeM4LfSXiQ%3D&Expires=1702454172"

mal_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mal.traineddata"
url_mal="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mal.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=jiNEPQzfpx6gOVIWBezZrYGqCH8%3D&Expires=1702454197"

mar_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mar.traineddata"
url_mar="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mar.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=%2BAPtcF%2FE0ftX%2BOvgJH%2BRD%2BcV7tU%3D&Expires=1702454214"

ori_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ori.traineddata"
url_ori="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ori.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=e%2BZ2y%2BS15yZuYFiqqGTIcnNzBM8%3D&Expires=1702454243"

rm $tam_modelpath
if ! [ -f $tam_modelpath ]; then
  curl -o $tam_modelpath $url_tam
  echo downloading tamil weight file
fi
rm $hin_modelpath
if ! [ -f $hin_modelpath ]; then
  curl -o $hin_modelpath $url_hin
  echo downloading hindi weight file
fi
rm $kan_modelpath
if ! [ -f $kan_modelpath ]; then
  curl -o $kan_modelpath $url_kan
  echo downloading kannada weight file
fi
rm $ben_modelpath
if ! [ -f $ben_modelpath ]; then
  curl -o $ben_modelpath $url_ben
  echo downloading bengali weight file
fi
rm $mal_modelpath
if ! [ -f $mal_modelpath ]; then
  curl -o $mal_modelpath $url_mal
  echo downloading malyalam weight file
rm $mar_modelpath
if ! [ -f $mar_modelpath ]; then
  curl -o $mar_modelpath $url_mar
  echo downloading marathi weight file
fi
rm $ori_modelpath
if ! [ -f $ori_modelpath ]; then
  curl -o $ori_modelpath $url_ori
  echo downloading oriya weight file
fi

python app.py