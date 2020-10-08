package org.egov.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.contract.Role;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AuthorizationRequest {

    @NotNull
    @Size(min = 1)
    private Set<Role> roles;

    @NotNull
    private String uri;

    @NotNull
    private Set<String> tenantIds;

}
