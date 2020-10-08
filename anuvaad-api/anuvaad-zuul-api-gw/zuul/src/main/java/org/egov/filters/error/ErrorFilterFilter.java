package org.egov.filters.error;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.egov.Utils.ExceptionUtils;
import org.springframework.stereotype.Component;

@Component
public class ErrorFilterFilter extends ZuulFilter {

    private static final String ERROR_STATUS_CODE = "error.status_code";
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