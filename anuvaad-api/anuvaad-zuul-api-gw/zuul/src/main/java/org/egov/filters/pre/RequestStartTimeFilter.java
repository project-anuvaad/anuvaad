package org.egov.filters.pre;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.egov.constants.RequestContextConstants;
import org.springframework.stereotype.Component;

@Component
public class RequestStartTimeFilter extends ZuulFilter {
    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return -999;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(RequestContextConstants.CURRENT_REQUEST_START_TIME, System.currentTimeMillis());
        return null;
    }
}
