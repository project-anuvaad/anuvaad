FROM python:3.8-bullseye
COPY / /app
WORKDIR /app
RUN apt-get update
RUN apt install build-essential -y
RUN apt install g++ -y
# RUN apt-get install python3-pip -y
RUN pip install -r requirements.txt
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN apt-get install -y make git
RUN python -m pip install 'git+https://github.com/facebookresearch/detectron2.git'
RUN pip install git+https://github.com/huggingface/transformers.git
RUN pip install torch==2.0.1+cpu torchvision==0.15.2+cpu torchaudio==2.0.2 -f https://download.pytorch.org/whl/torch_stable.html
RUN pip install omegaconf==2.1
RUN pip cache purge
RUN apt install -y curl
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]
