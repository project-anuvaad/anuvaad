package org.anuvaad.filters.pre;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.anuvaad.cache.ZuulConfigCache;
import org.anuvaad.models.Action;
import org.anuvaad.models.User;
import org.anuvaad.models.UserRole;
import org.anuvaad.utils.ExceptionUtils;
import org.anuvaad.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.*;

import static org.anuvaad.constants.RequestContextConstants.*;

/**
 * 2nd filter to execute in the request flow.
 * Checks if the auth token is available, throws exception otherwise.
 * for the given auth token checks if there's a valid user in the sysTem, throws exception otherwise.
 * Performs authentication level checks on the request.
 *
 */
@Component
public class AuthFilter extends ZuulFilter {

    @Autowired
    public UserUtils userUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final String AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE = "Couldn't find auth-token in the request.";
    private static final String SKIP_AUTH_CHECK = "Auth check skipped - whitelisted endpoint | {}";
    private static final String ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE = "Routing to protected endpoint {} restricted - No auth token";
    private static final String RETRIEVING_USER_FAILED_MESSAGE = "Retrieving user failed";
    private static final String PROCEED_ROUTING_MESSAGE = "Routing to protected endpoint: {} - authentication check passed!";
    private static final String UNAUTH_USER_MESSAGE = "You don't have access to this resource - authentication check failed.";
    private static final String INVALID_ENDPOINT_MSG = "You're trying to access an invalid/inactive resource";


    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 1;
    } // Second filter

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        String authToken;
        RequestContext ctx = RequestContext.getCurrentContext();
        List<String> openEndpointsWhitelist = ZuulConfigCache.whiteListEndpoints;
        String uri = getRequestURI();
        if (openEndpointsWhitelist.contains(uri)) {
            setShouldDoAuth(false);
            if (!uri.contains("/telemetry"))
                logger.info(SKIP_AUTH_CHECK, uri);
            ctx.set(REQ_URI, uri);
            return null;
        }
        if (!isURIValid(uri, ctx)){
            logger.info("Invalid resource: {}", uri);
            ExceptionUtils.raiseCustomException(HttpStatus.NOT_FOUND, INVALID_ENDPOINT_MSG);
        }
        try {
            authToken = getAuthTokenFromRequestHeader();
        } catch (Exception e) {
            logger.error(AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE, e);
            ExceptionUtils.raiseCustomException(HttpStatus.BAD_REQUEST, AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE);
            return null;
        }
        if (authToken == null) {
            logger.info(AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE);
            ExceptionUtils.raiseCustomException(HttpStatus.BAD_REQUEST, AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE);
        } else {
            ctx.set(AUTH_TOKEN_KEY, authToken);
            User user = verifyAuthenticity(ctx, authToken);
            if (null == user){
                logger.info(ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE, uri);
                ExceptionUtils.raiseCustomException(HttpStatus.UNAUTHORIZED, UNAUTH_USER_MESSAGE);
            }
            else {
                logger.info(PROCEED_ROUTING_MESSAGE, uri);
                ctx.addZuulRequestHeader(ZUUL_AUTH_TOKEN_HEADER_KEY, authToken);
                ctx.addZuulRequestHeader(ZUUL_USER_ID_HEADER_KEY, user.getUserID());
                ctx.addZuulRequestHeader(ZUUL_ORG_ID_HEADER_KEY, user.getOrgID());
                ctx.addZuulRequestHeader(ZUUL_SESSION_ID_HEADER_KEY, authToken); // A session is User activity per token.
                List<String> roles = new ArrayList<>();
                for(UserRole role: user.getRoles())
                    roles.add(role.getRoleCode());
                String roleCodes = String.join(",", roles);
                ctx.addZuulRequestHeader(ZUUL_ROLES_HEADER_KEY, roleCodes);
                setShouldDoAuth(true);
            }
        }
        return null;
    }


    /**
     * Verifies if the URI is valid.
     * @return
     */
    public Boolean isURIValid(String uri, RequestContext ctx){
        boolean isValid = false;
        for(Object obj: ZuulConfigCache.actions){
            Action action = objectMapper.convertValue(obj, Action.class);
            if (action.getActive()){
                if (uri.equals(action.getUri())){
                    isValid = true;
                    ctx.set(PATH_PARAM_URI, false);
                    ctx.set(REQ_URI, uri);
                }
                else if (action.getUri().endsWith("/*")){
                    String actionURI = action.getUri().substring(0, (action.getUri().length() - 2));
                    if (uri.contains(actionURI)){
                        isValid = true;
                        ctx.set(PATH_PARAM_URI, true);
                        ctx.set(REQ_URI, action.getUri());
                    }
                }
                else if (action.getUri().endsWith("?*")){
                    String actionURI = action.getUri().substring(0, (action.getUri().length() - 2));
                    if (uri.contains(actionURI)){
                        isValid = true;
                        ctx.set(QUERY_PARAM_URI, true);
                        ctx.set(REQ_URI, action.getUri());
                    }
                }
            }
        }
        return isValid;
    }

    /**
     * Verifies if the authToken belongs to a valid user in the system.
     * @param ctx
     * @param authToken
     * @return
     */
    public User verifyAuthenticity(RequestContext ctx, String authToken) {
        try {
            User user = userUtils.getUser(authToken, ctx);
            if (null != user)
                ctx.set(USER_INFO_KEY, user);
            return user;
        } catch (Exception ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            return null;
        }
    }

    /**
     * Fetches URI from the request
     * @return
     */
    private String getRequestURI() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest().getRequestURI();
    }

    /**
     * Sets context auth prop.
     * @param enableAuth
     */
    private void setShouldDoAuth(boolean enableAuth) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(AUTH_BOOLEAN_FLAG_NAME, enableAuth);
    }

    /**
     * Fetches auth token from the request header.
     * @return
     */
    private String getAuthTokenFromRequestHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest().getHeader(AUTH_TOKEN_HEADER_NAME);
    }

}

