#FROM anuvaadio/python3.6-opencv-4.1.0:7
#FROM python:3.7-slim
FROM anuvaadio/anuvaad-layout-detector-prima:4-ba5d7d74
# FROM ubuntu:20.04
# # both files are explicitly required!
# #COPY Pipfile Pipfile.lock ./

# COPY / /app
# WORKDIR /app

# ENV DEBIAN_FRONTEND="noninteractive"



# RUN apt-get update && apt-get install -y software-properties-common build-essential

# RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv python3.6-dev

# ENV VIRTUAL_ENV=/opt/venv
# RUN python3.6 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# RUN apt install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev
#RUN apt-get install -y curl


RUN apt-get update && apt-get install -y libcurl4-gnutls-dev
# RUN pip install --upgrade pip setuptools wheel
# #&&\
# #   pip install scikit-build &&\
# #   pip install cmake &&\
# RUN apt install -y libopencv-dev python3-opencv

#FROM anuvaadio/python-opencv-slim:2
COPY / /app
WORKDIR /app

#RUN apt-get install -y make git
RUN pip install -r requirements.txt
#RUN pip install 'git+https://github.com/facebookresearch/detectron2.git#egg=detectron2'

#RUN pip cache purge

#Run curl https://anuvaad-pubnet-weights.s3.amazonaws.com/model_final.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB&Signature=6js6H28bUyOEmYek2FTbWf3AlS8%3D&Expires=1611584082
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

