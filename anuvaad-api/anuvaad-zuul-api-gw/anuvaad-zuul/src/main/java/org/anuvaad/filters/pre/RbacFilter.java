package org.anuvaad.filters.pre;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import net.minidev.json.JSONObject;
import org.anuvaad.models.*;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import static org.anuvaad.constants.RequestContextConstants.*;

public class RbacFilter extends ZuulFilter {

    @Value("#{'${anuvaad.open-endpoints-whitelist}'.split(',')}")
    private HashSet<String> openEndpointsWhitelist;

    @Value("${anuvaad.auth-service-host}")
    private String authServiceHost;

    @Value("${anuvaad.auth-service-host}")
    private String authUri;

    @Value("${anuvaad.auth-service-host}")
    private String roleConfigsUrl;

    @Value("${anuvaad.auth-service-host}")
    private String actionConfigsUrl;

    @Value("${anuvaad.auth-service-host}")
    private String roleActionConfigsUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    public static ResourceLoader resourceLoader;

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
    private static final String INVALID_ROLES_ACTIONS_MESSAGE = "You don't have access to the action.";
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
        Boolean isUserAuthorised = verifyAuthorization(ctx, authToken, uri);
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
    public Boolean verifyAuthorization(RequestContext ctx, String authToken, String uri) {
        try {
            User user = getUser(authToken, ctx);
            Boolean isRolesCorrect = verifyRoles(user.getUserRoles());
            if(isRolesCorrect) {
                Boolean isRoleActionsCorrect = verifyRoleActions(user.getUserRoles(), uri);
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

    public Boolean verifyRoles(List<UserRole> userRoles) {
        try{
            Resource resource = resourceLoader.getResource(roleConfigsUrl);
            HashMap<String, List<Role>> rolesMap = objectMapper.readValue(resource.getInputStream(), HashMap.class);
            List<String> configRoles = rolesMap.get("roles").stream()
                    .filter(Role::getActive).map(Role::getCode).collect(Collectors.toList());
            if (CollectionUtils.isEmpty(configRoles)){
                logger.info("Roles couldn't be fetched from config");
                return false;
            }
            List<String> roles = userRoles.stream().map(UserRole::getRoleCode).collect(Collectors.toList());
            for(String role: roles){
                if (!configRoles.contains(role)) {
                    logger.info("This user contains an invalid/inactive role!");
                    return false;
                }
            }
            return true;
        }catch (Exception e) {
            logger.error(String.valueOf(e));
            return false;
        }

    }

    public Boolean verifyRoleActions(List<UserRole> userRoles, String uri) {
        try{
            Resource resource = resourceLoader.getResource(actionConfigsUrl);
            HashMap<String, List<Action>> actionsMap = objectMapper.readValue(resource.getInputStream(), HashMap.class);
            Map<String, String> configActions = actionsMap.get("actions").stream()
                    .filter(Action::getActive).collect(Collectors.toMap(Action:: getId, Action::getUri));
            resource = resourceLoader.getResource(roleActionConfigsUrl);
            HashMap<String, List<RoleAction>> roleActionsMap = objectMapper.readValue(resource.getInputStream(), HashMap.class);
            List<RoleAction> configRoleActions = roleActionsMap.get("role-actions");
            Map<String, List<String>> roleActions = new HashMap<>();
            for(RoleAction roleAction: configRoleActions){
                if (roleAction.getActive()){
                    if (null != roleActions.get(roleAction.getRole())){
                        List<String> actionListOftheRole = roleActions.get(roleAction.getRole());
                        actionListOftheRole.add(configActions.get(roleAction.getActionID()));
                        roleActions.put(roleAction.getRole(), actionListOftheRole);
                    }else{
                        List<String> actionListOftheRole = new ArrayList<>();
                        actionListOftheRole.add(configActions.get(roleAction.getActionID()));
                        roleActions.put(roleAction.getRole(), actionListOftheRole);
                    }
                }
            }
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
            return fail != roles.size();
        }catch (Exception e) {
            logger.error(String.valueOf(e));
            return false;
        }
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
