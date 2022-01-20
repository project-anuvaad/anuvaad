package org.anuvaad.models;

import com.fasterxml.jackson.annotation.JsonProperty;



public class Role {

    @JsonProperty("code")
    public String code;

    @JsonProperty("description")
    public String description;

    @JsonProperty("active")
    public Boolean active;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
