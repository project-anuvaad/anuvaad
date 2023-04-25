FROM python:3.8-slim

RUN apt-get update
RUN apt-get install -y build-essential libssl-dev libffi-dev python3-dev wget
RUN apt install -y libreoffice

COPY / /app
WORKDIR /app

RUN pip3 install -r requirements.txt
# RUN yes | apt update && apt install --no-install-recommends libreoffice-writer-nogui -y
# RUN apt update && apt install -y libmagic-dev
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
