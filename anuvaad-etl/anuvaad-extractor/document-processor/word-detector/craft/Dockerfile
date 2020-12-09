#FROM anuvaadio/python3.6-opencv-4.1.0:7
# FROM python:3.6-slim
# #FROM ubuntu:20.04
# #FROM wd2:latest
# # both files are explicitly required!
# #COPY Pipfile Pipfile.lock ./

# COPY / /app
# WORKDIR /app

# ENV DEBIAN_FRONTEND="noninteractive"



# RUN apt-get update && apt-get install -y software-properties-common build-essential

# #RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv python3.6-dev

# # ENV VIRTUAL_ENV=/opt/venv
# # RUN python3.6 -m venv $VIRTUAL_ENV
# # ENV PATH="$VIRTUAL_ENV/bin:$PATH"
# #
# RUN apt install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev python3-dev

# RUN pip install --upgrade pip setuptools wheel
# #&&\
# #   pip install scikit-build &&\
# #   pip install cmake &&\
# RUN apt install -y libopencv-dev python3-opencv

# #RUN apt-get install -y make git
# RUN pip install -r requirements.txt
# #RUN pip install 'git+https://github.com/facebookresearch/detectron2.git#egg=detectron2'
# RUN apt-get install poppler-utils

#RUN pip cache purge
FROM anuvaadio/python-opencv-slim:1
COPY / /app
WORKDIR /app
RUN pip install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

