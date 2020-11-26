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


sudo apt install libspatialindex-dev python-rtree


COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["python", "app.py"]

#ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

