# NMT Inference

This module provides the NMT based translation service for various Indic language pairs. Currently the NMT models are trained 
using OpenNMT-py framework version 1 and the model binaries are generated using ctranslate2 module provided for OpenNMT-py and
the same is used to generate model predictions.

## Prerequisites
- python 3.6
- ubuntu 16.04

Install various python libraries as mentioned in requirements.txt file

```bash
pip install -r requirements.txt
```

## APIs and Documentation
Run app.py to start the service with all the packages installed

```bash
python src/app.py
```

For more information about api documentation, please check @ ```https://github.com/project-anuvaad/anuvaad/blob/dev-nmt-inference/docs/contracts/apis/```
## License
[MIT](https://choosealicense.com/licenses/mit/)
