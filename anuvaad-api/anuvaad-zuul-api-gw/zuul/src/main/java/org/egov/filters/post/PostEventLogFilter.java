package org.egov.filters.post;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import lombok.extern.slf4j.Slf4j;
import org.egov.Utils.EventLoggerUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class PostEventLogFilter extends ZuulFilter {

    @Value("${eventlog.enabled:false}")
    Boolean eventLogEnabled;

    @Value("${eventlog.topic}")
    String eventLogSuccessTopic;

    @Value("#{'${eventlog.urls.whitelist}'.split(',')}")
    private List<String> urlsWhiteList;

    @Autowired
    private EventLoggerUtil eventLoggerUtil;


    @Override
    public String filterType() {
        return "post";
    }

    @Override
    public int filterOrder() {
        return 999;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        String requestURL = ctx.getRequest().getRequestURI();
        Boolean toLog = urlsWhiteList.stream().anyMatch(url -> requestURL.startsWith(url));
        return eventLogEnabled && toLog;
    }

    @Override
    public Object run() throws ZuulException {
        return eventLoggerUtil.logCurrentRequest(eventLogSuccessTopic);
    }
}
