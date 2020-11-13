package org.tarento.retail.filters.pre;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

import static org.tarento.retail.constants.RequestContextConstants.RBAC_AVAILABLE;
import static org.tarento.retail.constants.RequestContextConstants.RBAC_BOOLEAN_FLAG_NAME;
import static org.tarento.retail.constants.RequestContextConstants.SKIP_RBAC;

import java.util.HashSet;

/**
 *  3rd pre filter to get executed.
 *  If the URI is part of open or mixed endpoint list then RBAC check is marked as false
 */
public class RbacPreCheckFilter extends ZuulFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private HashSet<String> openEndpointsWhitelist;
    private HashSet<String> anonymousEndpointsWhitelist;

    public RbacPreCheckFilter(HashSet<String> openEndpointsWhitelist,
                              HashSet<String> anonymousEndpointsWhitelist) {
        this.openEndpointsWhitelist = openEndpointsWhitelist;
        this.anonymousEndpointsWhitelist = anonymousEndpointsWhitelist;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 2;
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
        if ((openEndpointsWhitelist.contains(getRequestURI())
            || anonymousEndpointsWhitelist.contains(getRequestURI()))) {
            setShouldDoRbac(false);
            logger.info(SKIP_RBAC, getRequestURI());
            return null;
        }
        setShouldDoRbac(true);
        return null;
    }

    private void setShouldDoRbac(boolean enableRbac) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(RBAC_BOOLEAN_FLAG_NAME, enableRbac);
        ctx.set(RBAC_AVAILABLE, Boolean.TRUE);
    }

    private String getRequestURI() {
        return getRequest().getRequestURI();
    }

    private HttpServletRequest getRequest() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest();
    }
}
