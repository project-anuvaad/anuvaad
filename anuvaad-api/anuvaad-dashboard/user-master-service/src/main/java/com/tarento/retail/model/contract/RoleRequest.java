package com.tarento.retail.model.contract;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * RoleRequest
 */
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
public class RoleRequest {
  
  private Boolean enabled;

  
  private List<Integer> roles = new ArrayList<Integer>();


public Boolean getEnabled() {
	return enabled;
}


public void setEnabled(Boolean enabled) {
	this.enabled = enabled;
}


public List<Integer> getRoles() {
	return roles;
}


public void setRoles(List<Integer> roles) {
	this.roles = roles;
}

   
}

