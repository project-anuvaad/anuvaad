#FROM anuvaadio/python-opencv-slim:2
From anuvaadio/anuvaad-ocr-tesseract:35-3ea41fd8
#FROM nuveo/opencv:alpine-python3-opencv3
#FROM spmallick/opencv-docker:opencv-4
COPY / /app
WORKDIR /app

# RUN apt-get install -y tesseract-ocr \
#   && apt-get install -y curl
#
# RUN pip install -r requirements.txt
# RUN pip cache purge
#RUN apk add --update --no-cache tesseract-ocr curl


COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
#CMD ["python", "app.py"]

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

