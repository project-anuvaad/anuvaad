package org.anuvaad.filters.pre;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.anuvaad.models.Role;
import org.anuvaad.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.List;

import static org.anuvaad.constants.RequestContextConstants.*;

public class RbacFilter extends ZuulFilter {

    @Value("#{'${anuvaad.open-endpoints-whitelist}'.split(',')}")
    private HashSet<String> openEndpointsWhitelist;

    @Value("${anuvaad.auth-service-host}")
    private String authServiceHost;

    @Value("${anuvaad.auth-service-host}")
    private String authUri;

    @Autowired
    private RestTemplate restTemplate;

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
        return true;
    }

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final String AUTH_TOKEN_HEADER_NAME = "auth-token";
    private static final String ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE = "Routing to protected endpoint {} restricted, due to authorization failure";
    private static final String UNAUTHORIZED_USER_MESSAGE = "You are not authorised to access this resource";
    private static final String PROCEED_ROUTING_MESSAGE = "Routing to protected endpoint: {} - auth provided";
    private static final String INVALID_ROLES_MESSAGE = "You have invalid roles.";
    private static final String INVALID_ROLES_ACTIONS_MESSAGE = "You don't have access to the actions.";
    private static final String RETRIEVING_USER_FAILED_MESSAGE = "Retrieving user failed";


    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        String uri = ctx.getRequest().getRequestURI();
        String authToken = ctx.getRequest().getHeader(AUTH_TOKEN_HEADER_NAME);
        if ((openEndpointsWhitelist.contains(uri))) {
            ctx.set(RBAC_BOOLEAN_FLAG_NAME, false);
            logger.info(SKIP_RBAC, uri);
            return null;
        }
        Boolean isUserAuthorised = verifyAuthorization(authToken, uri);
        if (isUserAuthorised){
            logger.info(PROCEED_ROUTING_MESSAGE, uri);
            return null;
        }
        else
            logger.info(ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE, uri);
            ExceptionUtils.raiseCustomException(HttpStatus.UNAUTHORIZED, UNAUTHORIZED_USER_MESSAGE);
            return null;
    }

    /**
     * Verifies if the user has the necessary authorization for the resource.
     * @param authToken
     * @param uri
     * @return
     */
    public Boolean verifyAuthorization(String authToken, String uri) {
        try {
            User user = getUser(authToken, ctx);
            Boolean isRolesCorrect = verifyRoles(user.getRoles());
            if(isRolesCorrect) {
                Boolean isRoleActionsCorrect = verifyRoleActions(user.getRoles(), uri);
                if(isRoleActionsCorrect)
                    return true;
                else {
                    logger.info(INVALID_ROLES_ACTIONS_MESSAGE);
                    return false;
                }
            }
            else{
                logger.info(INVALID_ROLES_MESSAGE);
                return false;
            }
        } catch (Exception ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            return false;
        }
    }

    public Boolean verifyRoles(List<Role> roles) {
        return true;
    }

    public Boolean verifyRoleActions(List<Role> roles, String uri) {
        return true;
    }


    /**
     * Fetches user from the UMS via API.
     * @param authToken
     * @param ctx
     * @return
     */
    private User getUser(String authToken, RequestContext ctx) {
        String authURL = String.format("%s%s%s", authServiceHost, authUri, authToken);
        final HttpHeaders headers = new HttpHeaders();
        headers.add(CORRELATION_ID_HEADER_NAME, (String) ctx.get(CORRELATION_ID_KEY));
        final HttpEntity<Object> httpEntity = new HttpEntity<>(null, headers);
        return restTemplate.postForObject(authURL, httpEntity, User.class);
    }

}
