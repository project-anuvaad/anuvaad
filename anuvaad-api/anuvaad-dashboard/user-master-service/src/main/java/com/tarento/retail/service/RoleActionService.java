package com.tarento.retail.service;

import java.util.List;

import com.tarento.retail.dto.CountryDto;
import com.tarento.retail.dto.CreateOrgResponse;
import com.tarento.retail.dto.DomainRoleDto;
import com.tarento.retail.dto.RoleActionDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;

/**
 * This interface handles the service layer of business operation logic
 * implementation for all the Role and its Action related transactions
 * 
 * @author Darshan Nagesh
 *
 */
public interface RoleActionService {

	/**
	 * This method receives the request with details related to a new role and
	 * passes on to the DAO layer to save in DB
	 * 
	 * @param role
	 * @return
	 */
	Role saveRole(Role role);

	/**
	 * This method receives the request with details related to a new role and
	 * passes on to the DAO layer to update the role information in DB
	 * 
	 * @param role
	 * @return
	 */
	Role updateRole(Role role);

	/**
	 * This method fetches all the Roles available in the system
	 * 
	 * @param fetchData
	 * @return
	 */
	List<Role> getAllRoles(Long orgCode);

	List<DomainRoleDto> getAllRolesByDomain(String orgDomain);
	/**
	 * As a part of Role Action Mapping, this API method will add a new feature and
	 * its URL Details to the existing list of API URLS This can be later used to
	 * map to a role to achieve RBAC
	 * 
	 * @param feature
	 * @return
	 */
	Action saveAction(Action action);

	/**
	 * This method receives the ID from Controller to pass on the same to DAO to
	 * fetch the Role Object from Database This returns the Role Object for the
	 * respective Role ID
	 * 
	 * @param id
	 * @return
	 */
	Role findById(Long id);

	boolean checkRoleAccess(Long userId, Long orgId);

	Boolean deleteRole(Role role);

	List<Action> getMappedActionToRole(Long role);

	List<Action> getUnmappedActionToRole(Long role);

	Boolean mapActionToRole(RoleActionDto roleActionDto);

	Boolean unmapActionFromRole(RoleActionDto roleActionDto);
	
	List<User> getUsersByRoleId(Role role);
	
	Boolean addRolesFromOrgDomain(CreateOrgResponse res);

}
