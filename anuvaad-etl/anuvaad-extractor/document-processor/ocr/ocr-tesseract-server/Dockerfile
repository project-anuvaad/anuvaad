
# FROM ubuntu:20.04

# COPY / /app
# WORKDIR /app

# ENV DEBIAN_FRONTEND="noninteractive"

# RUN apt-get update && apt-get install -y software-properties-common build-essential
# RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv python3.6-dev

# ENV VIRTUAL_ENV=/opt/venv
# RUN python3.6 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# RUN apt install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev

# RUN pip install --upgrade pip setuptools wheel && apt-get install -y poppler-utils 

# RUN pip install -r requirements.txt
# RUN pip cache purge

FROM anuvaadio/anuvaad-ocr-gv-server:10-0ee3dde0
#FROM anuvaadio/python-opencv-slim:2
COPY / /app
WORKDIR /app
#RUN apt install -y libspatialindex-dev python-rtree
RUN pip install -r requirements.txt
RUN apt-get install -y tesseract-ocr \
   && apt-get install -y curl

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

