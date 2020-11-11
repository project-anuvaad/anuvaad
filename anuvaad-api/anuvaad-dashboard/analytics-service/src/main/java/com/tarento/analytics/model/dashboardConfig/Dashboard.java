package com.tarento.analytics.model.dashboardConfig;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tarento.analytics.dto.DashboardDto;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Dashboard {

@JsonProperty("id")
private Long id; 
@JsonProperty("name")
private String name;
@JsonProperty("code")
private String code;
@JsonProperty("isActive")
private Boolean isActive;
@JsonProperty("description")
private String description;
@JsonProperty("placement")
private String placement;
@JsonProperty("visualizations")
private List<Visualization> visualizations = null;

public Dashboard() {} 
public Dashboard(DashboardDto dto) { 
	this.id = dto.getId();
	this.name = dto.getName(); 
	this.code = dto.getCode(); 
	this.description = dto.getDescription();
	this.placement = dto.getPlacement();
}

public String getPlacement() {
	return placement;
}
public void setPlacement(String placement) {
	this.placement = placement;
}
public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

@JsonProperty("name")
public String getName() {
return name;
}

@JsonProperty("name")
public void setName(String name) {
this.name = name;
}

@JsonProperty("code")
public String getCode() {
return code;
}

@JsonProperty("code")
public void setCode(String code) {
this.code = code;
}

@JsonProperty("isActive")
public Boolean getIsActive() {
return isActive;
}

@JsonProperty("isActive")
public void setIsActive(Boolean isActive) {
this.isActive = isActive;
}

@JsonProperty("description")
public String getDescription() {
return description;
}

@JsonProperty("description")
public void setDescription(String description) {
this.description = description;
}

@JsonProperty("visualizations")
public List<Visualization> getVisualizations() {
return visualizations;
}

@JsonProperty("visualizations")
public void setVisualizations(List<Visualization> visualizations) {
this.visualizations = visualizations;
}

}