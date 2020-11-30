#FROM anuvaadio/python3.6-opencv-4.1.0:7
#FROM python:3.6-slim
FROM ubuntu:20.04
# both files are explicitly required!
#COPY Pipfile Pipfile.lock ./

COPY / /app
WORKDIR /app

ENV DEBIAN_FRONTEND="noninteractive"

RUN apt-get update && apt-get install -y software-properties-common build-essential
RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv python3.6-dev

ENV VIRTUAL_ENV=/opt/venv
RUN python3.6 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN apt install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev

#RUN python3.6 -m venv bmenv
#SHELL ["/bin/bash", "-c", "source bmenv/bin/activate"]
# RUN apt-get update && apt-get install wget build-essential cmake libfreetype6-dev pkg-config libfontconfig-dev libjpeg-dev libopenjp2-7-dev -y
# RUN wget https://poppler.freedesktop.org/poppler-data-0.4.9.tar.gz \
#     && tar -xf poppler-data-0.4.9.tar.gz \
#     && cd poppler-data-0.4.9 \
#     && make install \
#     && cd .. \
#     && wget https://poppler.freedesktop.org/poppler-20.08.0.tar.xz \
#     && tar -xf poppler-20.08.0.tar.xz \
#     && cd poppler-20.08.0 \
#     && mkdir build \
#     && cd build \
#     && cmake .. \
#     && make \
#     && make install \
#     && ldconfig

RUN pip install --upgrade pip setuptools wheel && apt-get install -y poppler-utils 

RUN pip install -r requirements.txt
RUN pip cache purge


COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

