package org.anuvaad.filters.post;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.anuvaad.constants.RequestContextConstants.CORRELATION_ID_HEADER_NAME;

public class ResponseFilter extends ZuulFilter {
    private static final String CORRELATION_HEADER_NAME = "x-correlation-id";
    private static final String RECEIVED_RESPONSE_MESSAGE = "Received response code: {} from upstream URI {} \n";
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
        if (!ctx.getRequest().getRequestURI().contains("/telemetry"))
            logger.info(RECEIVED_RESPONSE_MESSAGE,
                    ctx.getResponse().getStatus(), ctx.getRequest().getRequestURI());
        ctx.addZuulResponseHeader(CORRELATION_HEADER_NAME, (String) ctx.get(CORRELATION_ID_HEADER_NAME));
        ctx.addZuulResponseHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        ctx.addZuulResponseHeader("Content-Type", "application/json");
        return null;
    }
}
