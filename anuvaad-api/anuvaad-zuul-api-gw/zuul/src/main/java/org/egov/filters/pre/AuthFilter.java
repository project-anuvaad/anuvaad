package org.egov.filters.pre;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.egov.Utils.ExceptionUtils;
import org.egov.contract.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import static org.egov.constants.RequestContextConstants.*;

/**
 *  4th pre filter to get executed.
 *  If the auth flag is enabled then the user is retrieved for the given auth token.
 */
public class AuthFilter extends ZuulFilter {

    private static final String INPUT_STREAM_CONVERSION_FAILED_MESSAGE = "Failed to convert to input stream";
    private static final String RETRIEVING_USER_FAILED_MESSAGE = "Retrieving user failed";
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
        return RequestContext.getCurrentContext().getBoolean(AUTH_BOOLEAN_FLAG_NAME);
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        String authToken = (String) ctx.get(AUTH_TOKEN_KEY);
        try {
            User user = getUser(authToken, ctx);
            ctx.set(USER_INFO_KEY, user);
        } catch (HttpClientErrorException ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            ExceptionUtils.RaiseException(ex);
        } catch (ResourceAccessException ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            ExceptionUtils.raiseCustomException(HttpStatus.INTERNAL_SERVER_ERROR, "User authentication service is down");
        }
        return null;
    }

    private User getUser(String authToken, RequestContext ctx) {
        String authURL = String.format("%s%s%s", authServiceHost, authUri, authToken);
        final HttpHeaders headers = new HttpHeaders();
        headers.add(CORRELATION_ID_HEADER_NAME, (String) ctx.get(CORRELATION_ID_KEY));
        final HttpEntity<Object> httpEntity = new HttpEntity<>(null, headers);
        return restTemplate.postForObject(authURL, httpEntity, User.class);
    }

}