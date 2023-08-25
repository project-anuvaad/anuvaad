# FROM python:3.7-slim
# FROM python:3.6-slim
FROM anuvaadio/anuvaad-ocr-ulca:24-6b7b5f51e

#FROM 6eb1218a361a
COPY / /app
WORKDIR /app
# RUN apt-get update
# RUN apt install build-essential -y
# RUN apt install g++ -y
# RUN apt-get install python3-pip -y
# RUN pip install -r requirements.txt
# RUN apt-get install libleptonica-dev -y
# RUN apt install tesseract-ocr -y
# RUN apt-get install ffmpeg libsm6 libxext6  -y

# RUN apt-get install -y make git
# # RUN python -m pip install 'git+https://github.com/facebookresearch/detectron2.git@95a87b8dd359014d1ff81fe14f539dd279bcbe4b'
# RUN python -m pip install 'git+https://github.com/facebookresearch/detectron2.git'
# RUN apt install -y curl

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]