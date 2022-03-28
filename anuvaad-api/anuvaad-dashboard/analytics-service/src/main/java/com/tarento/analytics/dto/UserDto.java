package com.tarento.analytics.dto;

import java.util.List;

public class UserDto {

	    private long id;

	    private String userName;
	    
	    private String emailId;

	    private List<RoleDto> roles;
	    
	    private String orgId;
	    
	    private String countryCode;

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

		public List<RoleDto> getRoles() {
			return roles;
		}

		public void setRoles(List<RoleDto> roles) {
			this.roles = roles;
		}

		public String getOrgId() {
			return orgId;
		}

		public void setOrgId(String orgId) {
			this.orgId = orgId;
		}

		public String getCountryCode() {
			return countryCode;
		}

		public void setCountryCode(String countryCode) {
			this.countryCode = countryCode;
		}



}
