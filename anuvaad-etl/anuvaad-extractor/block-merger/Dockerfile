# FROM python:3.8-slim
FROM anuvaadio/anuvaad-block-merger:278-650172916

COPY / /app
WORKDIR /app

  RUN mkdir -p "/root/.torch/iopath_cache/s/yc92x97k50abynt" && \                                                                                                                                            
      curl -L "https://huggingface.co/Eterna2/LayoutParser/resolve/main/models/PrimaLayout/PrimaLayout-mask_rcnn_R_50_FPN_3x-config.yml" \                                                                 
      -o "/root/.torch/iopath_cache/s/yc92x97k50abynt/config.yaml?dl=1"                                                                                                                                      
                                                                                                                                                                                                             
  RUN mkdir -p "/root/.torch/iopath_cache/s/h7th27jfv19rxiy" && \                                                                                                                                            
      curl -L "https://huggingface.co/Eterna2/LayoutParser/resolve/main/models/PrimaLayout/PrimaLayout-mask_rcnn_R_50_FPN_3x-model.pth" \                                                                    
      -o "/root/.torch/iopath_cache/s/h7th27jfv19rxiy/model_final.pth?dl=1"     

      # RUN apt-get update \ 
#     && apt-get install -y libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev \
#     && pip install --upgrade pip setuptools wheel \
#     && pip install scikit-build \
#     && pip install cmake \
#     && apt-get install -y libopencv-dev \
#     && apt-get install g++ -y \
#     && apt-get install -y tesseract-ocr \
#     && apt-get install -y poppler-utils \
#     && apt-get install -y curl \
#     && apt-get install -y make git 
# RUN pip install -r requirements.txt
# RUN pip install anuvaad-auditor==1.0.0
# RUN pip install 'git+https://github.com/facebookresearch/detectron2.git'  \
#     && pip cache purge
RUN pip install anuvaad-auditor==1.0.0

COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh

ENTRYPOINT ["/bin/bash","/usr/bin/start.sh"]