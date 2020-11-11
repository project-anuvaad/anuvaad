package org.tarento.retail.contract;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthToken {

	@JsonProperty("authToken")
    private String authToken;

    public AuthToken(){

    }

    public AuthToken(String token){
        this.authToken = token;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }
}
