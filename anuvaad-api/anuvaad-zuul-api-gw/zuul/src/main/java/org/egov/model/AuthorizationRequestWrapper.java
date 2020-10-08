package org.egov.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.RequestInfo;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AuthorizationRequestWrapper {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("AuthorizationRequest")
    private AuthorizationRequest authorizationRequest;

}
