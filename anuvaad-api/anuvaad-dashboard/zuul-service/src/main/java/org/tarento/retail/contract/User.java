package org.tarento.retail.contract;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("userName")
    private String userName;

    @JsonProperty("name")
    private String name;

    @JsonProperty("type")
    private String type;

    @JsonProperty("mobileNumber")
    private String mobileNumber;
    
    @JsonProperty("authToken")
    private String authToken;

    @JsonProperty("emailId")
    private String emailId;

    @JsonProperty("orgId")
    private String orgId;

    @JsonProperty("roles")
    private List<Role> roles;

    @JsonIgnore
    @JsonProperty("actions")
    private List<Action> actions;

    @JsonIgnore
    @JsonProperty("timeZone")
    private String timeZone;
    
    
    public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}

	public User() {
    }

    @JsonIgnore
    public List<Action> getActions(){
        return this.actions;

    }
    
    

    public String getAuthToken() {
		return authToken;
	}

	public void setAuthToken(String authToken) {
		this.authToken = authToken;
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

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

}