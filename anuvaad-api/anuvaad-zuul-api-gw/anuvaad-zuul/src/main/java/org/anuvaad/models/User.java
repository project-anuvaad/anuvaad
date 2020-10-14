package org.anuvaad.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class User {

    @JsonProperty("userID")
    public String userID;

    @JsonProperty("name")
    public String name;

    @JsonProperty("userName")
    public String userName;

    @JsonProperty("password")
    public String password;

    @JsonProperty("email")
    public String email;

    @JsonProperty("phoneNo")
    public String phoneNo;

    @JsonProperty("phoneNo")
    public List<Role> roles;


}
