FROM anuvaadio/python3.6-opencv-4.1.0:1
COPY / /app
WORKDIR /app
RUN pip install -r requirements.txt
RUN apk update && apk add poppler-utils 
CMD ["python", "/app/app.py"]
