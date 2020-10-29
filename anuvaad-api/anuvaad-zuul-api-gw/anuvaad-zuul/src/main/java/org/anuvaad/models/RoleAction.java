package org.anuvaad.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RoleAction {

    @JsonProperty("role")
    public String role;

    @JsonProperty("actionID")
    public String actionID;

    @JsonProperty("active")
    public Boolean active;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getActionID() {
        return actionID;
    }

    public void setActionID(String actionID) {
        this.actionID = actionID;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
