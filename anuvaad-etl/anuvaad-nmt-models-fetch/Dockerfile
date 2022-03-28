FROM python:3.6.9
RUN apt-get update
COPY / /app
WORKDIR /app
RUN pip3 install --upgrade pip
RUN pip3 install -r src/requirements.txt
CMD ["python3", "/app/src/app.py"]
