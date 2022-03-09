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
url_tam='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_tam.traineddata?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=X6%2BwKdeOyOUFlOFs%2B7eRmzhziZ0%3D&Expires=1693557258'

hin_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_hin.traineddata'
url_hin='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_hin.traineddata?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=2l%2F0OwWQrD%2FIvogfijATPufjMLA%3D&Expires=1693557740'

kan_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_kan.traineddata'
url_kan='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_kan.traineddata?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=gDiNsqrV0n2%2BWZSMwesyqkLOYZ8%3D&Expires=1694149503'

ben_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ben.traineddata'
url_ben='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ben.traineddata?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=ku%2FdynTtJVvaf55dwYC%2FMt3pKqo%3D&Expires=1698743313'

mal_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mal.traineddata'
url_mal='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mal.traineddata?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=hX%2Bo%2BTTvwoN7IBcX%2FIgFTwMHoGs%3D&Expires=1698743610'

mar_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_mar.traineddata'
url_mar='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_mar.traineddata?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=aTu5Ps9hL90clfPMZIVOEPx5%2Fl0%3D&Expires=1698743699'

ori_modelpath='/usr/share/tesseract-ocr/4.00/tessdata/anuvaad_ori.traineddata'
url_ori='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_ori.traineddata?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=5aqEjjOryEhE4ElV2i8oHgVY%2F7I%3D&Expires=1698743792'

scene_text_line_detection_modelpath='./src/utilities/primalinenet/scene_text_judgement_line_detection_v1_model.pth'
url_scene_text_line_detection_modelpath='https://anuvaad-pubnet-weights.s3.amazonaws.com/scene_text_judgement_line_detection_v1_model.pth?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=zTv5bP4Pt6NoLN%2FLUC7JrLBBrxs%3D&Expires=1705824951'

scene_text_east_angle_detection_modelpath='./src/utilities/east/east-model.ckpt-49491.data-00000-of-00001'
url_scene_text_east_angle_detection_modelpath='https://anuvaad-pubnet-weights.s3.amazonaws.com/east-model.ckpt-49491.data-00000-of-00001?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=XbR8OnEhYISllPYYuYkzFhmovUY%3D&Expires=1707278033'

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
