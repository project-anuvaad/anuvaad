from kafka_wrapper.producer import get_producer
from kafka_wrapper.consumer import get_consumer
from models import CustomResponse, Status
from services import OpenNMTTranslateService
import config
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import utilities.logs_book as book
import sys
import datetime
from services import NMTTranslateService

class KafkaTranslate:
    @staticmethod
    def doc_translator(c_topic):
        log_info('Kafka utils: document_translator',MODULE_CONTEXT)  
        out = {}
        iq,msg_count,msg_sent = 0,0,0
        c = get_consumer(c_topic)
        p = get_producer()
        try:
            for msg in c:
                producer_topic = [ topic["producer"] for topic in config.kafka_topic if topic["consumer"] == msg.topic][0]
                log_info("Producer for current consumer:{} is-{}".format(msg.topic,producer_topic),MODULE_CONTEXT)
                msg_count +=1
                log_info("*******************msg receive count*********:{}".format(msg_count),MODULE_CONTEXT)
                iq = iq +1
                inputs = (msg.value)

                if inputs is not None and all(v in inputs for v in ['message']) and len(inputs) is not 0:
                    record_id =  inputs.get("record_id")
                    log_info("Running kafka-translation on  {}".format(inputs['message']),MODULE_CONTEXT)  
                    out = OpenNMTTranslateService.translate_func(inputs['message'])
                    log_info("final output kafka-translate-anuvaad:{}".format(out.getresjson()),MODULE_CONTEXT) 
                    out = out.getresjson()
                    
                    if record_id: out['record_id'] = record_id  
                
                else:
                    out = {}
                    log_info("Null input request or key parameter missing in KAFKA request: document_translator",MODULE_CONTEXT)       
            
                p.send(producer_topic, value={'out':out})
                p.flush()
                msg_sent += 1
                log_info("*******************msg sent count*********:{}".format(msg_sent),MODULE_CONTEXT)
        except ValueError:  
            '''includes simplejson.decoder.JSONDecodeError '''
            log_exception("Decoding JSON has failed in document_translator: %s"% sys.exc_info()[0],MODULE_CONTEXT,e)
            doc_translator(c_topic)  
        except Exception as e:
            log_exception("Unexpected error in kafak doc_translator: %s"% sys.exc_info()[0],MODULE_CONTEXT,e)
            log_exception("error in doc_translator: {}".format(e),MODULE_CONTEXT,e)
            doc_translator(c_topic)
                
    @staticmethod
    def batch_translator(c_topic):
        ''' New method for batch translation '''      
        log_info('KafkaTranslate: batch_translator',MODULE_CONTEXT)  
        out = {}
        msg_count,msg_sent = 0,0
        consumer = get_consumer(c_topic)
        producer = get_producer()
        try:
            for msg in consumer:
                producer_topic = [topic["producer"] for topic in config.kafka_topic if topic["consumer"] == msg.topic][0]
                log_info("Producer for current consumer:{} is-{}".format(msg.topic,producer_topic),MODULE_CONTEXT)
                msg_count +=1
                log_info("*******************msg received count: {}; at {} ************".format(msg_count,datetime.datetime.now()),MODULE_CONTEXT)
                inputs = msg.value
                partition = msg.partition
                translation_batch = {}
                src_list, response_body = list(), list()

                if inputs is not None and all(v in inputs for v in ['message','record_id','id']) and len(inputs) is not 0:
                    try:
                        input_time = datetime.datetime.now()
                        log_info("Input for Record Id:{} at {}".format(inputs.get('record_id'),input_time),MODULE_CONTEXT)
                        log_info("Running batch-translation on  {}".format(inputs),MODULE_CONTEXT) 
                        record_id = inputs.get('record_id')
                        book.logs_book("RecordId",record_id,"Request received")
                        message = inputs.get('message')
                        src_list = [i.get('src') for i in message]
                        translation_batch = {'id':inputs.get('id'),'src_list': src_list}
                        log_info("***********Input length:{}".format(len(src_list)),MODULE_CONTEXT)
                        output_batch = NMTTranslateService.batch_translator(translation_batch)
                        log_info("Output of translation batch service at :{}".format(datetime.datetime.now()),MODULE_CONTEXT)                        
                        output_batch_dict_list = [{'tgt': output_batch['tgt_list'][i],
                                                'tagged_tgt':output_batch['tagged_tgt_list'][i],'tagged_src':output_batch['tagged_src_list'][i]}
                                                for i in range(len(message))]
                        
                        for j,k in enumerate(message):
                            k.update(output_batch_dict_list[j])
                            response_body.append(k)
                        
                        log_info("Record Id:{}; Final response body of current batch translation:{}".format(record_id,response_body),MODULE_CONTEXT) 
                        out = CustomResponse(Status.SUCCESS.value,response_body)   
                    except Exception as e:
                        status = Status.SYSTEM_ERR.value
                        status['message'] = str(e)
                        log_exception("Exception caught in batch_translator child block: {}".format(e),MODULE_CONTEXT,e) 
                        book.logs_book("RecordId",record_id,"Exception")
                        out = CustomResponse(status, inputs.get('message'))
                    
                    out = out.get_res_json()
                    out['record_id'] = record_id
                    log_info("Output for Record Id:{} at {}".format(record_id,datetime.datetime.now()),MODULE_CONTEXT)
                    log_info("Total time for processing Record Id:{} is: {}".format(record_id,(datetime.datetime.now()- input_time).total_seconds()),MODULE_CONTEXT)
                    book.logs_book("RecordId",record_id,"Response pushed") 
                else:
                    status = Status.KAFKA_INVALID_REQUEST.value
                    out = CustomResponse(status, inputs.get('message'))
                    out = out.get_res_json()
                    if inputs.get('record_id'): out['record_id'] = inputs.get('record_id') 
                    log_info("Empty input request or key parameter missing in Batch translation request: batch_translator",MODULE_CONTEXT)
                    book.logs_book("RecordId",record_id,"Invalid Request")       
            
                producer.send(producer_topic, value={'out':out},partition=partition)
                producer.flush()
                msg_sent += 1
                log_info("*******************msg sent count: {}; at {} **************".format(msg_sent,datetime.datetime.now()),MODULE_CONTEXT)
        except ValueError as e:  
            '''includes simplejson.decoder.JSONDecodeError '''
            log_exception("JSON decoding failed in KafkaTranslate-batch_translator method: {}".format(e),MODULE_CONTEXT,e)
            log_info("Reconnecting kafka c/p after exception handling",MODULE_CONTEXT)
            KafkaTranslate.batch_translator(c_topic)  
        except Exception as e:
            log_exception("Exception caught in KafkaTranslate-batch_translator method: {}".format(e),MODULE_CONTEXT,e)
            log_info("Reconnecting kafka c/p after exception handling",MODULE_CONTEXT)
            KafkaTranslate.batch_translator(c_topic)        
    