FROM anuvaadio/python-opencv-slim:2
COPY / /app
WORKDIR /app

RUN apt-get install -y tesseract-ocr \
  && apt-get install -y curl

RUN pip install -r requirements.txt
RUN pip cache purge


# RUN curl -L -o /usr/share/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Devanagari.traineddata
# RUN curl -L -o /usr/share/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
# RUN curl -L -o /usr/share/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata



RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/eng.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/eng.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/hin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/hin.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Malayalam.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Malayalam.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Devanagari.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Devanagari.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Latin.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Latin.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Kannada.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Kannada.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Tamil.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Tamil.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Telugu.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Telugu.traineddata
RUN curl -L -o /usr/share/tesseract-ocr/4.00/tessdata/Bengali.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/master/script/Bengali.traineddata

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["python", "app.py"]

#ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]

