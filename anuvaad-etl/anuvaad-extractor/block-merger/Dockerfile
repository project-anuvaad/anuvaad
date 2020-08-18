FROM anuvaadio/python3.6-opencv-4.1.0:1
COPY / /app
WORKDIR /app
RUN apk update && apk add -U \
      --virtual .build-dependencies \
        build-base \
        openblas-dev \
        unzip \
        wget \
        cmake \
        libjpeg-turbo-dev \
        libpng-dev \
        jasper-dev \
        tiff-dev \
        libwebp-dev \
        clang-dev \
        linux-headers
RUN pip install -r requirements.txt
RUN apk update && apk add poppler-utils
ENTRYPOINT ["sh","/usr/bin/start.sh"]
