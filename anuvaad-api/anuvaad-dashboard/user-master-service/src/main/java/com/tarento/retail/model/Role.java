package com.tarento.retail.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Role {

	private Long id;

    private String description;
    
    private String code;

	private String name;
        
    private Long orgId;
        
    private boolean isSuperAdmin;
   
    @JsonProperty("isAdmin")
    private boolean isAdmin;
    
    private Long createdBy;
    
    public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	public boolean isAdmin() {
		return isAdmin;
	}

	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isSuperAdmin() {
		return isSuperAdmin;
	}

	public void setSuperAdmin(boolean isSuperAdmin) {
		this.isSuperAdmin = isSuperAdmin;
	}
}
