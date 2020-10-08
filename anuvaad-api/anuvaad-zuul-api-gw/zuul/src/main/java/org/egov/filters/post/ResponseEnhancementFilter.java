package org.egov.filters.post;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import static org.egov.constants.RequestContextConstants.CORRELATION_ID_KEY;

/**
 * Sets the correlation id to the response header.
 */
@Component
public class ResponseEnhancementFilter extends ZuulFilter {

    private static final String CORRELATION_HEADER_NAME = "x-correlation-id";
    private static final String RECEIVED_RESPONSE_MESSAGE = "Received response code: {} from upstream URI {}";
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public String filterType() {
        return "post";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.addZuulResponseHeader(CORRELATION_HEADER_NAME, getCorrelationId());
        ctx.addZuulResponseHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");

        return null;
    }

    private String getCorrelationId() {
        RequestContext ctx = RequestContext.getCurrentContext();
        logger.info(RECEIVED_RESPONSE_MESSAGE,
            ctx.getResponse().getStatus(), ctx.getRequest().getRequestURI());
        return (String) ctx.get(CORRELATION_ID_KEY);
    }
}
