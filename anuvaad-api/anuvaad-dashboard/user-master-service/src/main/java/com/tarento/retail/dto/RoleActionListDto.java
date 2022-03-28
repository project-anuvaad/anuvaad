package com.tarento.retail.dto;

import java.util.List;

public class RoleActionListDto {

	private Long role_id;
	private List<Long> actionIds;

	public Long getRole_id() {
		return role_id;
	}

	public void setRole_id(Long role_id) {
		this.role_id = role_id;
	}

	public List<Long> getActionIds() {
		return actionIds;
	}

	public void setActionIds(List<Long> actionIds) {
		this.actionIds = actionIds;
	}

}
