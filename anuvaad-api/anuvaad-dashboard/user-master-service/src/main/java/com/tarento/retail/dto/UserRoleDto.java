package com.tarento.retail.dto;

import java.util.List;

import com.tarento.retail.model.Role;

/**
 * Data Transfer Object which carries the User ID and the Roles associated. 
 * @author Darshan Nagesh
 *
 */
public class UserRoleDto {
	
	private Long userId; 
	private List<Role> roles; 
	private Long orgId;
	
	public Long getOrgId() {
		return orgId;
	}
	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public List<Role> getRoles() {
		return roles;
	}
	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}
	
}
