package org.anuvaad.models;

import com.fasterxml.jackson.annotation.JsonProperty;


public class UserRole {

    @JsonProperty("roleCode")
    public String roleCode;

    @JsonProperty("roleDesc")
    public String roleDesc;

    public String getRoleDesc() {
        return roleDesc;
    }

    public void setRoleDesc(String roleDesc) {
        this.roleDesc = roleDesc;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }
}
