package org.anuvaad.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Role {

    @JsonProperty("roleCode")
    public String roleCode;

    @JsonProperty("roleDesc")
    public String roleDesc;
}
