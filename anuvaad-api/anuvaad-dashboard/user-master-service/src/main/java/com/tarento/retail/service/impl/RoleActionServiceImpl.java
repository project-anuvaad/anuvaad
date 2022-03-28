package com.tarento.retail.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mysql.fabric.xmlrpc.base.Array;
import com.tarento.retail.dao.RoleDao;
import com.tarento.retail.dto.CreateOrgResponse;
import com.tarento.retail.dto.DomainRoleDto;
import com.tarento.retail.dto.RoleActionDto;
import com.tarento.retail.dto.RoleActionListDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.service.RoleActionService;
import com.tarento.retail.util.Constants;

@Service(value = Constants.ROLE_ACTION_SERVICE)
public class RoleActionServiceImpl implements RoleActionService {

	private static final String SUPER_ADMIN = "SUPER_ADMIN";
	private static final String ORG_ADMIN = "ORG_ADMIN";

	@Autowired
	private RoleDao roleDao;

	@Override
	public Role saveRole(Role role) {
		// Check if Role exist in Role table
		Role existingRole = roleDao.findById(role.getId());
		if (existingRole == null) {
			// Update role_org mapping only
			existingRole = roleDao.saveRole(role);

		}
		roleDao.updateOrgRole(existingRole.getId(), role.getOrgId());
		return existingRole;

	}

	@Override
	public Role updateRole(Role role) {

		return roleDao.updateRole(role);
	}

	@Override
	public Action saveAction(Action action) {
		return roleDao.saveAction(action);
	}

	@Override
	public List<Role> getAllRoles(Long orgCode) {
		return roleDao.getAllRoles(orgCode);
	}

	@Override
	public List<DomainRoleDto> getAllRolesByDomain(String orgDomain) {
		return roleDao.getAllRolesByDomain(orgDomain);
	}

	@Override
	public Role findById(Long id) {
		return roleDao.findById(id);
	}

	@Override
	public boolean checkRoleAccess(Long userId, Long orgId) {

		Role role = roleDao.findById(userId, orgId);
		if (SUPER_ADMIN.equals(role.getName()) || ORG_ADMIN.equals(role.getName())) {
			return true;
		}
		return false;
	}

	@Override
	public Boolean deleteRole(Role role) {
		List<String> orgDomain = roleDao.getDefaultRoles(role.getId());
		// Unmapp roles
		Boolean success = roleDao.deleteOrgRole(role.getId(), role.getOrgId());
		if (orgDomain == null || orgDomain.isEmpty()) {
			success = roleDao.deleteRole(role);
		}
		return success;
	}

	@Override
	public List<Action> getMappedActionToRole(Long role) {
		return roleDao.getMappedActionRole(role);
	}

	@Override
	public List<Action> getUnmappedActionToRole(Long role) {
		return roleDao.getUnmappedActionRole(role);
	}

	@Override
	public Boolean mapActionToRole(RoleActionDto roleActionDto) {
		return roleDao.mapActionToRole(roleActionDto);
	}

	@Override
	public Boolean unmapActionFromRole(RoleActionDto roleActionDto) {
		return roleDao.unmapActionFromRole(roleActionDto);
	}

	@Override
	public List<User> getUsersByRoleId(Role role) {
		return roleDao.getUsersByRoleId(role);
	}

	// ADD ROLES FROM ORG DOMAIN AND ASSIGN ACTIONS of DOMAIN_ROLE TO ROLES
	@Override
	public Boolean addRolesFromOrgDomain(CreateOrgResponse res) {
		boolean success = false;
		List<DomainRoleDto> domainRoleDtoList = null;

		// Get All Domain Roles
		domainRoleDtoList = roleDao.getAllRolesByDomain(res.getOrgDomain());

		// ADD NEW ROLE BY USING DOMAIN ROLE DETAILS
		if (domainRoleDtoList != null) {
			for (DomainRoleDto roleDto : domainRoleDtoList) {
				Role role = new Role();
				role.setName(roleDto.getRoleName());
				role.setDescription(roleDto.getRoleDescription());
				role.setCode(roleDto.getRoleCode());
				role.setAdmin(roleDto.isOrgAdmin());
				role.setOrgId(res.getId()); // orgId

				// ADD NEW ROLE and GET ID
				Role createdRole = new Role();
				createdRole = roleDao.saveRole(role);
				if (roleDto.getActionsIds() != null) {
					if (roleDto.getActionsIds().split(",").length != 0) {
						String[] arrOfActionIds = roleDto.getActionsIds().split(",");
						ArrayList<Long> idList = new ArrayList<Long>();
						for (String id : arrOfActionIds) {
							idList.add(Long.parseLong(id));
						}
						RoleActionListDto roleActionListDto = new RoleActionListDto();
						roleActionListDto.setActionIds(idList);
						roleActionListDto.setRole_id(createdRole.getId());
						// Map All the actions to role
						if (!roleActionListDto.getActionIds().isEmpty()) {
							success = roleDao.mapAllActionsToRole(roleActionListDto);
						}
					}
				}
			}
		}
		return success;
	}

}
