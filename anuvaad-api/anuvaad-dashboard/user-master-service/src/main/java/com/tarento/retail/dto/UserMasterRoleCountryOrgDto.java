package com.tarento.retail.dto;

public class UserMasterRoleCountryOrgDto {
	private Long masterRoleId;
	private Long userId;
	private Long countryId;
	private Long orgId;

	public Long getMasterRoleId() {
		return masterRoleId;
	}

	public void setMasterRoleId(Long masterRoleId) {
		this.masterRoleId = masterRoleId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getCountryId() {
		return countryId;
	}

	public void setCountryId(Long countryId) {
		this.countryId = countryId;
	}

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}
}
