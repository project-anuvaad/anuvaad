package com.tarento.retail.dao;

import java.util.List;

import com.tarento.retail.dto.CountryDto;
import com.tarento.retail.dto.DomainRoleDto;
import com.tarento.retail.dto.RoleActionDto;
import com.tarento.retail.dto.RoleActionListDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.ActionRole;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.util.Sql.RoleAction;

public interface RoleDao {

	/**
	 * Based on the ID passed, this method responds with a Role specific to the ID
	 * 
	 * @param id
	 * @return
	 */
	public Role findOne(Long id);

	/**
	 * This method hits the DB and fetches all the available active roles
	 * 
	 * @param fetchData
	 * @return
	 */
	public Boolean updateOrgRole(Long roleId, Long orgId);

	public List<Role> getAllRoles(Long orgCode);

	/**
	 * Based on the Role ID passed, this method responds with all the actions
	 * available for the specific role
	 * 
	 * @param roleId
	 * @return
	 */
	public List<Action> findAllActionsByRole(Long roleId);

	/**
	 * This method is used to find a single action based on the Action ID which has
	 * been passed as a parameter
	 * 
	 * @param id
	 * @return
	 */
	public Action findOneAction(Long id);

	/**
	 * This method is used to save the Role Details in the Database
	 * 
	 * @param role
	 * @return
	 */
	public Role saveRole(Role role);

	/**
	 * This method is used to update the Role Details based on the Role ID passed in
	 * the Role Object
	 * 
	 * @param role
	 * @return
	 */
	public Role updateRole(Role role);

	/**
	 * This method is used to save the Feature Details in the Database
	 * 
	 * @param feature
	 * @return
	 */
	public Action saveAction(Action action);

	/**
	 * This method supplies the ID to Database and fetches the Role for the ID and
	 * returns the Role Object
	 * 
	 * @param id
	 * @return
	 */
	public Role findById(Long id);

	public Role findById(Long userId, Long orgId);

	public Boolean deleteRole(Role role);

	public List<Action> getMappedActionRole(Long role);

	public List<Action> getUnmappedActionRole(Long role);

	public Boolean mapActionToRole(RoleActionDto roleAction);
	
	public Boolean mapAllActionsToRole(RoleActionListDto roleActionListDto);

	public Boolean unmapActionFromRole(RoleActionDto roleAction);

	public List<DomainRoleDto> getAllRolesByDomain(String orgDomain);

	public List<String> getDefaultRoles(Long roleId);

	public Boolean deleteOrgRole(Long roleId, Long orgId);
	
	public List<User> getUsersByRoleId(Role role);

}
