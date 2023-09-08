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

AWSACCESSKEYID_VALUE="${AWSAccessKeyId}"
tam_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_tam.traineddata"
url_tam="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_hin.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=VRBCFPq%2FBqLQ%2B7LScEElRLa88Gc%3D&Expires=3419778762"

hin_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_hin.traineddata"
url_hin="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_hin.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=VRBCFPq%2FBqLQ%2B7LScEElRLa88Gc%3D&Expires=3419778762"

kan_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_kan.traineddata"
url_kan="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mal.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=hpor%2Fh1cheEGSvZK%2FUvyOa44CkE%3D&Expires=3419847488"

ben_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ben.traineddata"
url_ben="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mal.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=hpor%2Fh1cheEGSvZK%2FUvyOa44CkE%3D&Expires=3419847488"

mal_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mal.traineddata"
url_mal="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mal.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=hpor%2Fh1cheEGSvZK%2FUvyOa44CkE%3D&Expires=3419847488"

mar_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mar.traineddata"
url_mar="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mar.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=9F2qX6iKxOucOM%2FI4bc9ocOmVFA%3D&Expires=3419847534"

ori_modelpath="/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ori.traineddata"
url_ori="https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ori.traineddata?AWSAccessKeyId=${AWSACCESSKEYID_VALUE}&Signature=umHUkGq2K%2FA5xlfogBFypadiXD4%3D&Expires=3419847575"

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
fi
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