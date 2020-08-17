FROM ubuntu:17.04
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN apt-get install -y build-essential libssl-dev libffi-dev python-dev
RUN apt-get install -y libreoffice
COPY / /app
WORKDIR /app
RUN pip3 install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
