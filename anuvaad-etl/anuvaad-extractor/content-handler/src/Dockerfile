FROM python:3.7-slim
COPY / /app
WORKDIR /app
RUN apt update
RUN apt-get install -y --fix-missing \
    build-essential \
    cmake \
    gfortran \
    libmagic1 \
    git \
    wget \
    curl \
    graphicsmagick \
    libgraphicsmagick1-dev \
    libatlas-base-dev \
    libavcodec-dev \
    libavformat-dev \
    libgtk2.0-dev \
    libjpeg-dev \
    liblapack-dev \
    libswscale-dev \
    pkg-config \
    python3-dev \
    python3-numpy \
    software-properties-common \
    zip \
    && apt-get clean && rm -rf /tmp/* /var/tmp/*
RUN pip3 install -r requirements.txt
RUN pip3 install uwsgi
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]