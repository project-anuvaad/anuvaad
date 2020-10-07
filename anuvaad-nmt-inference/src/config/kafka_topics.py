import os

consumer_topics ={
  "TEST_TOPIC":"testtopic",
  "DOCUMENT_REQ":"to-nmt",
  "new_topic":"nmt_translate"
}

producer_topics ={
  "TEST_TOPIC":"listener",
  "TO_DOCUMENT":"listener",
  "new_topic":"nmt_translate_processed"
}

## "description":"default topics"
nmt_input_topic_default = "anuvaad-nmt-input-default"
nmt_output_topic_default = 'anuvaad-nmt-output-default'

kafka_topic = [
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_DOC_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_DOC_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"Document translation,also used in Suvas"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_PDF_DEV_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_PDF_DEV_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"Pdf dev environment translation"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_PDF_PROD_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_PDF_PROD_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"Pdf production translation"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_WFM_DEV_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_WFM_DEV_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"kafka topics for WFM Dev environment"
  },
  {
    "consumer":os.environ.get('KAFKA_ANUVAAD_WFM_PROD_INPUT_TOPIC', nmt_input_topic_default),
    "producer":os.environ.get('KAFKA_ANUVAAD_WFM_PROD_OUTPUT_TOPIC', nmt_output_topic_default),
    "description":"kafka topics for WFM Production environment"
  }
]

