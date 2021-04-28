# ANUVAAD DATAFLOW PIPELINE WORKFLOW MANAGER

Workflow Manager is the orchestrator for the entire dataflow pipeline.

## Prerequisites
- python 3.7
- ubuntu 16.04

Dependencies:
```bash
pip install -r requirements.txt
```
Run:
```bash
python app.py
```

## APIs and Documentation
Details of the APIs can be found here:
https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmanager_feature/anuvaad-etl/anuvaad-workflow-mgr/docs/etl-wf-manager-api-contract.yml

Details of the requests flowing in and out through kafka can be found here:
https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmanager_feature/anuvaad-etl/anuvaad-workflow-mgr/docs/etl-wf-manager-kafka-contract.yml

## Configs
Wokflows have to be configured in a .yaml file as shown in the following document:
https://raw.githubusercontent.com/project-anuvaad/anuvaad/wfmanager_feature/anuvaad-etl/anuvaad-workflow-mgr/config/etl-wf-manager-config.yml

## Postman Collection
Inorder to play around with the APIs and some hands on, Use this collecion on Postman: https://www.getpostman.com/collections/11b7d2bc4e5aa37d04c8

## License
[MIT](https://choosealicense.com/licenses/mit/)
