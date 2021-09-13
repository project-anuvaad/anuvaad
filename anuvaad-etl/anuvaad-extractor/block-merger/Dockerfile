#FROM anuvaadio/python3.6-opencv-4.1.0:7
#FROM python:3.7-slim
# FROM ubuntu:20.04
# # both files are explicitly required!
# #COPY Pipfile Pipfile.lock ./

# COPY / /app
# WORKDIR /app

# ENV DEBIAN_FRONTEND="noninteractive"

# RUN apt-get update && apt-get install -y software-properties-common
# RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv

# ENV VIRTUAL_ENV=/opt/venv
# RUN python3.6 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"

#RUN python3.6 -m venv bmenv
#SHELL ["/bin/bash", "-c", "source bmenv/bin/activate"]



#FROM anuvaadio/anuvaad-block-merger:180-2c6f5668
#FROM anuvaadio/anuvaad-block-merger:210-315fc22f

#FROM 11.2.0-base-ubuntu20.04










#FROM nvidia/cuda:11.2.0-base-ubuntu20.04
# FROM anibali/pytorch:cuda-10.0
# CMD nvidia-smi
#
# LABEL maintainer "NVIDIA CORPORATION <cudatools@nvidia.com>"
#
# ENV NCCL_VERSION 2.8.3
#
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     cuda-libraries-11-2=11.2.0-1 \
#     libnpp-11-2=11.2.1.68-1 \
#     cuda-nvtx-11-2=11.2.67-1 \
#     libcublas-11-2=11.3.1.68-1 \
#     libnccl2=$NCCL_VERSION-1+cuda11.2 \
#     && rm -rf /var/lib/apt/lists/*
#
# # apt from auto upgrading the cublas package. See https://gitlab.com/nvidia/container-images/cuda/-/issues/88
# RUN apt-mark hold libcublas-11-2 libnccl2








FROM anuvaadio/anuvaad-block-merger:264-1d5bd4508


#FROM anuvaadio/python-opencv-slim:2

#
# RUN apt-get install -y nvidia-container-runtime

COPY / /app
WORKDIR /app
#
# RUN apt-get update && apt-get install -y software-properties-common
# RUN add-apt-repository -y ppa:deadsnakes/ppa && apt install -y python3.6 && apt install -y python3.6-venv
#
# ENV VIRTUAL_ENV=/opt/venv
# RUN python3.6 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"
# #
# # RUN python3.6 -m venv bmenv
# # SHELL ["/bin/bash", "-c", "source bmenv/bin/activate"]
#
# RUN apt install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev python3.6-dev
#
#
# RUN pip install --upgrade pip setuptools wheel &&\
#   pip install scikit-build &&\
#   pip install cmake &&\
#   apt install -y libopencv-dev python3-opencv\
#   && apt-get install -y tesseract-ocr \
#   && apt-get install -y poppler-utils \
#   && apt-get install -y curl
#
# RUN apt-get install -y make git curl
# RUN pip install -r requirements.txt
# RUN pip install 'git+https://github.com/facebookresearch/detectron2.git#egg=detectron2'
# RUN pip cache purge
# RUN pdftohtml -v

ARG D_F
ENV DEBUG_FLUSH=$D_F
# RUN apk update && apk add -U \
#       --virtual .build-dependencies \
#         build-base \
#         openblas-dev \
#         unzip \
#         wget \
#         cmake \
#         libjpeg-turbo-dev \
#         libpng-dev \
#         jasper-dev \
#         tiff-dev \
#         libwebp-dev \
#         clang-dev \
#         linux-headers
#RUN apk update
#RUN apk add libc6-compat

#RUN apt install -y ubuntu-drivers-common
#RUN apt install -y nvidia-driver-418-server
#RUN pip install -r requirements.txt
#RUN pip install torch===1.4.0 torchvision===0.5.0 -f https://download.pytorch.org/whl/torch_stable.html
#RUN apk update && apk add poppler-utils
# RUN apk update && apk add git
# RUN echo "|--> Updating" \
#     && apk update && apk upgrade \
#     && echo "|--> Install PyTorch" \
#     && git clone --recursive https://github.com/pytorch/pytorch \
#     && cd pytorch && python setup.py install \
#     && echo "|--> Install Torch Vision" \
#     && git clone --recursive https://github.com/pytorch/vision \
#     && cd vision && python setup.py install \
#     && echo "|--> Cleaning" \
#     && rm -rf /pytorch \
#     && rm -rf /root/.cache \
#     && rm -rf /var/cache/apk/* \
#     && apk del .build-deps \
#     && find /usr/lib/python3.6 -name __pycache__ | xargs rm -r \
#     && rm -rf /root/.[acpw]*
#



#RUN apk update && apk add curl

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#RUN apt install -y tesseract-ocr

#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]


#ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]
