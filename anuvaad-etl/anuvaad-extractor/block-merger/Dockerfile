FROM anuvaadio/python3.6-opencv-4.1.0:2
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
RUN sed -i 's/v3.10/v3.12/g' /etc/apk/repositories 
RUN pip install -r requirements.txt
RUN apk update && apk add poppler-utils
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
ENTRYPOINT ["sh","/usr/bin/start.sh"]
