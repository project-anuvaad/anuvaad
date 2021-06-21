FROM anuvaadio/python-opencv-slim


COPY / /app
WORKDIR /app

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh


ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]



