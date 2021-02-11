package com.tarento.retail.dto;

public class DomainRoleDto {

	private String orgDomain;
	private String roleName;
	private String roleCode;
	private String roleDescription;
	private boolean isOrgAdmin;
	private String actionsIds;
	
	public String getOrgDomain() {
		return orgDomain;
	}
	public void setOrgDomain(String orgDomain) {
		this.orgDomain = orgDomain;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public String getRoleCode() {
		return roleCode;
	}
	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}
	public String getRoleDescription() {
		return roleDescription;
	}
	public void setRoleDescription(String roleDescription) {
		this.roleDescription = roleDescription;
	}
	public boolean isOrgAdmin() {
		return isOrgAdmin;
	}
	public void setOrgAdmin(boolean isOrgAdmin) {
		this.isOrgAdmin = isOrgAdmin;
	}
	public String getActionsIds() {
		return actionsIds;
	}
	public void setActionsIds(String actionsIds) {
		this.actionsIds = actionsIds;
	}
	
	
}
