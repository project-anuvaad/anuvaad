package org.egov.filters.pre;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.egov.Utils.ExceptionUtils;
import org.egov.Utils.UserUtils;
import org.egov.contract.User;
import org.egov.model.RequestBodyInspector;
import org.egov.wrapper.CustomRequestWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;

import static org.egov.constants.RequestContextConstants.*;

/**
 *  2nd pre filter to get executed.
 *  Identifies if the URI is part of open or mixed endpoint list.
 *  If its not present in the open list then the auth token is retrieved from the request body.
 *  For a restricted endpoint if auth token is not present then an error response is returned.
 */
public class AuthPreCheckFilter extends ZuulFilter {
    private static final String AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE = "Retrieving of auth token failed";
    private static final String OPEN_ENDPOINT_MESSAGE = "Routing to an open endpoint: {}";
    private static final String AUTH_TOKEN_HEADER_MESSAGE = "Fetching auth-token from header for URI: {}";
    private static final String AUTH_TOKEN_BODY_MESSAGE = "Fetching auth-token from request body for URI: {}";
    private static final String AUTH_TOKEN_HEADER_NAME = "auth-token";
    private static final String RETRIEVED_AUTH_TOKEN_MESSAGE = "Auth-token: {}";
    private static final String ROUTING_TO_ANONYMOUS_ENDPOINT_MESSAGE = "Routing to anonymous endpoint: {}";
    private static final String ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE =
        "Routing to protected endpoint {} restricted - No auth token";
    private static final String UNAUTHORIZED_USER_MESSAGE = "You are not authorized to access this resource";
    private static final String PROCEED_ROUTING_MESSAGE = "Routing to an endpoint: {} - auth provided";
    private static final String NO_REQUEST_INFO_FIELD_MESSAGE = "No request-info field in request body for: {}";
    private static final String AUTH_TOKEN_REQUEST_BODY_FIELD_NAME = "authToken";
    private static final String FAILED_TO_SERIALIZE_REQUEST_BODY_MESSAGE = "Failed to serialize requestBody";
    private HashSet<String> openEndpointsWhitelist;
    private HashSet<String> mixedModeEndpointsWhitelist;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final ObjectMapper objectMapper;
    private UserUtils userUtils;


    public AuthPreCheckFilter(HashSet<String> openEndpointsWhitelist,
                              HashSet<String> mixedModeEndpointsWhitelist,
                              UserUtils userUtils) {
        this.openEndpointsWhitelist = openEndpointsWhitelist;
        this.mixedModeEndpointsWhitelist = mixedModeEndpointsWhitelist;
        this.userUtils = userUtils;
        objectMapper = new ObjectMapper();
    }

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
            authToken = getAuthTokenFromRequest();
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

    private String getAuthTokenFromRequest() throws IOException {
        if (GET.equalsIgnoreCase(getRequestMethod()) || getRequestURI().matches(FILESTORE_REGEX)) {
            logger.debug(AUTH_TOKEN_HEADER_MESSAGE, getRequestURI());
            return getAuthTokenFromRequestHeader();
        } else {
            logger.debug(AUTH_TOKEN_BODY_MESSAGE, getRequestURI());
            return getAuthTokenFromRequestBody();
        }
    }

    private String getAuthTokenFromRequestBody() throws IOException {
        CustomRequestWrapper requestWrapper = new CustomRequestWrapper(getRequest());
        HashMap<String, Object> requestBody = getRequestBody(requestWrapper);
        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);
        @SuppressWarnings("unchecked")
        HashMap<String, Object> requestInfo = requestBodyInspector.getRequestInfo();
        if (requestInfo == null) {
            logger.info(NO_REQUEST_INFO_FIELD_MESSAGE, getRequestURI());
            return null;
        }
        String authToken = (String) requestInfo.get(AUTH_TOKEN_REQUEST_BODY_FIELD_NAME);
        sanitizeAndSetRequest(requestBodyInspector, requestWrapper);
        return authToken;
    }

    private HashMap<String, Object> getRequestBody(CustomRequestWrapper requestWrapper) throws IOException {
        return objectMapper.readValue(requestWrapper.getPayload(),
            new TypeReference<HashMap<String, Object>>() { });
    }

    private void sanitizeAndSetRequest(RequestBodyInspector requestBodyInspector, CustomRequestWrapper requestWrapper) {
        HashMap<String, Object> requestInfo = requestBodyInspector.getRequestInfo();
        RequestContext ctx = RequestContext.getCurrentContext();
        requestInfo.remove(USER_INFO_FIELD_NAME);
        requestInfo.remove(AUTH_TOKEN_REQUEST_BODY_FIELD_NAME);
        requestBodyInspector.updateRequestInfo(requestInfo);
        try {
            String requestSanitizedBody = objectMapper.writeValueAsString(requestBodyInspector.getRequestBody());
            ctx.set(CURRENT_REQUEST_SANITIZED_BODY, requestBodyInspector.getRequestBody());
            requestWrapper.setPayload(requestSanitizedBody);
        } catch (JsonProcessingException e) {
            logger.error(FAILED_TO_SERIALIZE_REQUEST_BODY_MESSAGE, e);
            ExceptionUtils.RaiseException(e);
        }
        ctx.setRequest(requestWrapper);
    }

    private String getAuthTokenFromRequestHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest().getHeader(AUTH_TOKEN_HEADER_NAME);
    }

    private void setShouldDoAuth(boolean enableAuth) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(AUTH_BOOLEAN_FLAG_NAME, enableAuth);
    }

    private String getRequestURI() {
        return getRequest().getRequestURI();
    }

    private HttpServletRequest getRequest() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest();
    }

    private String getRequestMethod() {
        return getRequest().getMethod();
    }

    private void setAnonymousUser(){
        User systemUser = userUtils.fetchSystemUser();
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, systemUser);;
    }

}