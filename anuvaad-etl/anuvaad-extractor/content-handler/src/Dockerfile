FROM python:3.8-slim
COPY / /app
WORKDIR /app
RUN apt update

RUN pip install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]