#FROM anuvaadio/python3.6-opencv-4.1.0:7
#FROM python:3.7-slim

#CPU version
#FROM anuvaadio/anuvaad-layout-detector-prima:4-ba5d7d74
FROM anuvaadio/anuvaad-layout-detector-prima:86-9745dcf5d
#GPU version
#anuvaad-layout-detector-prima:80-afc13b4ae
#FROM anuvaadio/anuvaad-layout-detector-prima:80-afc13b4ae

#FROM ubuntu:20.04

# LABEL maintainer "NVIDIA CORPORATION <cudatools@nvidia.com>"

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     gnupg2 curl ca-certificates && \
#     curl -fsSL https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/7fa2af80.pub | apt-key add - && \
#     echo "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64 /" > /etc/apt/sources.list.d/cuda.list && \
#     echo "deb https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu2004/x86_64 /" > /etc/apt/sources.list.d/nvidia-ml.list && \
#     apt-get purge --autoremove -y curl \
#     && rm -rf /var/lib/apt/lists/*

#ENV CUDA_VERSION 11.2.2

# # For libraries in the cuda-compat-* package: https://docs.nvidia.com/cuda/eula/index.html#attachment-a
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     cuda-cudart-11-2=11.2.152-1 \
#     cuda-compat-11-2 \
#     && ln -s cuda-11.2 /usr/local/cuda && \
#     rm -rf /var/lib/apt/lists/*

# # Required for nvidia-docker v1
#RUN echo "/usr/local/nvidia/lib" >> /etc/ld.so.conf.d/nvidia.conf \
#    && echo "/usr/local/nvidia/lib64" >> /etc/ld.so.conf.d/nvidia.conf

# ENV PATH /usr/local/nvidia/bin:/usr/local/cuda/bin:${PATH}
#ENV LD_LIBRARY_PATH /usr/local/nvidia/lib:/usr/local/nvidia/lib64

# # nvidia-container-runtime
#ENV NVIDIA_VISIBLE_DEVICES all
#ENV NVIDIA_DRIVER_CAPABILITIES compute,utility
#ENV NVIDIA_REQUIRE_CUDA "cuda>=11.2 brand=tesla,driver>=418,driver<419 brand=tesla,driver>=440,driver<441 driver>=450,driver<451"

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


#RUN apt-get update && apt-get install -y libcurl4-gnutls-dev
RUN apt install -y curl
# RUN pip install --upgrade pip setuptools wheel
# #&&\
# #   pip install scikit-build &&\
# #   pip install cmake &&\
# RUN apt install -y libopencv-dev python3-opencv

#FROM anuvaadio/python-opencv-slim:2
COPY / /app
WORKDIR /app

#RUN apt-get install -y make git
#RUN pip install -r requirements.txt
#RUN pip install 'git+https://github.com/facebookresearch/detectron2.git#egg=detectron2'

#RUN pip cache purge

#Run curl https://anuvaad-pubnet-weights.s3.amazonaws.com/model_final.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB&Signature=6js6H28bUyOEmYek2FTbWf3AlS8%3D&Expires=1611584082
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

