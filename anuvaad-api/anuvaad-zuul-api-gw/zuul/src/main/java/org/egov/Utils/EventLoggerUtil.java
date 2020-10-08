package org.egov.Utils;

import com.netflix.zuul.context.RequestContext;
import lombok.extern.slf4j.Slf4j;
import org.egov.model.EventLogRequest;
import org.egov.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class EventLoggerUtil {
    @Autowired
    Producer producer;

    public Object logCurrentRequest(String topic){
        try {
            EventLogRequest request = EventLogRequest.fromRequestContext(RequestContext.getCurrentContext());
            producer.push(topic, request);
        } catch (Exception ex) {
            log.error("event logger", ex);
        }
        return null;
    }
}
