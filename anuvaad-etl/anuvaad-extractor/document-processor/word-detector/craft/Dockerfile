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
FROM anuvaadio/python-opencv-slim:2


LABEL maintainer "NVIDIA CORPORATION <cudatools@nvidia.com>"

RUN apt-get update && apt-get install -y --no-install-recommends \
    gnupg2 curl ca-certificates && \
    curl -fsSL https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/7fa2af80.pub | apt-key add - && \
    echo "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64 /" > /etc/apt/sources.list.d/cuda.list && \
    echo "deb https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu2004/x86_64 /" > /etc/apt/sources.list.d/nvidia-ml.list && \
    apt-get purge --autoremove -y curl \
    && rm -rf /var/lib/apt/lists/*

ENV CUDA_VERSION 11.2.2

# For libraries in the cuda-compat-* package: https://docs.nvidia.com/cuda/eula/index.html#attachment-a
RUN apt-get update && apt-get install -y --no-install-recommends \
    cuda-cudart-11-2=11.2.152-1 \
    cuda-compat-11-2 \
    && ln -s cuda-11.2 /usr/local/cuda && \
    rm -rf /var/lib/apt/lists/*

# Required for nvidia-docker v1
RUN echo "/usr/local/nvidia/lib" >> /etc/ld.so.conf.d/nvidia.conf \
    && echo "/usr/local/nvidia/lib64" >> /etc/ld.so.conf.d/nvidia.conf

ENV PATH /usr/local/nvidia/bin:/usr/local/cuda/bin:${PATH}
ENV LD_LIBRARY_PATH /usr/local/nvidia/lib:/usr/local/nvidia/lib64

# nvidia-container-runtime
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility
ENV NVIDIA_REQUIRE_CUDA "cuda>=11.2 brand=tesla,driver>=418,driver<419 brand=tesla,driver>=440,driver<441 driver>=450,driver<451"

COPY / /app
WORKDIR /app
RUN apt install -y libspatialindex-dev python-rtree
RUN pip install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

