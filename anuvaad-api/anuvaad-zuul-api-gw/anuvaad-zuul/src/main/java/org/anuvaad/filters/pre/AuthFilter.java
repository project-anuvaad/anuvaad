package org.anuvaad.filters.pre;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.HashSet;

import static org.anuvaad.constants.RequestContextConstants.AUTH_BOOLEAN_FLAG_NAME;


public class AuthFilter extends ZuulFilter {

    @Value("#{'${anuvaad.open-endpoints-whitelist}'.split(',')}")
    private HashSet<String> openEndpointsWhitelist;

    private static final String OPEN_ENDPOINT_MESSAGE = "Routing to an open endpoint: {}";
    private static final String AUTH_TOKEN_HEADER_NAME = "auth-token";

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        String authToken;
        if (openEndpointsWhitelist.contains(getRequestURI())) {
            setShouldDoAuth(false);
            logger.info(OPEN_ENDPOINT_MESSAGE, getRequestURI());
            return null;
        }
        try {
            authToken = getAuthTokenFromRequestHeader();
        } catch (IOException e) {
            logger.error(AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE, e);
            ExceptionUtils.RaiseException(e);
            return null;
        }
        RequestContext.getCurrentContext().set(AUTH_TOKEN_KEY, authToken);
        if (authToken == null) {
            if (mixedModeEndpointsWhitelist.contains(getRequestURI())) {
                logger.info(ROUTING_TO_ANONYMOUS_ENDPOINT_MESSAGE, getRequestURI());
                setShouldDoAuth(false);
                setAnonymousUser();
            } else {
                logger.info(ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE, getRequestURI());
                ExceptionUtils.raiseCustomException(HttpStatus.UNAUTHORIZED, UNAUTHORIZED_USER_MESSAGE);
                return null;
            }
        } else {
            logger.info(PROCEED_ROUTING_MESSAGE, getRequestURI());
            setShouldDoAuth(true);
        }
        return null;
    }

    private String getRequestURI() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest().getRequestURI();
    }

    private void setShouldDoAuth(boolean enableAuth) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(AUTH_BOOLEAN_FLAG_NAME, enableAuth);
    }

    private String getAuthTokenFromRequestHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest().getHeader(AUTH_TOKEN_HEADER_NAME);
    }

}

