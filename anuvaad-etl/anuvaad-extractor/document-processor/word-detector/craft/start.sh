#!/bin/bash
linemodelpath='./src/utilities/primalinenet/anuvaad_line_v1.pth'
url_line='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_line_v1.pth?AWSAccessKeyId=AKIAXX2AMEIRJY2GNYVZ&Signature=WmRGkXi42gOclLcmMBMJR8ToV4U%3D&Expires=1693556609'

#rm $linemodelpath
# if ! [ -f $linemodelpath ]; then
curl -o $linemodelpath $url_line
echo downloading weight file
# fi

python3 app.py
