FROM python:3.7-slim
COPY / /app
WORKDIR /app
RUN pip3 install -r requirements.txt
RUN sudo apt-get update
RUN sudo apt-get install build-essential libpoppler-cpp-dev pkg-config python-dev
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
