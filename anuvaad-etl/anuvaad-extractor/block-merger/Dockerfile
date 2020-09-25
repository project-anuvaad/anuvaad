FROM anuvaadio/python3.6-opencv-4.1.0:7
COPY / /app
WORKDIR /app
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

RUN pip install -r requirements.txt
#RUN apk update && apk add poppler-utils
RUN apk update && apk add curl
RUN curl -L -o /usr/share/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Devanagari.traineddata
RUN curl -L -o /usr/share/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
RUN curl -L -o /usr/share/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
ENTRYPOINT ["sh","/usr/bin/start.sh"]
