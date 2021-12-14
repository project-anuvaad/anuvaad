package org.anuvaad.filters.pre;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.anuvaad.cache.ZuulConfigCache;
import org.anuvaad.models.*;
import org.anuvaad.utils.ExceptionUtils;
import org.anuvaad.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import static org.anuvaad.constants.RequestContextConstants.*;

/**
 * 3rd filter to execute in the request flow.
 * Checks if the user is authorised to access the API, throws exception otherwise.
 * for the given auth token checks if there's a valid user, valid roles and valid actions in the system.
 * Performs authorisation level checks on the request.
 *
 */
public class RbacFilter extends ZuulFilter {

    private ObjectMapper objectMapper;
    public ResourceLoader resourceLoader;

    @Autowired
    public UserUtils userUtils;

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

    public RbacFilter(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
        objectMapper = new ObjectMapper();
    }

    @Value("${anuvaad.superuser.role.code}")
    private String superUserCode;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final String ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE = "Routing to protected endpoint {} restricted, due to authorization failure";
    private static final String UNAUTHORIZED_USER_MESSAGE = "You are not authorised to access this resource";
    private static final String PROCEED_ROUTING_MESSAGE = "Routing to protected endpoint: {} - authorization check passed!";
    private static final String INVALID_ROLES_MESSAGE = "This user contains an invalid/inactive role!";
    private static final String INVALID_ROLES_ACTIONS_MESSAGE = "This user doesn't have access to the action.";
    private static final String RETRIEVING_USER_FAILED_MESSAGE = "Retrieving user failed";
    public static final String SKIP_RBAC = "RBAC check skipped - whitelisted endpoint | {}";

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        String uri = (String) ctx.get(REQ_URI);
        List<String> openEndpointsWhitelist = ZuulConfigCache.whiteListEndpoints;
        if ((openEndpointsWhitelist.contains(uri))) {
            ctx.set(RBAC_BOOLEAN_FLAG_NAME, false);
            if (!uri.contains("/telemetry"))
                logger.info(SKIP_RBAC, uri);
            return null;
        }
        Boolean isUserAuthorised = verifyAuthorization(ctx, uri);
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
     * @param ctx
     * @param uri
     * @return
     */
    public Boolean verifyAuthorization(RequestContext ctx, String uri) {
        try {
            User user = (User) ctx.get(USER_INFO_KEY);
            List<String> roleCodes = user.getRoles().stream().map(UserRole::getRoleCode).collect(Collectors.toList());
            if(roleCodes.contains(superUserCode)) return true;
            Boolean isRolesCorrect = verifyRoles(user.getRoles());
            if(isRolesCorrect)
                return verifyRoleActions(user.getRoles(), uri);
            else return false;
        } catch (Exception ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            return false;
        }
    }

    /**
     * Verifies if the user has valid roles.
     * @param userRoles
     * @return
     */
    public Boolean verifyRoles(List<UserRole> userRoles) {
        try{
            List<String> configRoles = ZuulConfigCache.roleCodes;
            if (CollectionUtils.isEmpty(configRoles)){
                logger.info("Roles couldn't be fetched from config");
                return false;
            }
            List<String> roles = userRoles.stream().map(UserRole::getRoleCode).collect(Collectors.toList());
            for(String role: roles){
                if (!configRoles.contains(role)) {
                    logger.info(INVALID_ROLES_MESSAGE);
                    return false;
                }
            }
            return true;
        }catch (Exception e) {
            logger.error("Exception while verifying roles: ", e);
            return false;
        }

    }

    /**
     * Verifies if the the user has access to the action being accessed.
     * @param userRoles
     * @param uri
     * @return
     */
    public Boolean verifyRoleActions(List<UserRole> userRoles, String uri) {
        try{
            Map<String, List<String>> roleActions = ZuulConfigCache.roleActionMap;
            List<String> roles = userRoles.stream().map(UserRole::getRoleCode).collect(Collectors.toList());;
            int fail = 0;
            for (String role: roles){
                List<String> actionList = roleActions.get(role);
                if (CollectionUtils.isEmpty(actionList)) fail = fail + 1;
                else{
                    if(!actionList.contains(uri)) fail += 1;
                    else break;
                }
            }
            if (fail == roles.size()){
                logger.info(INVALID_ROLES_ACTIONS_MESSAGE);
                return false;
            }
            else return true;
        }catch (Exception e) {
            logger.error("Exception while verifying role-actions: ", e);
            return false;
        }
    }
}
