FROM python:3.6.9
COPY / /app
WORKDIR /app
RUN pip3 install --upgrade pip
RUN pip3 install -r src/requirements.txt
CMD ["python", "/app/src/app.py"]
