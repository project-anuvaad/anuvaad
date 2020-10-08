package org.egov.contract;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class User {
    @JsonProperty("id")
    private Integer id;
    
    @JsonProperty("uuid")
    private String uuid;

    @JsonProperty("userName")
    private String userName;

    @JsonProperty("name")
    private String name;

    @JsonProperty("type")
    private String type;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("emailId")
    private String emailId;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("roles")
    private List<Role> roles;

    @JsonIgnore
    @JsonProperty("actions")
    private List<Action> actions;

	public User() {
    }

    @JsonIgnore
    public List<Action> getActions(){
        return this.actions;

    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public void setActions(List<Action> actions) {
        this.actions = actions;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
    
    public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

}