package org.tarento.retail.filters.pre;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import static org.tarento.retail.constants.RequestContextConstants.CORRELATION_ID_KEY;

import java.util.UUID;

/**
 *  1st pre filter to get executed.
 *  Sets the context and MDC with the newly generated correlation id.
 */
@Component
public class CorrelationIdFilter extends ZuulFilter {

    private static final String RECEIVED_REQUEST_MESSAGE = "Received request for: {}";

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
    	if("OPTIONS".equals(RequestContext.getCurrentContext().getRequest().getMethod())) { 
    		return false; 
    	}
        return true;
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        final String correlationId = UUID.randomUUID().toString();
        MDC.put(CORRELATION_ID_KEY, correlationId);
        ctx.set(CORRELATION_ID_KEY, correlationId);
        logger.info(RECEIVED_REQUEST_MESSAGE, ctx.getRequest().getRequestURI());
        logger.info(RECEIVED_REQUEST_MESSAGE, ctx.getRequest().getMethod());
        return null;
    }

}