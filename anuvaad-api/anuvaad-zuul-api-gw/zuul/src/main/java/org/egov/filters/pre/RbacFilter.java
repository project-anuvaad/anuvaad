package org.egov.filters.pre;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import lombok.extern.slf4j.Slf4j;
import org.egov.Utils.ExceptionUtils;
import org.egov.Utils.Utils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.contract.User;
import org.egov.exceptions.CustomException;
import org.egov.model.AuthorizationRequest;
import org.egov.model.AuthorizationRequestWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

import static java.util.Objects.isNull;
import static org.egov.constants.RequestContextConstants.*;

/**
 * 5th pre filter to get executed.
 * Filter gets executed if the RBAC flag is enabled. Returns an error if the URI is not present in the authorized action list.
 */
@Slf4j
public class RbacFilter extends ZuulFilter {

    private static final String FORBIDDEN_MESSAGE = "Not authorized to access this resource";

    private RestTemplate restTemplate;

    private String authorizationUrl;

    private ObjectMapper objectMapper;


    @Autowired
    public RbacFilter(RestTemplate restTemplate, String authorizationUrl, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.authorizationUrl = authorizationUrl;
        this.objectMapper = objectMapper;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 4;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getBoolean(RBAC_BOOLEAN_FLAG_NAME);
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        final boolean isIncomingURIInAuthorizedActionList = isIncomingURIInAuthorizedActionList(ctx);
        if (isIncomingURIInAuthorizedActionList)
            return null;

        ExceptionUtils.raiseCustomException(HttpStatus.FORBIDDEN, FORBIDDEN_MESSAGE);
        return null;
    }

    private boolean isIncomingURIInAuthorizedActionList(RequestContext ctx) {
        String requestUri = ctx.getRequest().getRequestURI();
        User user = (User) ctx.get(USER_INFO_KEY);

        if (user == null) {
            ExceptionUtils.raiseCustomException(HttpStatus.UNAUTHORIZED, "User information not found. Can't execute RBAC filter");
        }

        Set<String> tenantId = validateRequestAndSetRequestTenantId();

        ctx.set(CURRENT_REQUEST_TENANTID, String.join(",", tenantId));

        AuthorizationRequest request = AuthorizationRequest.builder()
            .roles(new HashSet<>(user.getRoles()))
            .uri(requestUri)
            .tenantIds(tenantId)
            .build();

        return isUriAuthorized(request);

    }

    private Set<String> validateRequestAndSetRequestTenantId() {

        RequestContext ctx = RequestContext.getCurrentContext();

        return getTenantIdForRequest(ctx);
    }

    private Set<String> getTenantIdForRequest(RequestContext ctx) {
        HttpServletRequest request = ctx.getRequest();
        Map<String, List<String>> queryParams = ctx.getRequestQueryParams();

        Set<String> tenantIds = new HashSet<>();


        if (Utils.isRequestBodyCompatible(request)) {

            try {
                ObjectNode requestBody = (ObjectNode) objectMapper.readTree(request.getInputStream());

                stripRequestInfo(requestBody);

                List<String> tenants = new LinkedList<>();

                for (JsonNode node : requestBody.findValues(REQUEST_TENANT_ID_KEY)) {
                    if (node.getNodeType() == JsonNodeType.ARRAY)
                    {
                        node.elements().forEachRemaining(n -> tenants.add(n.asText()));
                    } else if (node.getNodeType() == JsonNodeType.STRING) {
                        tenants.add(node.asText());
                    }
                }
                if( ! tenants.isEmpty())
                // Filtering null tenantids will be removed once fix is done in TL service.
                    tenants.forEach(tenant -> {
                        if (tenant != null && !tenant.equalsIgnoreCase("null"))
                            tenantIds.add(tenant);
                    });
                else{
                    if (!isNull(queryParams) && queryParams.containsKey(REQUEST_TENANT_ID_KEY) && !queryParams.get(REQUEST_TENANT_ID_KEY).isEmpty()) {
                        String tenantId = queryParams.get(REQUEST_TENANT_ID_KEY).get(0);
                        if(tenantId.contains(",")){
                            tenantIds.addAll(Arrays.asList(tenantId.split(",")));
                        } else
                            tenantIds.add(tenantId);

                    }
                }

            } catch (IOException e) {
                throw new RuntimeException( new CustomException("REQUEST_PARSE_FAILED", HttpStatus.UNAUTHORIZED.value() ,"Failed to parse request at" +
                    " API gateway"));
            }
        }

        if (tenantIds.isEmpty()) {
            tenantIds.add(((User) ctx.get(USER_INFO_KEY)).getTenantId());
        }

        return tenantIds;
    }

    private void stripRequestInfo(ObjectNode requestBody) {
        if (requestBody.has(REQUEST_INFO_FIELD_NAME_PASCAL_CASE))
            requestBody.remove(REQUEST_INFO_FIELD_NAME_PASCAL_CASE);

        else if (requestBody.has(REQUEST_INFO_FIELD_NAME_CAMEL_CASE))
            requestBody.remove(REQUEST_INFO_FIELD_NAME_CAMEL_CASE);

    }

    private boolean isUriAuthorized(AuthorizationRequest authorizationRequest) {
        AuthorizationRequestWrapper authorizationRequestWrapper = new AuthorizationRequestWrapper(new RequestInfo(),
            authorizationRequest);

        try {
            ResponseEntity<Void> responseEntity = restTemplate.postForEntity(authorizationUrl, authorizationRequestWrapper, Void
                .class);

            return responseEntity.getStatusCode().equals(HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            log.warn("Exception while attempting to authorize via access control", e);
            return false;
        } catch (Exception e) {
            log.warn("Unknown exception occurred while attempting to authorize via access control", e);
            return false;
        }

    }


}
