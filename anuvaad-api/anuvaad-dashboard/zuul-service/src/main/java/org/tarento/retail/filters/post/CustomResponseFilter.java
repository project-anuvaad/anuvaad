package org.tarento.retail.filters.post;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.client.HttpServerErrorException;
import org.tarento.retail.exceptions.zuulExceptions.RbacException;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

/**
 * 
 * @author Darshan Nagesh
 *
 */

@Component
public class CustomResponseFilter extends ZuulFilter {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	
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
    	if("OPTIONS".equals(RequestContext.getCurrentContext().getRequest().getMethod())) { 
    		return false; 
    	}
        return RequestContext.getCurrentContext().containsKey("error.status_code");
    }

    @Override
    public Object run() {
        try {
            RequestContext ctx = RequestContext.getCurrentContext();
            Object e = ctx.get("error.exception");

            if (e != null && e instanceof ZuulException) {
                ZuulException zuulException = (ZuulException)e;
                logger.error("Zuul failure detected: " + zuulException.getMessage(), zuulException);

                ctx.remove("error.status_code");

                ctx.setResponseBody("Overriding Zuul Exception Body");
                ctx.getResponse().setContentType("application/json");
                ctx.setResponseStatusCode(500); 
            }
            
            if (e != null && e instanceof HttpServerErrorException) {
            	HttpServerErrorException httpException = (HttpServerErrorException)e;
                logger.error("Zuul failure detected: " + httpException.getMessage(), httpException);

                /*ctx.remove("error.status_code");
                
                ctx.setResponseBody("Overriding Http Exception Body");
                ctx.getResponse().setContentType("application/json");
                ctx.setResponseStatusCode(500); */
            }
            
            if (e != null && e instanceof RbacException) {
            	RbacException rbacException = (RbacException)e;
                logger.error("Zuul failure detected: " + rbacException.getMessage(), rbacException);

                ctx.remove("error.status_code");
                
                ctx.setResponseBody("Overriding Http Exception Body");
                ctx.getResponse().setContentType("application/json");
                ctx.setResponseStatusCode(400); 
            }
        }
        catch (Exception ex) {
            ReflectionUtils.rethrowRuntimeException(ex);
        }
        return null;
    }
}