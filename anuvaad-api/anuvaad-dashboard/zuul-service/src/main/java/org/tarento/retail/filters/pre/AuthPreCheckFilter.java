package org.tarento.retail.filters.pre;

import static org.tarento.retail.constants.RequestContextConstants.AUTH_BOOLEAN_FLAG_NAME;
import static org.tarento.retail.constants.RequestContextConstants.AUTH_TOKEN_KEY;
import static org.tarento.retail.constants.RequestContextConstants.ERROR_CODE_KEY;
import static org.tarento.retail.constants.RequestContextConstants.ERROR_MESSAGE_KEY;
import static org.tarento.retail.constants.RequestContextConstants.FILESTORE_REGEX;
import static org.tarento.retail.constants.RequestContextConstants.GET;
import static org.tarento.retail.constants.RequestContextConstants.USER_INFO_FIELD_NAME;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.tarento.retail.model.RequestBodyInspector;
import org.tarento.retail.wrapper.CustomRequestWrapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

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
    private static final String AUTHENTICATION_SCHEME = "Bearer";
    private HashSet<String> openEndpointsWhitelist;
    private HashSet<String> mixedModeEndpointsWhitelist;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final ObjectMapper objectMapper;


    public AuthPreCheckFilter(HashSet<String> openEndpointsWhitelist,
                              HashSet<String> mixedModeEndpointsWhitelist) {
        this.openEndpointsWhitelist = openEndpointsWhitelist;
        this.mixedModeEndpointsWhitelist = mixedModeEndpointsWhitelist;
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
    	if("OPTIONS".equals(RequestContext.getCurrentContext().getRequest().getMethod())) { 
    		return false; 
    	}
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
            logger.info("Getting the Auth token value from request:" +authToken);
        } catch (IOException e) {
            logger.error(AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE, e);
            abortWithStatus(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
            return null;
        }
        RequestContext.getCurrentContext().set(AUTH_TOKEN_KEY, authToken);
        logger.info(RETRIEVED_AUTH_TOKEN_MESSAGE, authToken);
        if (authToken == null) {
            if (mixedModeEndpointsWhitelist.contains(getRequestURI())) {
                logger.info(ROUTING_TO_ANONYMOUS_ENDPOINT_MESSAGE, getRequestURI());
                setShouldDoAuth(false);
            } else {
                logger.info(ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE, getRequestURI());
                abortWithStatus(HttpStatus.UNAUTHORIZED, UNAUTHORIZED_USER_MESSAGE);
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
            logger.info(AUTH_TOKEN_HEADER_MESSAGE, getRequestURI());
            return getAuthTokenFromRequestBody();
        } else {
            logger.info(AUTH_TOKEN_BODY_MESSAGE, getRequestURI());
            return getAuthTokenFromRequestBody();
        }
    }

    private String getAuthTokenFromRequestBody() throws IOException {
    	
    	String requestInfotoken = "";
    	String authorizationHeader = "";
        CustomRequestWrapper requestWrapper = new CustomRequestWrapper(getRequest());
       /* HashMap<String, Object> requestBody = getRequestBody(requestWrapper);
        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);
        @SuppressWarnings("unchecked")
        HashMap<String, Object> requestInfo = requestBodyInspector.getRequestInfo();
        if (requestInfo != null) {
            logger.info(NO_REQUEST_INFO_FIELD_MESSAGE, getRequestURI());
            requestInfotoken = (String) requestInfo.get(AUTH_TOKEN_REQUEST_BODY_FIELD_NAME);
            sanitizeAndSetRequest(requestBodyInspector, requestWrapper);
            return requestInfotoken;
            
        } else {
       */ 	RequestContext ctx = RequestContext.getCurrentContext();
            
            authorizationHeader = ctx.getRequest().getHeader(javax.ws.rs.core.HttpHeaders.AUTHORIZATION);
            logger.info("Authorization header: "+authorizationHeader);
            return authorizationHeader;
        /*}*/
        
        
        
        
        
        
        	
            
        
    }


    private HashMap<String, Object> getRequestBody(CustomRequestWrapper requestWrapper) throws IOException {
        return objectMapper.readValue(requestWrapper.getPayload(),
            new TypeReference<HashMap<String, Object>>() { });
    }

    private void sanitizeAndSetRequest(RequestBodyInspector requestBodyInspector, CustomRequestWrapper requestWrapper) {
        HashMap<String, Object> requestInfo = requestBodyInspector.getRequestInfo();
        requestInfo.remove(USER_INFO_FIELD_NAME);
        requestBodyInspector.updateRequestInfo(requestInfo);
        try {
            requestWrapper.setPayload(objectMapper.writeValueAsString(requestBodyInspector.getRequestBody()));
        } catch (JsonProcessingException e) {
            logger.error(FAILED_TO_SERIALIZE_REQUEST_BODY_MESSAGE, e);
            throw new RuntimeException(e);
        }
        RequestContext.getCurrentContext().setRequest(requestWrapper);
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

    private void abortWithStatus(HttpStatus status, String message) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(ERROR_CODE_KEY, status.value());
        ctx.set(ERROR_MESSAGE_KEY, message);
        ctx.setSendZuulResponse(false);
    }
}