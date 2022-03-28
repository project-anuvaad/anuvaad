package com.tarento.analytics.model.dashboardConfig;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Visualization {

@JsonProperty("id")
private Long id;
@JsonProperty("name")
private String name;
@JsonProperty("description")
private String description;
@JsonProperty("chartType")
private String chartType; 
@JsonProperty("charts")
private List<Chart> charts = null;
private List<String> storeId;
@JsonProperty("salesAreaCode")
private String salesAreaCode;
@JsonProperty("countryCode")
private String countryCode;


public List<String> getStoreId() {
	return storeId;
}


@JsonProperty("visualRank")
private Long visualRank;


public void setStoreId(List<String> storeId) {
	this.storeId = storeId;
}

public String getSalesAreaCode() {
	return salesAreaCode;
}

public void setSalesAreaCode(String salesAreaCode) {
	this.salesAreaCode = salesAreaCode;
}

public String getCountryCode() {
	return countryCode;
}

public void setCountryCode(String countryCode) {
	this.countryCode = countryCode;
}

public Long getVisualRank() {
	return visualRank;
}

public void setVisualRank(Long visualRank) {
	this.visualRank = visualRank;
}

public String getChartType() {
	return chartType;
}

public void setChartType(String chartType) {
	this.chartType = chartType;
}

@JsonProperty("id")
public Long getId() {
return id;
}

@JsonProperty("id")
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

@JsonProperty("description")
public String getDescription() {
return description;
}

@JsonProperty("description")
public void setDescription(String description) {
this.description = description;
}

@JsonProperty("charts")
public List<Chart> getCharts() {
return charts;
}

@JsonProperty("charts")
public void setCharts(List<Chart> charts) {
this.charts = charts;
}


}