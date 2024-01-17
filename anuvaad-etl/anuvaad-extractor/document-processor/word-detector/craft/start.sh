#!/bin/bash
linemodelpath='./src/utilities/primalinenet/anuvaad_line_v1.pth'
url_line='https://anuvaad-pubnet-weights.s3.amazonaws.com/anuvaad_line_v1.pth'

#rm $linemodelpath
# if ! [ -f $linemodelpath ]; then
curl -o $linemodelpath $url_line
echo downloading weight file
# fi

python3 app.py
