package org.anuvaad.cache;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.anuvaad.models.Action;
import org.anuvaad.models.Role;
import org.anuvaad.models.RoleAction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ZuulConfigCache implements ApplicationRunner {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${anuvaad.role.configs}")
    private String roleConfigsUrl;

    @Value("${anuvaad.action.configs}")
    private String actionConfigsUrl;

    @Value("${anuvaad.role-action.configs}")
    private String roleActionConfigsUrl;

    @Autowired
    public static ResourceLoader resourceLoader;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public static List<Role> roles;
    public static List<Action> actions;
    public static List<RoleAction> roleActions;
    public static Map<String, List<String>> roleActionMap;
    public static Map<String, String> actionMap;
    public static List<String> roleCodes;
    public static List<String> whiteListEndpoints;

    @Override
    public void run(ApplicationArguments args){
        logger.info("Building Zuul config cache....");
        try{
            roles = readRoleConfigs();
            actions = readActionConfigs();
            roleActions = readRoleActionConfigs();
            actionMap = fetchActionMap(actions);
            roleCodes = fetchRoleCodes(roles);
            whiteListEndpoints = fetchWhiteListEndpoints(actions);
            roleActionMap = buildRoleActionMap(roleActions, actionMap);
            logger.info("Zuul config cache...DONE!");
        }catch (Exception e){
            logger.error("Exception while building cache..", e);
        }
    }

    /**
     * Reads role configs from the config file.
     */
    public List<Role> readRoleConfigs() throws Exception{
        logger.info("Reading roles from..: {}", roleConfigsUrl);
        Resource resource = resourceLoader.getResource(roleConfigsUrl);
        HashMap<String, List<Role>> rolesMap = objectMapper.readValue(resource.getInputStream(), HashMap.class);
        return rolesMap.get("roles");
    }

    /**
     * Reads action configs from the config file.
     */
    public List<Action> readActionConfigs() throws Exception{
        logger.info("Reading actions from..: {}", actionConfigsUrl);
        Resource resource = resourceLoader.getResource(actionConfigsUrl);
        HashMap<String, List<Action>> rolesMap = objectMapper.readValue(resource.getInputStream(), HashMap.class);
        return rolesMap.get("actions");
    }

    /**
     * Reads roleAction configs from the config file.
     */
    public List<RoleAction> readRoleActionConfigs() throws Exception{
        logger.info("Reading role-actions from..: {}", roleActionConfigsUrl);
        Resource resource = resourceLoader.getResource(roleActionConfigsUrl);
        HashMap<String, List<RoleAction>> rolesMap = objectMapper.readValue(resource.getInputStream(), HashMap.class);
        return rolesMap.get("role-actions");
    }

    /**
     * With all roles and actions config, builds a map for role against authorised actions.
     * @return
     */
    public Map<String, List<String>> buildRoleActionMap(List<RoleAction> roleActions, Map<String, String> actionMap){
        logger.info("Building roleActionMap..");
        Map<String, List<String>> roleActionMap = new HashMap<>();
        for(RoleAction roleAction: roleActions){
            if (roleAction.getActive()){
                if (null != roleActionMap.get(roleAction.getRole())){
                    List<String> actionListOftheRole = roleActionMap.get(roleAction.getRole());
                    actionListOftheRole.add(actionMap.get(roleAction.getActionID()));
                    roleActionMap.put(roleAction.getRole(), actionListOftheRole);
                }else{
                    List<String> actionListOftheRole = new ArrayList<>();
                    actionListOftheRole.add(actionMap.get(roleAction.getActionID()));
                    roleActionMap.put(roleAction.getRole(), actionListOftheRole);
                }
            }
        }
        return roleActionMap;
    }

    /**
     * With all actions config, builds a map for actionID against action.
     * @return
     */
    public Map<String, String> fetchActionMap(List<Action> actions){
        logger.info("Fetching actionMap..");
        return actions.stream()
                .filter(Action::getActive).collect(Collectors.toMap(Action:: getId, Action::getUri));
    }

    /**
     * Using the role config, returns a list of role codes.
     * @return
     */
    public List<String> fetchRoleCodes(List<Role> configRoles){
        logger.info("Fetching roleCodes..");
        return configRoles.stream()
                .filter(Role::getActive).map(Role::getCode).collect(Collectors.toList());
    }

    /**
     * Using the action config, returns a list of white listed endpoints.
     * @return
     */
    public List<String> fetchWhiteListEndpoints(List<Action> actions){
        logger.info("Fetching whileListEndpoints..");
        return actions.stream()
                .filter(Action::getWhiteList).map(Action::getUri).collect(Collectors.toList());
    }

}
