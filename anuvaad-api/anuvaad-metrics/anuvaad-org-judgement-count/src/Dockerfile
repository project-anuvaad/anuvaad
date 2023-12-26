FROM python:3.7-slim
RUN rm -vf /var/lib/apt/lists/*
RUN apt update
COPY / /app
WORKDIR /app
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
CMD ["python3", "/app/app.py"]
