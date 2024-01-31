#!/bin/bash
#python app.py
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Malayalam.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Malayalam.traineddata?raw=true
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Devanagari.traineddata?raw=true
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Latin.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Latin.traineddata?raw=true
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Kannada.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Kannada.traineddata?raw=true
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Tamil.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Tamil.traineddata?raw=true
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Telugu.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Telugu.traineddata?raw=true
# curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Bengali.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Bengali.traineddata?raw=true

tam_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_tam.traineddata'
url_tam='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_tam.traineddata'

hin_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_hin.traineddata'
url_hin='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_hin.traineddata'

kan_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_kan.traineddata'
url_kan='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_kan.traineddata'


#rm $tam_modelpath
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


gunicorn -w 2 -b :5000 -t 200 wsgi:ocrapp
