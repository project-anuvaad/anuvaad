FROM python:3.6-slim-stretch
COPY / /app
WORKDIR /app
RUN pip install -r requirements.txt

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

