#!/bin/bash

modelpath='./src/utilities/primalaynet/model_final.pth'
tablenet='./src/utilities/primalaynet/model_tablenet.pth'
url_table='https://anuvaad-pubnet-weights.s3.amazonaws.com/model_tablenet.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB&Signature=X7h45H4UBx8VXwN6d1DfCWlqzNs%3D&Expires=1674458749'
rm $modelpath
#aws s3 presign s3://anuvaad-pubnet-weights/model_final.pth --expires-in 60480000
#url='https://anuvaad-pubnet-weights.s3.amazonaws.com/model_final.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB&Signature=tkvJtYR4bYKrkyRUX1RPC%2B1Et7s%3D&Expires=1672216087'
url_judgement_prima_table_layout_model_v2 ='https://anuvaad-pubnet-weights.s3.amazonaws.com/judgement_prima_table_layout_model_v2.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB&Signature=6NeIN8oQIAl449uvJP7Rkxi5RR8%3D&Expires=1675415301'
#url='https://anuvaad-pubnet-weights.s3.amazonaws.com/prima_judgement_trained_wgt.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB'
if ! [ -f $modelpath ]; then
  curl -o $modelpath $url_judgement_prima_table_layout_model_v2
  echo downloading weight file
fi
rm $tablenet
if ! [ -f $tablenet ]; then
  curl -o $tablenet $url_table
  echo downloading weight file
fi

python app.py