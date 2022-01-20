package org.anuvaad.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;


public class User {

    @JsonProperty("userID")
    public String userID;

    @JsonProperty("name")
    public String name;

    @JsonProperty("userName")
    public String userName;

    @JsonProperty("email")
    public String email;

    @JsonProperty("phoneNo")
    public String phoneNo;

    @JsonProperty("orgID")
    public String orgID;

    @JsonProperty("roles")
    public List<UserRole> roles;

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setOrgID(String orgID) {
        this.orgID = orgID;
    }

    public String getOrgID() {
        return orgID;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }




    public List<UserRole> getRoles() {
        return roles;
    }

    public void setRoles(List<UserRole> roles) {
        this.roles = roles;
    }
}

