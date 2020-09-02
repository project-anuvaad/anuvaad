FROM anuvaadio/python3.6-opencv-4.1.0:5
COPY / /app
WORKDIR /app
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

RUN apk add tesseract-ocr
RUN apk add tesseract-ocr-all
#RUN apk add tesseract-ocr-kan
#RUN apk add tesseract-ocr-mar
RUN pip add -r requirements.txt
RUN apk update && apk add poppler-utils
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
ENTRYPOINT ["sh","/usr/bin/start.sh"]
