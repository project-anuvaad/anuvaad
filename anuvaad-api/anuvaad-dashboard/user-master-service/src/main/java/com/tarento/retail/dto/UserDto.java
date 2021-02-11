package com.tarento.retail.dto;

import java.util.List;
import java.util.Set;

import com.tarento.retail.model.Action;
import com.tarento.retail.model.Role;

/**
 * Data Transfer Object which carries the User Information to the Data Access Layers
 * @author Darshan Nagesh
 *
 */
public class UserDto {


	private long id;

    private String userName;
    
    private String emailId;

    public List<Role> roles;

    public Set<Action> actions;
    
    public String orgId ;
    
    public String timeZone;

    public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}

	
    public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
   
    public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public Set<Action> getActions() {
        return actions;
    }

    public void setActions(Set<Action> actions) {
        this.actions = actions;
    }
}
