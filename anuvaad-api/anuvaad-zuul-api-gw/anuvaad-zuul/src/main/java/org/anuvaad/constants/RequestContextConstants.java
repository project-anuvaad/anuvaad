package org.anuvaad.constants;

import org.springframework.stereotype.Component;

@Component
public class RequestContextConstants {
    public static final String AUTH_BOOLEAN_FLAG_NAME = "shouldDoAuth";
    public static final String AUTH_TOKEN_KEY = "authToken";
    public static final String PATH_PARAM_URI = "pathParamUri";
    public static final String QUERY_PARAM_URI = "queryParamUri";
    public static final String REQ_URI = "reqUri";
    public static final String USER_INFO_KEY = "USER_INFO";
    public static final String CORRELATION_ID_HEADER_NAME = "x-correlation-id";
    public static final String CORRELATION_ID_KEY = "CORRELATION_ID";
    public static final String RBAC_BOOLEAN_FLAG_NAME = "shouldDoRbac";
    public static final String AUTH_TOKEN_HEADER_NAME = "auth-token";

    public static final String ZUUL_AUTH_TOKEN_HEADER_KEY = "x-auth-token";
    public static final String ZUUL_USER_ID_HEADER_KEY = "x-user-id";
    public static final String ZUUL_REQUEST_ID_HEADER_KEY = "x-request-id";
    public static final String ZUUL_SESSION_ID_HEADER_KEY = "x-session-id";
    public static final String ZUUL_ORG_ID_HEADER_KEY = "x-org-id";
    public static final String ZUUL_ROLES_HEADER_KEY = "x-roles";


}