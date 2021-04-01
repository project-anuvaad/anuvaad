FROM nvidia/cuda:10.2-base
CMD nvidia-smi
#FROM anuvaadio/anuvaad-etl-aligner-base:1
COPY / /app
WORKDIR /app
RUN pip3 install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["python", "/app/app.py"]

