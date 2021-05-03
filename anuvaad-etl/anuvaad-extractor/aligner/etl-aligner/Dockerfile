#FROM anuvaadio/anuvaad-etl-aligner:147-b34bdfb0
#FROM nvidia/cuda:10.2-base
# CMD nvidia-smi
# RUN apt update && apt install python3-pip -y
# ENV LC_ALL en_US.UTF-8
# ENV LANG en_US.UTF-8
# ENV LANGUAGE en_US.UTF-8
FROM anuvaadio/anuvaad-etl-aligner-base:1
COPY / /app
WORKDIR /app
RUN apt-get update -y
RUN apt install libomp-dev
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["python3", "/app/app.py"]

