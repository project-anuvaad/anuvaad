#FROM anuvaadio/python3.6-opencv-4.1.0:7
#FROM python:3.6-slim
#FROM anuvaadio/anuvaad-layout-detector-prima:4-ba5d7d74
#FROM ubuntu:20.04
# # both files are explicitly required!
# #COPY Pipfile Pipfile.lock ./

# COPY / /app
# WORKDIR /app

#ENV DEBIAN_FRONTEND="noninteractive"



# RUN apt-get update && apt-get install -y software-properties-common build-essential

# RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv python3.6-dev

# ENV VIRTUAL_ENV=/opt/venv
# RUN python3.6 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# RUN apt install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev

# RUN pip install --upgrade pip setuptools wheel
# #&&\
# #   pip install scikit-build &&\
# #   pip install cmake &&\

#FROM anuvaadio/python-opencv-slim:2

#FROM anuvaadio/anuvaad-block-segmenter:20-3a396ff9
#FROM continuumio/anaconda3
FROM anuvaadio/anuvaad-block-segmenter:39-c2d7b62b

COPY / /app
WORKDIR /app

#RUN apt-get install -y make git
# RUN apt-get update && apt-get install -y software-properties-common build-essential python3-pip
# RUN apt install -y libspatialindex-dev python3-rtree
# RUN apt install -y libopencv-dev python3-opencv
#
# RUN pip3 install -r requirements.txt
# RUN pip install anuvaad-auditor==1.0.0
#RUN pip install 'git+https://github.com/facebookresearch/detectron2.git#egg=detectron2'

#RUN pip cache purge


COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

