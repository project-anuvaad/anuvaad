#!/bin/bash

modelpath='./src/utilities/primalaynet/model_final.pth'

#aws s3 presign s3://anuvaad-pubnet-weights/model_final.pth --expires-in 60480000
url='https://anuvaad-pubnet-weights.s3.amazonaws.com/model_final.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB&Signature=tkvJtYR4bYKrkyRUX1RPC%2B1Et7s%3D&Expires=1672216087'

if ! [ -f $modelpath ]; then
  curl -o $modelpath $url
fi

python app.py