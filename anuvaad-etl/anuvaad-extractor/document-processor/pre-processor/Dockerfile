FROM python:3.8-slim

COPY / /app
WORKDIR /app

# RUN apt-get update \ 
#     && apt-get install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev \
#     && pip install --upgrade pip setuptools wheel \
#     && pip install scikit-build \
#     && pip install cmake \
#     && apt-get install -y libopencv-dev \
#     && apt-get install g++ -y \
#     && apt-get install -y poppler-utils \
#     && apt-get install -y curl \
#     && apt-get install -y make git 
# RUN pip install -r requirements.txt
#     && pip cache purge

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]