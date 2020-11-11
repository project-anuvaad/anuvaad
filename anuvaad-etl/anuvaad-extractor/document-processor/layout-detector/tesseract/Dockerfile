#FROM anuvaadio/python3.6-opencv-4.1.0:7
#FROM python:3.7-slim
FROM ubuntu:20.04
# both files are explicitly required!
#COPY Pipfile Pipfile.lock ./

COPY / /app
WORKDIR /app

ENV DEBIAN_FRONTEND="noninteractive"

RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv

ENV VIRTUAL_ENV=/opt/venv
RUN python3.6 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

#RUN python3.6 -m venv bmenv
#SHELL ["/bin/bash", "-c", "source bmenv/bin/activate"]


RUN pip install --upgrade pip setuptools wheel &&\
  pip install scikit-build &&\
  pip install cmake &&\
  apt install -y libopencv-dev python3-opencv\
  && apt-get install -y tesseract-ocr \
  && apt-get install -y poppler-utils \
  && apt-get install -y curl

RUN pip install -r requirements.txt
RUN pip cache purge
#RUN pdftohtml -v

ARG D_F
ENV DEBUG_FLUSH=$D_F
# RUN apk update && apk add -U \
#       --virtual .build-dependencies \
#         build-base \
#         openblas-dev \
#         unzip \
#         wget \
#         cmake \
#         libjpeg-turbo-dev \
#         libpng-dev \
#         jasper-dev \
#         tiff-dev \
#         libwebp-dev \
#         clang-dev \
#         linux-headers
#RUN apk update
#RUN apk add libc6-compat
#RUN pip install -r requirements.txt
#RUN pip install torch===1.4.0 torchvision===0.5.0 -f https://download.pytorch.org/whl/torch_stable.html
#RUN apk update && apk add poppler-utils
# RUN apk update && apk add git
# RUN echo "|--> Updating" \
#     && apk update && apk upgrade \
#     && echo "|--> Install PyTorch" \
#     && git clone --recursive https://github.com/pytorch/pytorch \
#     && cd pytorch && python setup.py install \
#     && echo "|--> Install Torch Vision" \
#     && git clone --recursive https://github.com/pytorch/vision \
#     && cd vision && python setup.py install \
#     && echo "|--> Cleaning" \
#     && rm -rf /pytorch \
#     && rm -rf /root/.cache \
#     && rm -rf /var/cache/apk/* \
#     && apk del .build-deps \
#     && find /usr/lib/python3.6 -name __pycache__ | xargs rm -r \
#     && rm -rf /root/.[acpw]*
#



#RUN apk update && apk add curl

# RUN curl -L -o /usr/share/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Devanagari.traineddata
# RUN curl -L -o /usr/share/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
# RUN curl -L -o /usr/share/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata



RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Malayalam.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Malayalam.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Devanagari.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Latin.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/master/script/Latin.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Kannada.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/master/script/Kannada.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Tamil.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/master/script/Tamil.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Telugu.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/master/script/Telugu.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Bengali.traineddata https://github.com/tesseract-ocr/tessdata_best/blob/master/script/Bengali.traineddata

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["python", "app.py"]

#ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

