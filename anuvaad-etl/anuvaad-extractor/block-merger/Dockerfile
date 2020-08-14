FROM python:3.6.9-slim
COPY / /app
WORKDIR /app
RUN pip3 install -r requirements.txt
RUN apt update && apt install -y poppler-utils libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev
#RUN apk update && apk add poppler-utils
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
ENTRYPOINT ["sh","/usr/bin/start.sh"]