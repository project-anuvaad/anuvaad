package com.tarento.retail.model.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.RowMapper;

import com.tarento.retail.dto.DomainRoleDto;
import com.tarento.retail.dto.MasterRoleDto;
import com.tarento.retail.dto.UserDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.ActionRole;
import com.tarento.retail.model.Country;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.model.UserAuthentication;
import com.tarento.retail.model.UserDeviceToken;
import com.tarento.retail.model.UserProfile;

public class SqlDataMapper {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(SqlDataMapper.class);

	public class UserMapper implements RowMapper<User> {
		public User mapRow(ResultSet rs, int rowNum) throws SQLException {
			User user = new User();
			user.setId(rs.getLong("id"));
			user.setPassword(rs.getString("password"));
			user.setUsername(rs.getString("username"));
			user.setEmailId(rs.getString("email_id"));
			user.setPhoneNo(rs.getString("phone_no"));
			user.setOrgId(rs.getString("org_id"));
			user.setCountryCode(rs.getString("code"));
			user.setTimeZone(rs.getString("timezone"));
			user.setAvatarUrl(rs.getString("avatar_url"));
			return user;
		}
	}

	public class UserDetailsMapper implements RowMapper<User> {
		public User mapRow(ResultSet rs, int rowNum) throws SQLException {
			User user = new User();
			user.setId(rs.getLong("id"));
			user.setUsername(rs.getString("username"));
			user.setEmailId(rs.getString("email_id"));
			user.setPhoneNo(rs.getString("phone_no"));
			user.setOrgId(rs.getString("org_id"));
			user.setTimeZone(rs.getString("timezone"));
			return user;
		}
	}
	
	public class SimpleUserMapper implements RowMapper<User> {
		public User mapRow(ResultSet rs, int rowNum) throws SQLException {
			User user = new User();
			user.setId(rs.getLong("id"));
			user.setPassword(rs.getString("password"));
			user.setUsername(rs.getString("username"));
			user.setEmailId(rs.getString("email_id"));
			user.setPhoneNo(rs.getString("phone_no"));
			return user;
		}
	}

	public class UserDetailMapper implements RowMapper<User> {
		public User mapRow(ResultSet rs, int rowNum) throws SQLException {
			User user = new User();
			user.setId(rs.getLong("id"));
			user.setPassword(rs.getString("password"));
			user.setUsername(rs.getString("username"));
			user.setEmailId(rs.getString("email_id"));
			user.setPhoneNo(rs.getString("phone_no"));
			user.setOrgId(rs.getString("org_id"));
			user.setCountryCode(rs.getString("code"));
			return user;
		}
	}

	public class OrgDomainRoleMapper implements RowMapper<String> {
		public String mapRow(ResultSet rs, int rowNum) throws SQLException {

			return rs.getString("org_domain");
		}
	}

	public class UserDeviceMapper implements RowMapper<UserDeviceToken> {
		public UserDeviceToken mapRow(ResultSet rs, int rowNum) throws SQLException {
			UserDeviceToken token = new UserDeviceToken();
			token.setDeviceToken(rs.getString("device_token"));
			token.setUserId(rs.getLong("user_id"));
			return token;
		}
	}

	public class CountryMapper implements RowMapper<Country> {
		public Country mapRow(ResultSet rs, int rowNum) throws SQLException {
			Country country = new Country();
			country.setId(rs.getLong("id"));
			country.setCode(rs.getString("code"));
			country.setName(rs.getString("name"));
			country.setKey(rs.getString("code"));
			country.setCurrency(rs.getString("currency"));
			country.setDailingCode(rs.getString("phone_code"));
			country.setDisplayName(rs.getString("name"));
			country.setLogoUrl(rs.getString("url"));
			return country;
		}
	}

	public class UserProfileMapper implements RowMapper<UserProfile> {
		public Map<Long, UserProfile> userMap = new HashMap<>();
		public Map<Long, List<Role>> userRoleMap = new HashMap<>();

		public UserProfile mapRow(ResultSet rs, int rowNum) throws SQLException {
			if (!userMap.containsKey(rs.getLong("id"))) {
				UserProfile user = new UserProfile();
				user.setId(rs.getLong("id"));
				user.setUsername(rs.getString("username"));
				user.setEmailId(rs.getString("email_id"));
				user.setPhoneNo(rs.getString("phone_no"));
				user.setFirstName(rs.getString("first_name"));
				user.setLastName(rs.getString("last_name"));
				user.setAge(rs.getInt("age"));
				user.setDob(rs.getString("dob"));
				user.setGender(rs.getString("gender"));
				user.setAvatarUrl(rs.getString("avatar_url"));
				user.setStartDate(rs.getDate("work_start_date"));
				user.setEndDate(rs.getDate("work_end_date"));
				user.setCountry(rs.getString("country"));
				user.setIsActive(rs.getBoolean("is_active"));
				user.setIsDeleted(rs.getBoolean("is_deleted"));
				user.setRegistrationDate(rs.getDate("registration_date"));
				user.setCreatedDate(rs.getDate("created_date"));
				user.setCreatedBy(rs.getLong("created_by"));
				user.setUpdatedDate(rs.getDate("updated_date"));
				user.setUpdatedBy(rs.getLong("updated_by"));
				user.setEmploymentType(rs.getString("employment_type"));
				user.setTimeZone(rs.getString("timezone"));
				userMap.put(rs.getLong("id"), user);
			}

			if (userRoleMap.containsKey(rs.getLong("id"))) {
				List<Role> roleList = userRoleMap.get(rs.getLong("id"));
				Role role = new Role();
				role.setId(rs.getLong("role_id"));
				role.setName(rs.getString("role_name"));
				role.setDescription(rs.getString("description"));
				if (StringUtils.isNotBlank(rs.getString("role_name"))) {
					roleList.add(role);
				}
			} else {
				List<Role> roleList = new ArrayList<>();
				Role role = new Role();
				role.setId(rs.getLong("role_id"));
				role.setName(rs.getString("role_name"));
				role.setDescription(rs.getString("description"));

				if (StringUtils.isNotBlank(rs.getString("role_name"))) {
					roleList.add(role);
				}
				userRoleMap.put(rs.getLong("id"), roleList);
			}

			return null;
		}
	}
	
	public class UserRoleActionMapper implements RowMapper<UserProfile> {
		public Map<Long, UserDto> userMap = new HashMap<>();
		public Map<Long, Map<Long, Role>> userRoleMap = new HashMap<>();
		public Map<Long, Map<Long, Action>> roleActionMap = new HashMap<>();

		public UserProfile mapRow(ResultSet rs, int rowNum) throws SQLException {
			if(!userMap.containsKey(rs.getLong("userId"))) { 
				userMap.put(rs.getLong("userId"), createUser(rs)); 
				
				Map<Long, Role> roleMap = new HashMap<>();
				roleMap.put(rs.getLong("roleId"), createRole(rs)); 
				userRoleMap.put(rs.getLong("userId"), roleMap); 
				
				Map<Long, Action> actionMap = new HashMap<>();
				actionMap.put(rs.getLong("actionId"), createAction(rs));
				roleActionMap.put(rs.getLong("roleId"), actionMap); 
			} else { 
				Map<Long, Role> roleMap = userRoleMap.get(rs.getLong("userId"));
				if(!roleMap.containsKey(rs.getLong("roleId"))) { 
					roleMap.put(rs.getLong("roleId"), createRole(rs));
					
					Map<Long, Action> actionMap = new HashMap<>();
					actionMap.put(rs.getLong("actionId"), createAction(rs));
					roleActionMap.put(rs.getLong("roleId"), actionMap); 
				} else { 
					Map<Long, Action> actionMap = roleActionMap.get(rs.getLong("roleId"));
					actionMap.put(rs.getLong("actionId"), createAction(rs));
				}
			}
			return null; 
		}
		
		private Action createAction(ResultSet rs) { 
			Action action = new Action(); 
			try { 
				action.setId(rs.getLong("actionId"));
				action.setName(rs.getString("actionName"));
				action.setUrl(rs.getString("actionUrl"));
			} catch (Exception e) { 
				LOGGER.info("Encountered an Exception while creating Action : " + e.getMessage()); 
			}
			return action; 
		}
		
		private UserDto createUser(ResultSet rs) { 
			UserDto userDto = new UserDto(); 
			try { 
				userDto.setId(rs.getLong("userId"));
				userDto.setUserName(rs.getString("username"));
				userDto.setEmailId(rs.getString("userEmailId"));
				userDto.setOrgId(String.valueOf(rs.getLong("userOrgId")));
			} catch (Exception e) { 
				LOGGER.info("Encountered an Exception while creating User : " + e.getMessage()); 
			}
			return userDto; 
		}
		
		private Role createRole(ResultSet rs) { 
			Role role = new Role(); 
			try { 
				role.setId(rs.getLong("roleId"));
				role.setName(rs.getString("roleName"));
				role.setCode(rs.getString("roleCode"));
				role.setDescription(rs.getString("description"));
				role.setAdmin(rs.getBoolean("isOrgAdmin"));
				role.setSuperAdmin(rs.getBoolean("isSuperAdmin"));
				role.setOrgId(rs.getLong("roleOrgId"));
			} catch (Exception e) { 
				LOGGER.info("Encountered an Exception while creating Role : " + e.getMessage()); 
			}
			return role; 
		}
	}

	public class UserAuthenticationMapper implements RowMapper<UserAuthentication> {
		public UserAuthentication mapRow(ResultSet rs, int rowNum) throws SQLException {
			UserAuthentication userAuthentication = new UserAuthentication();
			userAuthentication.setId(rs.getLong("id"));
			userAuthentication.setUserId(rs.getLong("user_id"));
			userAuthentication.setAuthToken(rs.getString("auth_token"));
			return userAuthentication;
		}
	}

	public class UserRoleMapper implements RowMapper<Role> {
		public Map<Long, Role> roleMap = new HashMap<>();

		public Role mapRow(ResultSet rs, int rowNum) throws SQLException {
			if (!roleMap.containsKey(rs.getLong("role_id"))) {
				Role role = new Role();
				role.setId(rs.getLong("role_id"));
				role.setName(rs.getString("role_name"));
				role.setDescription(rs.getString("description"));
				role.setOrgId(rs.getLong("org_id"));
				role.setSuperAdmin(rs.getBoolean("is_super_admin"));
				roleMap.put(rs.getLong("role_id"), role);
			}
			return null;
		}
	}

	public class UserMasterRoleMapper implements RowMapper<UserDto> {
		@Override
		public UserDto mapRow(ResultSet rs, int rowNum) throws SQLException {
			UserDto user = new UserDto();

			user.setUserName(rs.getString("username"));
			user.setId(rs.getLong("id"));
			return user;
		}
	}

	public class MasterRoleMapper implements RowMapper<MasterRoleDto> {
		@Override
		public MasterRoleDto mapRow(ResultSet rs, int rowNum) throws SQLException {
			MasterRoleDto masterRoleDto = new MasterRoleDto();
			masterRoleDto.setId(rs.getLong("id"));
			masterRoleDto.setName(rs.getString("name"));
			masterRoleDto.setCode(rs.getString("code"));
			return masterRoleDto;
		}
	}

	public class ActionMapper implements RowMapper<Action> {
		public Action mapRow(ResultSet rs, int rowNum) throws SQLException {
			Action action = new Action();
			action.setId(rs.getLong("id"));
			action.setDisplayName(rs.getString("display_name"));
			action.setName(rs.getString("name"));
			action.setServiceCode(rs.getString("service_code"));
			action.setUrl(rs.getString("url"));
			return action;
		}
	}

	public class RoleMapper implements RowMapper<Role> {
		public Role mapRow(ResultSet rs, int rowNum) throws SQLException {
			Role role = new Role();
			role.setId(rs.getLong("id"));
			role.setCode(rs.getString("code"));
			role.setDescription(rs.getString("description"));
			role.setName(rs.getString("role_name"));
			role.setOrgId(rs.getLong("org_id"));
			return role;
		}
	}

	public class RoleOrgDomainMapper implements RowMapper<Role> {
		public Role mapRow(ResultSet rs, int rowNum) throws SQLException {
			Role role = new Role();
			role.setId(rs.getLong("id"));
			role.setDescription(rs.getString("description"));
			role.setName(rs.getString("role_name"));
			role.setCode(rs.getString("code"));
			return role;
		}
	}

	public class DomainRoleMapper implements RowMapper<DomainRoleDto> {
		public DomainRoleDto mapRow(ResultSet rs, int rowNum) throws SQLException {
			DomainRoleDto role = new DomainRoleDto();
			role.setOrgDomain(rs.getString("org_domain"));
			role.setRoleName(rs.getString("role_name"));
			role.setRoleCode(rs.getString("role_code"));
			role.setRoleDescription(rs.getString("role_description"));
			role.setOrgAdmin(rs.getBoolean("is_org_admin"));
			role.setActionsIds(rs.getString("action_ids"));
			return role;
		}
	}
	/*
	 * public class ActionMapper implements RowMapper<Action> { public Action
	 * mapRow(ResultSet rs, int rowNum) throws SQLException { Action action = new
	 * Action(); action.setId(rs.getLong("id"));
	 * action.setDescription(rs.getString("description"));
	 * action.setModuleCode(rs.getString("module_code"));
	 * action.setModuleName(rs.getString("module_name"));
	 * action.setUrl(rs.getString("url")); return action; } }
	 */

	public class ActionRoleMapper implements RowMapper<ActionRole> {
		public ActionRole mapRow(ResultSet rs, int rowNum) throws SQLException {
			ActionRole actionRole = new ActionRole();
			actionRole.setActionId(rs.getLong("action_id"));
			actionRole.setRoleId(rs.getLong("role_id"));
			return actionRole;
		}
	}

}
