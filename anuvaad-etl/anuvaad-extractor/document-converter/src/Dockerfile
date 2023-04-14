FROM python:3.8-slim
COPY / /app
WORKDIR /app
RUN apt-get update \
    && apt-get install build-essential libpoppler-cpp-dev pkg-config python-dev -y
RUN pip install -r requirements.txt \
    && pip cache purge
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
