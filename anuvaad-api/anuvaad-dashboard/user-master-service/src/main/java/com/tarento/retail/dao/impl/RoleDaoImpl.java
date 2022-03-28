package com.tarento.retail.dao.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.mysql.jdbc.PreparedStatement;
import com.tarento.retail.dao.RoleDao;
import com.tarento.retail.dto.DomainRoleDto;
import com.tarento.retail.dto.RoleActionDto;
import com.tarento.retail.dto.RoleActionListDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.ActionRole;
import com.tarento.retail.model.Country;
import com.tarento.retail.model.OrgDomaiRole;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.model.mapper.SqlDataMapper;
import com.tarento.retail.util.Constants;
import com.tarento.retail.util.Sql;
import com.tarento.retail.util.Sql.Common;
import com.tarento.retail.util.Sql.RoleAction;
import com.tarento.retail.util.Sql.UserQueries;

@Repository(Constants.ROLE_DAO)
public class RoleDaoImpl implements RoleDao {

	public static final Logger LOGGER = LoggerFactory.getLogger(RoleDaoImpl.class);

	@Autowired
	JdbcTemplate jdbcTemplate;

	public Role findOne(Long id) {
		Role role = null;
		try {
			role = jdbcTemplate
					.query(RoleAction.SELECT_ROLES_ON_ID, new Object[] { id }, new SqlDataMapper().new RoleMapper())
					.get(0);
		} catch (Exception e) {
			System.out.print(e.getMessage());
		}
		return role;
	}

	@Override
	public List<Action> findAllActionsByRole(Long roleId) {
		List<ActionRole> actionRoles = new ArrayList<ActionRole>();
		try {
			actionRoles = jdbcTemplate.query(RoleAction.SELECT_ROLE_ACTIONS_ON_ROLEID, new Object[] { roleId },
					new SqlDataMapper().new ActionRoleMapper());
		} catch (Exception e) {
			System.out.print(e.getMessage());
		}

		List<Action> actions = new ArrayList<Action>();
		for (ActionRole actionRole : actionRoles) {
			actions.add(findOneAction(actionRole.getActionId()));
		}
		return actions;
	}

	public Action findOneAction(Long id) {
		Action action = null;
		try {
			action = jdbcTemplate
					.query(RoleAction.SELECT_ACTIONS_ON_ID, new Object[] { id }, new SqlDataMapper().new ActionMapper())
					.get(0);
		} catch (Exception e) {
			System.out.print(e.getMessage());
		}
		return action;
	}

	@Override
	public Role saveRole(Role role) {
		try {
			KeyHolder keyHolder = new GeneratedKeyHolder();
			jdbcTemplate.update(new PreparedStatementCreator() {
				public java.sql.PreparedStatement createPreparedStatement(Connection con) throws SQLException {
					String[] returnValColumn = new String[] { "id" };
					java.sql.PreparedStatement statement = con.prepareStatement(Sql.RoleAction.SAVE_NEW_ROLE,
							returnValColumn);
					statement.setString(1, role.getName());
					statement.setString(2, role.getCode());
					statement.setString(3, role.getDescription());
					statement.setBoolean(4, role.isAdmin());
					statement.setLong(5, role.getOrgId());
					return statement;
				}
			}, keyHolder);
			Long id = keyHolder.getKey().longValue();
			role.setId(id);
		} catch (Exception ex) {
			LOGGER.error("Encountered an exception while saving the Role Details : " + ex);
		}

		return role;
	}

	@Override
	public Role updateRole(Role role) {
		int updateRole = 0;
		try {
			updateRole = jdbcTemplate.update(RoleAction.UPDATE_ROLE,
					new Object[] { role.getName(), role.getDescription(), role.getId() });
		} catch (Exception ex) {
			LOGGER.error("Encountered an exception while saving the Role Details : " + ex);
		}
		if (updateRole > 0) {
			return role;
		}
		return null;
	}

	// Method needs rework as the logic has changed
	@Override
	public Action saveAction(Action action) {
		/*
		 * int saveAction = 0; try{ saveAction =
		 * jdbcTemplate.update(RoleAction.INSERT_ACTION, new
		 * Object[]{action.getDescription(), action.getModuleCode(),
		 * action.getModuleName(), action.getUrl()}); } catch (Exception ex){
		 * LOGGER.error("Encountered an exception while saving the Feature Details : " +
		 * ex); } if(saveAction > 0) { return action; }
		 */
		return null;
	}

	@Override
	public List<Role> getAllRoles(Long orgCode) {
		List<Role> roleList = null;
		try {
			roleList = jdbcTemplate.query(RoleAction.GET_ALL_ROLES, new Object[] { orgCode },
					new SqlDataMapper().new RoleMapper());
		} catch (Exception e) {
			LOGGER.error("Encountered an exception while fetching all roles" + e);
		}
		return roleList;
	}

	@Override
	public List<DomainRoleDto> getAllRolesByDomain(String orgDomain) {
		List<DomainRoleDto> roleList = null;
		try {
			roleList = jdbcTemplate.query(RoleAction.GET_ROLE_BY_ORG_DOMAIN, new Object[] { orgDomain },
					new SqlDataMapper().new DomainRoleMapper());
		} catch (Exception e) {
			LOGGER.error("Encountered an exception while fetching all roles" + e);
		}
		return roleList;
	}

	@Override
	public Role findById(Long id) {
		List<Role> roleList = null;
		try {
			roleList = jdbcTemplate.query(RoleAction.SELECT_ROLES_ON_ID, new Object[] { id },
					new SqlDataMapper().new RoleOrgDomainMapper());
		} catch (Exception e) {
			LOGGER.error("Encountered an exception while fetching all roles" + e);
		}
		if (roleList != null && !roleList.isEmpty()) {
			return roleList.get(0);
		}
		return null;
	}

	@Override
	public Role findById(Long userId, Long orgId) {
		List<Role> roleList = null;
		try {
			roleList = jdbcTemplate.query(RoleAction.GET_ROLE_BY_USER, new Object[] { userId, orgId },
					new SqlDataMapper().new RoleMapper());
		} catch (Exception e) {
			LOGGER.error("Encountered an exception while fetching all roles" + e);
		}
		if (roleList != null && !roleList.isEmpty()) {
			return roleList.get(0);
		}
		return null;
	}

	@Override
	public Boolean deleteRole(Role role) {
		try {
			// jdbcTemplate.update(RoleAction.DELETE_ROLE, new Object[] { role.getId() });
			jdbcTemplate.update(RoleAction.DELETE_ROLE, new Object[] { role.getId() });
		} catch (Exception ex) {
			LOGGER.error("Encounter an exception while deleting the role: " + ex);
			return Boolean.FALSE;
		}
		return Boolean.FALSE;
	}

	@Override
	public List<Action> getMappedActionRole(Long role_id) {
		List<Action> action = null;
		try {
			action = jdbcTemplate.query(RoleAction.GET_MAPPED_ACTION_ROLE_LIST, new Object[] { role_id },
					new SqlDataMapper().new ActionMapper());
		} catch (Exception e) {
			LOGGER.error("Encounter an exception while getting the map action list");
		}
		return action;
	}

	@Override
	public List<Action> getUnmappedActionRole(Long role_id) {
		List<Action> action = null;
		try {
			action = jdbcTemplate.query(RoleAction.GET_UNMAPPED_ACTION_ROLE_LIST, new Object[] { role_id },
					new SqlDataMapper().new ActionMapper());
		} catch (Exception e) {
			LOGGER.error("Encounter an exception while getting the unmap action list");
		}
		return action;
	}

	@Override
	public Boolean mapActionToRole(RoleActionDto roleAction) {
		int updateRole = 0;
		try {
			updateRole = jdbcTemplate.update(RoleAction.MAP_ACTION_TO_ROLE,
					new Object[] { roleAction.getRoleId(), roleAction.getActionId() });
		} catch (Exception e) {
			LOGGER.error("Encounter an exception while doing the map action to role");
		}
		if (updateRole > 0) {
			return Boolean.TRUE;
		}
		return Boolean.FALSE;
	}

	@Override
	public Boolean mapAllActionsToRole(RoleActionListDto roleActionListDto) {
		int[] values = null;
		try {
			values = jdbcTemplate.batchUpdate(RoleAction.MAP_ACTION_TO_ROLE, new BatchPreparedStatementSetter() {
				@Override
				public void setValues(java.sql.PreparedStatement statement, int i) throws SQLException {
					statement.setLong(1, roleActionListDto.getRole_id());
					statement.setLong(2, roleActionListDto.getActionIds().get(i));
				}

				public int getBatchSize() {
					return roleActionListDto.getActionIds().size();
				}
			});
		} catch (Exception ex) {
			LOGGER.error("Exception Occured while mapping Role to Action : " + ex);
		}
		if (values.length > 0) {
			return true;
		}

		return Boolean.FALSE;
	}

	@Override
	public Boolean unmapActionFromRole(RoleActionDto roleAction) {
		int updateRole = 0;
		try {
			updateRole = jdbcTemplate.update(RoleAction.UNMAP_ACTION_TO_ROLE,
					new Object[] { roleAction.getActionId(), roleAction.getRoleId() });
		} catch (Exception e) {
			LOGGER.error("encounter an exception while doing the unmap action from role");
		}
		if (updateRole > 0) {
			return Boolean.TRUE;
		}
		return Boolean.FALSE;
	}

	@Override
	public Boolean updateOrgRole(Long roleId, Long orgId) {
		int updateRole = 0;
		try {
			updateRole = jdbcTemplate.update(RoleAction.UPDATE_ROLE_ORG, new Object[] { roleId, orgId });
		} catch (Exception e) {
			LOGGER.error("Encounter an exception while doing the map action to role");
		}
		if (updateRole > 0) {
			return Boolean.TRUE;
		}
		return Boolean.FALSE;
	}

	@Override
	public List<String> getDefaultRoles(Long roleId) {
		List<String> ids = null;
		try {
			ids = jdbcTemplate.query(RoleAction.GET_DEFAULT_ROLES, new Object[] { roleId },
					new SqlDataMapper().new OrgDomainRoleMapper());
		} catch (Exception e) {
			LOGGER.error("Encounter an exception while getting the unmap action list");
		}
		return ids;
	}

	@Override
	public Boolean deleteOrgRole(Long roleId, Long orgId) {
		int updateRole = 0;
		try {
			updateRole = jdbcTemplate.update(RoleAction.UNMAP_ORG_ROLE, new Object[] { roleId, orgId });
		} catch (Exception e) {
			LOGGER.error("Encounter an exception while doing the map action to role");
		}
		if (updateRole > 0) {
			return Boolean.TRUE;
		}
		return Boolean.FALSE;
	}

	@Override
	public List<User> getUsersByRoleId(Role role) {
		ArrayList<User> users = null;
		try {
			users = (ArrayList<User>) jdbcTemplate.query(RoleAction.GET_USERS_BY_ROLE_ID,
					new Object[] { role.getId(), role.getOrgId() }, new SqlDataMapper().new UserDetailsMapper());
		} catch (Exception e) {
			LOGGER.error("Encounter an exception while getting the user list by role id" + e);
		}
		return users;
	}
}
