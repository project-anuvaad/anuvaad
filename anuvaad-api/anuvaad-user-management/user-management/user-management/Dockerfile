#FROM amritha219942/user-management:1.0
FROM anuvaadio/python-opencv-slim:2
COPY / /app
WORKDIR /app
# RUN apt update
#RUN apt-get install -y python3-dev gcc
#--fix-missing \
#     build-essential \
#     cmake \
#     gfortran \
#     libmagic1 \
#     git \
#     wget \
#     curl \
#     graphicsmagick \
#     libgraphicsmagick1-dev \
#     libatlas-base-dev \
#     libavcodec-dev \
#     libavformat-dev \
#     libgtk2.0-dev \
#     libjpeg-dev \
#     liblapack-dev \
#     libswscale-dev \
#     pkg-config \
#     python3-dev \
#     python3-numpy \
#     software-properties-common \
#     zip \
#     && apt-get clean && rm -rf /tmp/* /var/tmp/*
RUN pip3 install -r requirements.txt
RUN pip3 install uwsgi
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
