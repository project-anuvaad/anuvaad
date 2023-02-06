FROM python:3.8-slim
RUN apt-get update
RUN apt-get install -y build-essential libssl-dev libffi-dev python3-dev wget
# RUN mkdir /usr/share/man/man1

RUN apt-get install -y software-properties-common
RUN add-apt-repository --remove ppa:libreoffice/ppa
RUN apt update
RUN apt-cache policy libreoffice
RUN apt-get install -y pdftohtml
RUN apt install -y libreoffice
RUN apt install -y libmagic-dev

RUN apt-get install -y poppler-utils

COPY / /app
WORKDIR /app
RUN pip3 install -r requirements.txt
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
