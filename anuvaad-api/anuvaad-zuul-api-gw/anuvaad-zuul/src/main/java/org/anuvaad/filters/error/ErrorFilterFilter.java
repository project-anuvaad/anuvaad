package org.anuvaad.filters.error;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.anuvaad.utils.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ErrorFilterFilter extends ZuulFilter {

    private static final String ERROR_STATUS_CODE = "error.status_code";
    private static final Logger logger = LoggerFactory.getLogger(ErrorFilterFilter.class);

    @Override
    public String filterType() {
        return "error";
    }

    @Override
    public int filterOrder() {
        return -100;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        ExceptionUtils.raiseErrorFilterException(ctx);
        return null;
    }
}