package org.egov.filters.post;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.egov.Utils.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

/**
 * Sets the correlation id to the response header.
 */
@Component
public class ResponseErrorFilter extends ZuulFilter {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public String filterType() {
        return "post";
    }

    @Override
    public int filterOrder() {
        return -1;
    }

    @Override
    public boolean shouldFilter() {
        return RequestContext.getCurrentContext().containsKey("error.status_code")
            || RequestContext.getCurrentContext().getResponseStatusCode() == HttpStatus.NOT_FOUND.value()
            || RequestContext.getCurrentContext().getResponseStatusCode() == HttpStatus.BAD_REQUEST.value();
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        ExceptionUtils.raiseErrorFilterException(ctx);
        return null;
    }
}
