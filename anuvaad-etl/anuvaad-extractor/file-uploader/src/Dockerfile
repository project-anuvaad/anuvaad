FROM python:3.8-slim
COPY / /app
WORKDIR /app
RUN apt update

RUN pip3 install -r requirements.txt
# RUN yes | apt update && apt install --no-install-recommends libreoffice-writer-nogui -y
RUN apt install -y libreoffice
RUN apt update && apt install -y libmagic-dev
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]
