FROM python:3.7-slim
# FROM python:3.6-slim
# FROM 4821efab5718
#FROM 6eb1218a361a
COPY / /app
WORKDIR /app
RUN apt-get update
RUN apt install build-essential -y
RUN apt install g++ -y
RUN apt-get install python3-pip -y
RUN pip install -r requirements.txt
RUN apt-get install libleptonica-dev -y
RUN apt install tesseract-ocr -y
RUN apt-get install ffmpeg libsm6 libxext6  -y

RUN apt-get install -y make git
# RUN python -m pip install 'git+https://github.com/facebookresearch/detectron2.git@42c44b622eb7b179576bdac218c84c107fff8eab'
RUN python -m pip install 'git+https://github.com/facebookresearch/detectron2.git'
RUN apt install -y curl

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]