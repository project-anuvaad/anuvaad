FROM python:3.7
RUN apt-get clean
RUN mv /var/lib/apt/lists /var/lib/apt/lists.old
RUN mkdir -p lists/partial
RUN apt-get clean
#RUN rm -vf /var/lib/apt/lists/*
RUN apt-get update
RUN apt-get install -y libopenblas-dev
COPY / /app
WORKDIR /app
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
CMD ["python3", "/app/app.py"]
