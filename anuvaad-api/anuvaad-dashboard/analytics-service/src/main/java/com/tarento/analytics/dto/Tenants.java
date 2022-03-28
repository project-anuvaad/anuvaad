package com.tarento.analytics.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "tenantId", "moduleName", "tenants" })
public class Tenants {

	@JsonProperty("tenantId")
	private String tenantId;
	@JsonProperty("moduleName")
	private String moduleName;
	@JsonProperty("tenants")
	private List<Tenant> tenants = null;
	@JsonIgnore
	private Map<String, Object> additionalProperties = new HashMap<>();

	@JsonProperty("tenantId")
	public String getTenantId() {
		return tenantId;
	}

	@JsonProperty("tenantId")
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	@JsonProperty("moduleName")
	public String getModuleName() {
		return moduleName;
	}

	@JsonProperty("moduleName")
	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	@JsonProperty("tenants")
	public List<Tenant> getTenants() {
		return tenants;
	}

	@JsonProperty("tenants")
	public void setTenants(List<Tenant> tenants) {
		this.tenants = tenants;
	}

	@JsonAnyGetter
	public Map<String, Object> getAdditionalProperties() {
		return this.additionalProperties;
	}

	@JsonAnySetter
	public void setAdditionalProperty(String name, Object value) {
		this.additionalProperties.put(name, value);
	}

}