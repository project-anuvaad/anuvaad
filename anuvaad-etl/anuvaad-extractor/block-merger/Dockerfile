FROM ubuntu:18.04
#FROM python:3.6.9-slim
COPY / /app
WORKDIR /app
RUN apt install python3-pip
RUN pip3 install -r requirements.txt
RUN apt update && apt install -y poppler-utils libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev
CMD ["python", "/app/app.py"]
