FROM python:3.6-slim
RUN apt-get update
RUN apt-get install -y build-essential libssl-dev libffi-dev python3-dev
RUN mkdir /usr/share/man/man1
RUN apt-get install -y libreoffice=6.4.6.2 40
RUN apt-get install -y poppler-utils

COPY / /app
WORKDIR /app
RUN pip3 install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
