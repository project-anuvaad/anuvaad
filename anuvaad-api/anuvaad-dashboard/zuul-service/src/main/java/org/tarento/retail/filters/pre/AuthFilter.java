package org.tarento.retail.filters.pre;

import static org.tarento.retail.constants.RequestContextConstants.AUTH_BOOLEAN_FLAG_NAME;
import static org.tarento.retail.constants.RequestContextConstants.AUTH_TOKEN_KEY;
import static org.tarento.retail.constants.RequestContextConstants.CORRELATION_ID_HEADER_NAME;
import static org.tarento.retail.constants.RequestContextConstants.CORRELATION_ID_KEY;
import static org.tarento.retail.constants.RequestContextConstants.ERROR_CODE_KEY;
import static org.tarento.retail.constants.RequestContextConstants.ERROR_MESSAGE_KEY;
import static org.tarento.retail.constants.RequestContextConstants.RBAC_BOOLEAN_FLAG_NAME;
import static org.tarento.retail.constants.RequestContextConstants.USER_INFO_KEY;

import java.io.IOException;
import java.net.URI;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.tarento.retail.contract.AuthToken;
import org.tarento.retail.contract.User;
import org.tarento.retail.util.ResponseMessages;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

/**
 *  4th pre filter to get executed.
 *  If the auth flag is enabled then the user is retrieved for the given auth token.
 */
public class AuthFilter extends ZuulFilter {

    private static final String INPUT_STREAM_CONVERSION_FAILED_MESSAGE = "Failed to convert to input stream";
    private static final String RETRIEVING_USER_FAILED_MESSAGE = "Retrieving user failed";
    private static final String TOKEN_EXPIRED = "Token Invalid or Expired";
    private final ProxyRequestHelper helper;
    private final String authServiceHost;
    private final String authUri;
    private final RestTemplate restTemplate;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    public AuthFilter(ProxyRequestHelper helper, RestTemplate restTemplate, String authServiceHost, String authUri) {
        this.helper = helper;
        this.restTemplate = restTemplate;
        this.authServiceHost = authServiceHost;
        this.authUri = authUri;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 3;
    }

    @Override
    public boolean shouldFilter() {
    	if("OPTIONS".equals(RequestContext.getCurrentContext().getRequest().getMethod())) { 
    		return false; 
    	}
        return RequestContext.getCurrentContext().getBoolean(AUTH_BOOLEAN_FLAG_NAME);
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        String authToken = (String) ctx.get(AUTH_TOKEN_KEY);
        try {
            User user = getUser(authToken, ctx);
            logger.info(user.toString());
            ctx.set(USER_INFO_KEY, user);
        } catch (HttpClientErrorException ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            abortWithStatus(306,  ResponseMessages.StandardKeysToCompare.INVALID_AUTH_FILTER_SOURCE, ex);
            throw ex;
        }catch (Exception ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            abortWithStatus(306,  ResponseMessages.StandardKeysToCompare.INVALID_AUTH_FILTER_SOURCE, ex);
            throw ex;
        }
        return null;
    }

    private User getUser(String authToken, RequestContext ctx) {
        String authURL = String.format("%s%s%s", authServiceHost, authUri, "");
        final HttpHeaders headers = new HttpHeaders();
        headers.add(CORRELATION_ID_HEADER_NAME, (String) ctx.get(CORRELATION_ID_KEY));
        headers.setContentType(MediaType.APPLICATION_JSON);
        authToken = authToken.replace("Bearer ", "").trim(); 
        headers.add("Authorization",authToken);
        
        AuthToken au = new AuthToken();
        au.setAuthToken(authToken);
        final HttpEntity<AuthToken> httpEntity = new HttpEntity<>(au, headers);
        URI uri = URI.create(authServiceHost);
        logger.info("Auth Token Object Being passed : " + au.toString());
        logger.info("URI Being passed : " + uri);
        logger.info("HTTP Entity Being passed : " + httpEntity);
        return restTemplate.postForObject(uri, httpEntity, User.class);
        
        
    }

    private void abortWithException(RequestContext ctx, HttpClientErrorException ex) {
        ctx.setSendZuulResponse(false);
        try {
            helper.setResponse(ex.getStatusCode().value(),
                IOUtils.toInputStream(ex.getResponseBodyAsString()),
                ex.getResponseHeaders());
        } catch (IOException e) {
            logger.error(INPUT_STREAM_CONVERSION_FAILED_MESSAGE, e);
            throw new RuntimeException(e);
        }
    }
    
    private void abortWithStatus(HttpStatus status, String message, Exception ex) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(ERROR_CODE_KEY, status.value());
        ctx.set(ERROR_MESSAGE_KEY, message);
        ctx.set("error.exception", ex);
        ctx.set(RBAC_BOOLEAN_FLAG_NAME, Boolean.FALSE); 
        ctx.setSendZuulResponse(false);
    }
    
    private void abortWithStatus(int status, String message, Exception ex) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(ERROR_CODE_KEY, status);
        ctx.set(ERROR_MESSAGE_KEY, message);
        ctx.set("error.exception", ex);
        ctx.set(RBAC_BOOLEAN_FLAG_NAME, Boolean.FALSE); 
        ctx.setSendZuulResponse(false);
    }
}