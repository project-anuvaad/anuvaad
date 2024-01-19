#!/bin/bash
#python app.py
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Malayalam.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Malayalam.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Devanagari.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Latin.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Latin.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Kannada.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Kannada.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Tamil.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Tamil.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Telugu.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Telugu.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Bengali.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Bengali.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Gujarati.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Gujarati.traineddata?raw=true
curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Oriya.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/main/script/Oriya.traineddata?raw=true

tam_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_tam.traineddata'
#url_tam='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_tam.traineddata?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=X6%2BwKdeOyOUFlOFs%2B7eRmzhziZ0%3D&Expires=1693557258'
url_tam='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvad_tam_scene_text_real.traineddata'
hin_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_hin.traineddata'
hin_scene_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvad_hin_scene_text_real.traineddata'
url_hin='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_hin.traineddata'
url_hin_scene='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvad_hin_scene_text_real.traineddata'
kan_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_kan.traineddata'
url_kan='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_kan.traineddata'

ben_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ben.traineddata'
url_ben='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ben.traineddata'

mal_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mal.traineddata'
url_mal='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mal.traineddata'

mar_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mar.traineddata'
url_mar='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mar.traineddata'

ori_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ori.traineddata'
url_ori='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ori.traineddata'

scene_text_line_detection_modelpath='./src/utilities/primalinenet/scene_text_judgement_line_detection_v1_model.pth'
url_scene_text_line_detection_modelpath='https://anuvaad-pubnet-weights.s3.amazonaws.com/scene_text_judgement_line_detection_v1_model.pth'

scene_text_east_angle_detection_modelpath='./src/utilities/east/east-model.ckpt-49491.data-00000-of-00001'
url_scene_text_east_angle_detection_modelpath='https://anuvaad-pubnet-weights.s3.amazonaws.com/east-model.ckpt-49491.data-00000-of-00001'



if ! [ -f $scene_text_line_detection_modelpath ]; then
  curl -o $scene_text_line_detection_modelpath $url_scene_text_line_detection_modelpath
  echo downloading line detection weight file
fi
if ! [ -f $scene_text_east_angle_detection_modelpath ]; then
  curl -o $scene_text_east_angle_detection_modelpath $url_scene_text_east_angle_detection_modelpath
  echo downloading line detection weight file
fi
rm $tam_modelpath
if ! [ -f $tam_modelpath ]; then
  curl -o $tam_modelpath $url_tam
  echo downloading tamil weight file
fi

if ! [ -f $hin_modelpath ]; then
  curl -o $hin_modelpath $url_hin
  echo downloading hindi weight file
fi

if ! [ -f $hin_scene_modelpath ]; then
  curl -o $hin_scene_modelpath $url_hin_scene
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


python3 app.py
#gunicorn -w 2 -b :5000 -t 200 wsgi:ocrapp
