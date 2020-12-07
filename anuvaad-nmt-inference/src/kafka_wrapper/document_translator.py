from kafka_wrapper.producer import get_producer
from kafka_wrapper.consumer import get_consumer
from models import CustomResponse, Status
from services import OpenNMTTranslateService
import config
from anuvaad_auditor.loghandler import log_info, log_exception
from utilities import MODULE_CONTEXT
import sys

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
    