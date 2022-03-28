package com.tarento.retail.util;

/**
 * This interface will hold all the SQL Quries which are being used by the
 * application Internally, the inner interface will have the queries separated
 * based on the functionalities that they are associated with
 * 
 * @author Darshan Nagesh
 *
 */
public interface Sql {

	final String ID = "id";

	/**
	 * All the queries associated with the Common activities or transactions will be
	 * placed here
	 * 
	 * @author Darshan Nagesh
	 *
	 */
	public interface Common {
		final String VERIFY_PASSWORD = "SELECT id FROM user WHERE password = ? AND username = ? ";
		final String WHERE_CLAUSE = " WHERE ";
		final String AND_CONDITION = " AND ";
		final String OR_CONDITION = " OR ";
		final String OPEN_BRACE = "(";
		final String CLOSE_BRACE = ")";
		final String GET_COUNTRY_LIST = "SELECT id, name, code, currency, phone_code, FALSE as is_default FROM country ";
		final String GET_COUNTRY_LIST_FOR_USER = "SELECT c.id, c.name, c.code, c.currency, c.phone_code, cu.is_default FROM country c left join country_user cu ON c.id = cu.country_id where cu.user_id = ?";
		final String GET_COUNTRY_LIST_FOR_ORG = "SELECT id, name, code, currency, phone_code, url FROM country WHERE  org_id = ?";
		final String BY_ROLE_ID = " role_id in (<ROLE_ID>) ";
		final String DELETE_COUNTRY_FOR_USER = "DELETE from country_user where country_id=?";
		final String DELETE_COUNTRY_FOR_ORG = "DELETE from country where id=? AND org_id=? ";
	}

	public interface RoleAction {
//		final String GET_ALL_ROLES = "SELECT id, role_name, r.code , description, org_id FROM role r INNER JOIN role_org ro ON r.id= ro.role_id WHERE ro.org_id = ?";
		final String GET_ALL_ROLES = "SELECT id, role_name, code , description, org_id FROM role where org_id=?";
		// final String GET_ROLE_BY_ORG_DOMAIN = "select * from org_domain_role odr
		// INNER JOIN role r ON odr.role_id = r.id where org_domain=?";
		final String GET_ROLE_BY_ORG_DOMAIN = "select * from org_domain_role where org_domain=?";
		final String SELECT_ROLES_ON_ID = "SELECT * FROM role WHERE id=?";
		final String GET_DEFAULT_ROLES = "SELECT * FROM org_domain_role WHERE role_id = ?";
		final String GET_ROLE_BY_USER = "select r.role_id as id, r.description as description,  r.role_name as role_name, r.org_id as org_id from user usr inner join user_role ur  on usr.id = ur.user_id inner join role r on r.id = ur.role_id where usr.id = ? and r.org_id= ?";
		final String SELECT_ROLE_ACTIONS_ON_ROLEID = "SELECT * FROM role_actions WHERE role_id=?";
		final String SELECT_ACTIONS_ON_ID = "SELECT * FROM actions WHERE id=?";
		final String SAVE_NEW_ROLE = "INSERT INTO role (role_name,description,code, is_org_admin, org_id) VALUES (? , ?, ?,?,?)";

		final String UPDATE_ROLE = "UPDATE role SET role_name = ?, description = ? WHERE id= ? ";
		final String UPDATE_ROLE_ORG = "INSERT INTO role_org(role_id, org_id) value (?,?) ";

		final String INSERT_ACTION = "INSERT INTO retail_actions (description, module_code, module_name, url) VALUES (?, ?, ?, ?)";
		final String DELETE_ROLE = "DELETE from role where id=?";
		final String MAP_ACTION_TO_ROLE = "insert into role_actions(role_id,action_id) values(?,?)";
//		final String MAP_ACTION_TO_ROLE = "insert into role_actions(role_id,action_id, org_id) values(?,?,?)";
		final String UNMAP_ORG_ROLE = "DELETE FROM role_org WHERE role_id = ? AND org_id = ?";
		final String UNMAP_ACTION_TO_ROLE = "delete from role_actions where action_id=? and role_id = ?";
		final String GET_MAPPED_ACTION_ROLE_LIST = "select * from retail_user.actions where id IN (select action_id as id from retail_user.role_actions where role_id=?)";
		final String GET_UNMAPPED_ACTION_ROLE_LIST = "select * from retail_user.actions where id NOT IN (select action_id as id from retail_user.role_actions where role_id=?)";
		// final String DELETE_USER_ROLE="DELETE from ";
		final String GET_USERS_BY_ROLE_ID = "select id, username, email_id, phone_no, org_id, timezone from retail_user.user where id IN ( select user_id from retail_user.user_role where role_id=? AND org_id=?)";
	}

	public interface UserQueries {
		final String SELECT_USER_BY_TOKEN = "SELECT COUNT(*) FROM user_authentication WHERE auth_token = ? ";
		final String SELECT_USER_ON_USERNAME = "SELECT * FROM user usr inner join country_user cu on usr.id =cu.user_id inner join country c on cu.country_id = c.id where username=? or phone_no = ?";
		
		final String SELECT_ONLY_USER = "SELECT id, username, password, email_id, phone_no FROM user where username = ? or phone_no = ? ";  

		final String MAP_USER_TO_ROLE = "INSERT INTO user_role (user_id, role_id, org_id) VALUES (?, ?, ?)";
		final String MAP_USER_TO_COUNTRY = "INSERT INTO retail_user.country_user (user_id, country_id, is_default) VALUES (?, ?, ?)";
		final String REMOVE_USER_ROLE_MAP = "DELETE FROM user_role WHERE user_id = ?";
		final String REMOVE_USER_COUNTRY_MAP = "DELETE FROM country_user WHERE user_id = ? ";
		final String ADD_NEW_COUNTRY = "INSERT INTO country(code, name, currency, phone_code, url, org_id) VALUES(?, ?, ?, ?, ?, ?)";
		final String UPDATE_COUNTRY = "UPDATE country SET code=?, name= ?,currency = ?, phone_code= ? where id = ?";
		final String INSERT_USER_PROFILE = "INSERT INTO user_profile (user_id, first_name, last_name, age, phone_number, dob, gender, "
				+ "avatar_url, work_start_date, work_end_date, email_id, country, registration_date, "
				+ "created_by, created_date, updated_by, updated_date, employment_type) VALUES "
				+ "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
		final String GET_COUNTRY_BY_CODE = "SELECT * FROM country WHERE code= ? and org_id= ? ";

		final String Update_USER_PROFILE = "UPDATE user_profile SET user_id = ?, first_name = ?, last_name = ?, age = ?, phone_number = ?, dob = ?, gender = ?, "
				+ "avatar_url = ?, work_start_date = ?, work_end_date = ?, salary = ?, email_id = ?, country = ?, is_active = ?, is_deleted = ?, registration_date = ?, "
				+ "created_by = ?, created_date = ?, updated_by = ?, updated_date = ?";

		final String Update_USER_PROFILE_PROFILE_IMAGE = "UPDATE user_profile SET avatar_url = ? WHERE id = ?";

		final String GET_USER_ACTIONS = "SELECT * FROM actions ma inner join role_actions mra on mra.action_id = ma.id where ma.enabled = true and mra.role_id in (<roleIds>)";
		final String USER_PROFILE_FETCH = "select usr.id, usr.timezone, usr.username, usr.email_id, usr.phone_no, "
				+ "prof.first_name, prof.last_name, prof.age, prof.dob, prof.gender, prof.avatar_url,  "
				+ "prof.work_start_date, prof.work_end_date, prof.salary, prof.email_id, c.name as country, usr.is_active, usr.is_deleted, prof.registration_date, "
				+ "prof.created_date, prof.created_by, prof.updated_date, prof.updated_by, prof.employment_type, usrrole.role_id, role.role_name, role.description "
				+ "from user usr LEFT JOIN country_user cu ON usr.id=cu.user_id LEFT JOIN country c ON cu.country_id = c.id LEFT JOIN user_profile prof ON usr.id = prof.user_id "
				+ "LEFT JOIN user_role usrrole ON usr.id = usrrole.user_id "
				+ "LEFT JOIN role role ON role.id = usrrole.role_id";
		final String GET_USER_BY_ID = USER_PROFILE_FETCH + " WHERE usr.id = ?";
		final String GET_USER_AUTH_DETAILS = "SELECT id, user_id, auth_token FROM user_authentication WHERE id=?";
		final String SAVE_USER = "INSERT INTO user(username,password,email_id, phone_no, is_active, is_deleted, org_id , timezone, avatar_url) VALUES (?,?,?,?,?,?, ?,?,?)";
		final String SAVE_USER_AUTHENTICATION = "INSERT INTO user_authentication(user_id,auth_token) VALUES (?,?)";
		final String GET_USER_ROLE = "SELECT user_id, role_id FROM user_role WHERE user_id=?";
		final String GET_ROLES_FOR_USER = " select ur.user_id, ur.role_id, r.role_name, r.description , r.is_super_admin as is_super_admin , \r\n"
				+ "r.org_id as org_id from user_role ur LEFT JOIN role r ON ur.role_id = r.id \r\n"
				+ "WHERE ur.user_id = ? and r.org_id = ? ";
		final String GET_USER_BY_PHONE = "SELECT usr.id as id, username, password, email_id, phone_no, usr.org_id, c.code as code, usr.timezone  FROM user usr left join country_user cu on usr.id = cu.user_id left join country c on c.id = cu.country_id WHERE phone_no=?";
		final String USER_ACTIVE_CONDITION = " WHERE usr.is_active = ? ";
		final String WHERE_CLAUSE = " WHERE ";
		final String AND_CONDITION = " AND ";
		final String OR_CONDITION = " OR ";

		final String USER_PROFILE_FETCH_PAGINATION_1 = "select usr.id, usr.username, usr.email_id, usr.phone_no, prof.first_name, prof.last_name, prof.age, prof.dob, prof.gender, prof.avatar_url,  prof.work_start_date, prof.work_end_date, prof.salary, prof.email_id, prof.country, usr.is_active, usr.is_deleted, prof.registration_date, prof.created_date, prof.created_by, prof.updated_date, prof.updated_by, prof.employment_type, usrrole.role_id, role.role_name, role.description, role.privilege "
				+ " from (select id, username, email_id, phone_no, is_active, is_deleted from user ";
		final String USER_ACTIVE_CONDITION_PAGINATION = " WHERE is_active = ? ";
		final String USER_PROFILE_FETCH_PAGINATION_2 = " order by id limit ?,?) usr LEFT JOIN user_profile prof ON usr.id = prof.user_id "
				+ " LEFT JOIN user_role usrrole ON usr.id = usrrole.user_id "
				+ " LEFT JOIN role role ON role.id = usrrole.role_id ";
		final String TAIL_CONDITIONS_EMAIL_LIKE = " usr.email_id LIKE ?";
		final String TAIL_CONDITIONS_FIRSTNAME_LIKE = " prof.first_name LIKE ?";
		final String TAIL_CONDITIONS_LASTNAME_LIKE = " prof.last_name LIKE ?";
		final String TAIL_CONDITIONS_COUNTRY_LIKE = " prof.country LIKE ?";
		final String TAIL_CONDITIONS_USER_ACTIVE = " usr.is_active is TRUE ";
		final String TAIL_CONDITIONS_USER_INACTIVE = " usr.is_active is FALSE ";
		final String TAIL_CONDITIONS_USER_ROLEIN = " usrrole.role_id IN ";
		final String TAIL_CONDITIONS_COUNTRY_EQUALS = " prof.country = ? ";
		final String ORDER_BY_USER_ID = " ORDER BY usr.id ";
		final String USER_ID_EQUAL_CONDITION = " usr.id = ?";
		final String USER_ID_IN_CONDITION = " usr.id IN ";
		final String USER_ORG_ID = " usr.org_id = ? ";
		final String USER_ROLE_ORG_ID = "usrrole.org_id=?";
		final String UPDATE_USER = "UPDATE user SET email_id = ?, username = ?, phone_no = ?, is_active = ?, is_deleted = ? , timezone= ?, avatar_url where id = ? ";
		final String UPDATE_USER_PROFILE = "UPDATE user_profile SET first_name = ?, last_name = ?, age = ?, phone_number = ?, dob = ?, gender = ?, work_start_date = ?,  "
				+ "work_end_date = ?, country = ?, updated_date = ?, updated_by = ?, employment_type = ?, registration_date = ?, avatar_url=?  WHERE user_id = ? ";
		final String GET_USER_COUNT = "SELECT count(*) FROM user usr";
		final String GET_USER_COUNT_ON_ACTIVE_STATUS = "SELECT count(*) FROM user usr where usr.is_active = ? ";
		final String GET_USER_COUNT_FOR_ROLE = "SELECT count(*) FROM user usr LEFT JOIN user_role usrrole ON usr.id = usrrole.user_id where usrrole.role_id = ? "
				+ "and usr.is_active IS TRUE";
		final String GET_ROLE_COUNT = "SELECT count(*) FROM role";

		final String INVALIDATE_TOKEN = "DELETE from user_authentication WHERE auth_token = ? ";
		final String CHECK_USER_DEVICE_TOKEN = "SELECT COUNT(*) FROM user_device WHERE user_id = ? AND device_token = ? ";
		final String INSERT_USER_DEVICE_TOKEN = "INSERT INTO user_device (user_id, device_token, created_date, user_auth_id) VALUES (?,?,?,?) ";
		final String UPDATE_USER_DEVICE_TOKEN = "UPDATE user_device SET device_token = ?, created_date = ? WHERE user_id = ? ";
		final String FETCH_USER_DEVICE_TOKEN = " SELECT device.id, device.user_id, device.device_token FROM user_device device WHERE device.user_id IN ";
		final String USER_DEVICE_ROLE_CONDITION = " and exists (select 1 from user_role where user_id = device.user_id and role_id IN (1,2)) "
				+ "and not exists (select 1 from user_role where user_id = device.user_id and role_id NOT IN (1,2)) ";
		final String FETCH_AUTH_TOKEN_REF = "SELECT id FROM user_authentication WHERE auth_token = ? ";
		final String REMOVE_USER_DEVICE_TOKEN = "DELETE from user_device WHERE user_auth_id IN (SELECT id FROM user_authentication WHERE auth_token =?) ";
		final String DELETE_USER = "DELETE from user WHERE id=?";
		final String DELETE_USER_ROLE = "DELETE from user_role where user_id=?";
		final String DELETE_COUNTRY_USER = "DELETE from country_user where user_id=?";

		final String DELETE_USER_PROFILE = "DELETE from user_profile where user_id=?";
		final String GET_USERS_BY_MASTER_ROLE = "SELECT usr.id, usr.username FROM user usr INNER JOIN user_role ur ON usr.id = ur.user_id INNER JOIN role r ON ur.role_id = r.id WHERE r.code= ? AND ur.org_id = ?";
		final String MAP_USER_MASTER_ROLE_COUNTRY_ORG = "insert into retail_user.master_role_country_user_org(master_role_id,user_id,country_id,org_id) values(?,?,?,?)";
		final String GET_MASTER_ROLE_LIST_BY_ORG_DOMAIN = "select * from retail_user.master_role where id IN (select master_role_id from "
				+ "retail_user.master_role_org_domain where org_domain_id=?)";
		final String GET_USER_ROLE_ACTIONS = " SELECT usr.id as userId, usr.password as userPassword, usr.username as username, usr.email_id as userEmailId, usr.phone_no as userPhoneNo, " + 
				" usr.is_active as userIsActive, usr.is_deleted as userIsDeleted, usr.org_id as userOrgId, usr.avatar_url as userAvatarUrl, " + 
				" cu.country_id as userCountryId, " + 
				" r.id as roleId, r.role_name as roleName, r.code as roleCode, r.description as roleDescription, r.is_super_admin as isSuperAdmin, "+  
				" r.is_org_admin as isOrgAdmin, r.org_id as roleOrgId, " + 
				" act.id as actionId, act.name as actionName, act.url as actionUrl " + 
				" from user usr LEFT JOIN country_user cu ON usr.id = cu.user_id " + 
				" LEFT JOIN user_role ur ON ur.user_id = usr.id " + 
				" LEFT JOIN role r ON ur.role_id = r.id " + 
				" LEFT JOIN role_org ro ON ro.role_id = r.id " + 
				" LEFT JOIN role_actions ra ON r.id = ra.role_id " + 
				" LEFT JOIN actions act ON ra.action_id = act.id " + 
				" WHERE usr.username = ? "; 
	}

}
