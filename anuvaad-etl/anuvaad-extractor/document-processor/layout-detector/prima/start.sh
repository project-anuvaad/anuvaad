#!/bin/bash

modelpath="./src/utilities/primalaynet/model_final.pth"
tablenet="./src/utilities/primalaynet/model_tablenet.pth"
#url_table="https://anuvaad-pubnet-weights.s3.amazonaws.com/model_tablenet.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB&Signature=X7h45H4UBx8VXwN6d1DfCWlqzNs%3D&Expires=1674458749"
url_table="https://anuvaad-pubnet-weights.s3.amazonaws.com/model_tablenet_v2.pth?AWSAccessKeyId=$AWSACCESSKEYID_VALUE&Signature=qOyiyYn9DdlfwQwjusbrYqZjp98%3D&Expires=1755145429"
#aws s3 presign s3://anuvaad-pubnet-weights/model_final.pth --expires-in 60480000
#url="https://anuvaad-pubnet-weights.s3.amazonaws.com/model_final.pth?AWSAccessKeyId=$AWSACCESSKEYID_VALUE&Signature=Wo8rFhtEHKXKYpRxLpbBzt%2BI1J0%3D&Expires=1693558654"
#url_judgement_prima_table_layout_model_v2="https://anuvaad-pubnet-weights.s3.amazonaws.com/judgement_prima_table_layout_model_v2.pth?AWSAccessKeyId=$AWSACCESSKEYID_VALUE&Signature=wVdEhQ7wOgaK3%2B80n%2Bs1guTi3is%3D&Expires=1693558789"
url_judgement_prima_table_layout_model_v3="https://anuvaad-pubnet-weights.s3.amazonaws.com/judgement_prima_table_layout_modelv3.pth?AWSAccessKeyId=$AWSACCESSKEYID_VALUE&Signature=bprbN946IJgMZ6iXhtJFlhQ0vys%3D&Expires=1755145320"
#url="https://anuvaad-pubnet-weights.s3.amazonaws.com/prima_judgement_trained_wgt.pth?AWSAccessKeyId=AKIAUAXLRTC3KS46AZTB"
rm $tablenet
#if ! [ -f $tablenet ]; then
curl -o $tablenet $url_table
echo downloading weight file
#fi
rm $modelpath
#if ! [ -f $modelpath ]; then
curl -o $modelpath $url_judgement_prima_table_layout_model_v3
echo downloading weight file
#fi

python app.py
