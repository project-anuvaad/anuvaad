#FROM anuvaadio/python3.6-opencv-4.1.0:7
#FROM python:3.7-slim
#FROM ubuntu:20.04
FROM anuvaadio/anuvaad-block-merger:171-7788dd03
# both files are explicitly required!
#COPY Pipfile Pipfile.lock ./

COPY / /app
WORKDIR /app

ENV DEBIAN_FRONTEND="noninteractive"



RUN apt-get update && apt-get install -y software-properties-common build-essential

RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv

ENV VIRTUAL_ENV=/opt/venv
RUN python3.6 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN apt install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev python3.6-dev

RUN pip install --upgrade pip setuptools wheel
#&&\
#   pip install scikit-build &&\
#   pip install cmake &&\
RUN apt install -y libopencv-dev python3-opencv

RUN apt-get install -y make git
RUN pip install -r requirements.txt
RUN pip install 'git+https://github.com/facebookresearch/detectron2.git#egg=detectron2'



RUN apt install -y curl
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Malayalam.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Malayalam.traineddata
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Devanagari.traineddata
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Latin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Latin.traineddata
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Kannada.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Kannada.traineddata
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Tamil.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Tamil.traineddata
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Telugu.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Telugu.traineddata
# RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Bengali.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Bengali.traineddata

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

