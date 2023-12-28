FROM python:3.7-slim
RUN apt-get clean
RUN cd /var/lib/apt
RUN mv lists lists.old
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
