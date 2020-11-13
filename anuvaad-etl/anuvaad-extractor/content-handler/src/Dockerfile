FROM python:3.6-slim-stretch
COPY / /app
WORKDIR /app
RUN apt update

RUN pip3 install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]