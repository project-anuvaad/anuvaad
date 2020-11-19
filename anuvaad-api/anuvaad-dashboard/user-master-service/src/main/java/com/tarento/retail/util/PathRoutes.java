package com.tarento.retail.util;

/**
 * 
 * @author Darshan Nagesh
 *
 */

public interface PathRoutes {

	final String USER_ACTIONS_URL = "/user";
	final String AUTH_URL = "/auth";

	public interface UserRoutes {
		final String USER_ACTIONS_POST = "/actions/_get";
		final String COUNTRY_LIST_GET = "/getCountryList";
		final String COUNTRY_LIST_USER_GET = "/getCountryList/{id}";
		final String EMPLOYMENT_TYPES_GET = "/getEmploymentTypes";
		final String NUMBER_OF_USERS_GET = "/getNumberOfUsers";
		final String NUMBER_OF_ROLES_GET = "/getNumberOfRoles";
		final String LIST_USER_GET = "/getAllUser";
		final String USER_BY_ID_GET = "/user/{id}";
		final String CREATE_UPDATE_USER_POST = "/createOrUpdate";
		final String USER_ROLE_MAPPING_POST = "/role/mapping";
		final String USER_COUNTRY_MAPPING_POST = "/country/mapping";
		final String USER_DETAILS_GET = "/getUserDetails";
		final String SINGLE_FILE_UPLOAD_POST = "/upload";
		final String IMAGE_GET = "/images";
		final String USER_DEVICE_TOKEN_POST = "/updateUserDeviceToken";
		final String LOGOUT_GET = "/logout";
		final String CREATE_UPDATE_COUNTRY = "/createOrUpdateCountry";
		final String ORG_COUNTRY_LIST_GET = "/org/getCountryList";
		final String REMOVE_ROLE_MAPPING = "/role/mapping/delete";
		final String DELETE_COUNTRY = "/deleteCountry";
		final String DELETE_USER = "/deleteUser";
		final String GET_USER_LIST_BY_ORG = "/getUserListByOrg";
		final String GET_USERS_BY_MASTER_ROLE = "getUsersByMasterRole";
		final String MAP_USER_MASTER_ROLE_COUNTRY_ORG = "mapUserMasterRoleCountryOrg";
	}

	public interface AuthenticationRoutes {
		final String AUTH_LOGIN_POST = "/login";
		final String AUTH_TOKEN_VALIDATE_POST = "/token/validate";
		final String AUTH_TOKEN_VALIDATE_GET = "/tokenValidate";

	}

	public interface RoleActionRoutes {
		final String LIST_ROLES_GET = "/roles/{orgId}";
		final String GET_DEFAULT_ROLES_BY_DOMAIN = "/domainRole";

		final String ADD_ROLE_POST = "/add/role";
		final String ROLE_BY_ID_GET = "/role/{id}";
		final String UPDATE_ROLE_POST = "/role/update";
		final String NEW_ACTION_POST = "/feature";
		final String DELETE_ROLE_POST = "/deleteRole";
		final String MAP_ACTION_TO_ROLE = "/mapActionToRole";
		final String UNMAP_ACTION_TO_ROLE = "/unmapActionToRole";
		final String GET_MAP_ACTION_LIST = "/getMapActionToRole";
		final String GET_UNMAP_ACTION_LIST = "/getUnmapActionToRole";
		final String GET_MASTER_ROLE_BY_ORG_DOMAIN = "/getMasterRoleByOrgDomain";
		final String GET_USER_BY_ROLE_POST = "/getUsersByRole";
		final String ADD_ORG_DOMAIN_ROLES="/addOrgDomainRoles";
	}
}
