
| Service | Build Status |
|---------| ----------- |
|  Zuul  |  [![Build Status](http://jenkins.idc.tarento.com/buildStatus/icon?job=anuvaad%2Fanuvaad-zuul-api-gw)](http://jenkins.idc.tarento.com/job/anuvaad/job/anuvaad-zuul-api-gw/) |
| NMT | [![Build Status](http://jenkins.idc.tarento.com/buildStatus/icon?job=anuvaad%2Fanuvaad-nmt-inference)](http://jenkins.idc.tarento.com/job/anuvaad/job/anuvaad-nmt-inference/)|
| Workflow Manager | [![Build Status](http://jenkins.idc.tarento.com/buildStatus/icon?job=anuvaad%2Fanuvaad-etl-wf-manager)](http://jenkins.idc.tarento.com/job/anuvaad/job/anuvaad-etl-wf-manager/)
| Aligner | [![Build Status](http://jenkins.idc.tarento.com/buildStatus/icon?job=anuvaad%2Fanuvaad-etl-aligner)](http://jenkins.idc.tarento.com/job/anuvaad/job/anuvaad-etl-aligner/)|
|User Management | [![Build Status](http://jenkins.idc.tarento.com/buildStatus/icon?job=anuvaad%2Fanuvaad-user-management)](http://jenkins.idc.tarento.com/job/anuvaad/job/anuvaad-user-management/)|
| Tokeniser | [![Build Status](http://jenkins.idc.tarento.com/buildStatus/icon?job=anuvaad%2Fanuvaad-etl-tokeniser)](http://jenkins.idc.tarento.com/job/anuvaad/job/anuvaad-etl-tokeniser/) |
| Translator | [![Build Status](http://jenkins.idc.tarento.com/buildStatus/icon?job=anuvaad%2Fanuvaad-etl-translator)](http://jenkins.idc.tarento.com/job/anuvaad/job/anuvaad-etl-translator/) |


# Anuvaad

Anuvaad is an AI based open source Document Translation Platform to translate documents in Indic languages at scale. Anuvaad provides easy-to-edit capabilities on top the plug & play NMT models. Separate instances of Anuvaad are deployed to Diksha (NCERT), Supreme Court of India (SUVAS) and Supreme Court of Bangladesh (Amar Vasha).

<img width="1135" alt="image" src="https://github.com/project-anuvaad/anuvaad/assets/1707796/84426483-e948-470f-b525-819fb374e77e">


### Components  ###

Component     | Details
--------------| -------------
Workflow Manager(WM)  | Centralized Orchestrator based on user request.
Auditor  | Python package/library used for formatting , exception handling.
File Uploader  | Microservice to upload and maintain user documents.
File Converter  | Microservice to convert files from one format to other. E.g: .doc to .pdf files.
Aligner  | Microservice accepts source and target sentances and align them to form parallel corpus.
Tokenizer  | Microservice tokenises pragraphs into independently translatable sentences. 
Layout Detector | Microservice interface for Layout detection model.
Block Segmenter  | Handles layout detection miss-classifications , region unifying.
Word Detector | Word detection.
Block Merger  | An OCR system that extracts texts, images, tables, blocks etc from the input file and makes it avaible in the format which can be utilised by downstream services to perform Translation. This can also be used as an independent product that can perform OCR on files, images, ppts, etc.
Translator  | Translator pushes sentences to IndicTrans which are translated and pushed back during the document translation flow.
Content Handler  | Repository Microservice which maintains and manages all the translated documents
Translation Memory X(TMX)  | System translation memory to facilitate overriding NMT translation with user preferred translation. TMX provides three levels of caching - Global , User , Organisation.
User Translation Memory(UTM)  | System tracks and remembers individual user translations or corrected translations and applies automatically when same sentences are encountered again.


### AI/ML Assets  ###
Component  | Details
------------- | -------------
[PRIMA](https://github.com/Layout-Parser/layout-model-training)  | Layout detection model.
[CRAFT](https://github.com/clovaai/CRAFT-pytorch)  | Used for Line detection.
[Tesseract](https://github.com/tesseract-ocr)  | Custom trained Tesseract used for OCR.
[IndicTrans](https://github.com/AI4Bharat/indicTrans)  | Custom trained Indic NMT model used for translation.

### Technology Stack  ###

Component  | Details
------------- | -------------
[Apache Kafka](https://kafka.apache.org/)  | Translator and [IndicTrans](https://github.com/AI4Bharat/indicTrans) are integrated through Kafka messaging.
[MongoDB](https://www.mongodb.com/)  | Primary data storage.
[Redis](https://redis.io/)  | Secondary in memory storage.
Cloud Storage  | Samba storage is used to store user input files.
[NGINX](https://www.nginx.com/)  | Serve as a redirection server and also takes care of system level configs. Ngnix acts as the gateway.
[Zuul](https://github.com/Netflix/zuul) | API Gateway to apply filters on client requests,authenticate,authorize,throttle client requests.
