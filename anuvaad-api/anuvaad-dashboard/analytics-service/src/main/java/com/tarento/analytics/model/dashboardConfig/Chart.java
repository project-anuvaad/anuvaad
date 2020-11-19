package com.tarento.analytics.model.dashboardConfig;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Chart {

@JsonProperty("id")
private Long id;
@JsonProperty("name")
private String name;
@JsonProperty("code")
private String code;
@JsonProperty("serviceApi")
private String serviceApi;
@JsonProperty("chartType")
private String chartType;
@JsonProperty("headersAvailable")
private Boolean headersAvailable;
@JsonProperty("filter")
private String filter; 
@JsonProperty("headers")
private List<Header> headers = null;


public String getFilter() {
	return filter;
}

public void setFilter(String filter) {
	this.filter = filter;
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

@JsonProperty("code")
public String getCode() {
return code;
}

@JsonProperty("code")
public void setCode(String code) {
this.code = code;
}

@JsonProperty("serviceApi")
public String getServiceApi() {
return serviceApi;
}

@JsonProperty("serviceApi")
public void setServiceApi(String serviceApi) {
this.serviceApi = serviceApi;
}

@JsonProperty("chartType")
public String getChartType() {
return chartType;
}

@JsonProperty("chartType")
public void setChartType(String chartType) {
this.chartType = chartType;
}

@JsonProperty("headersAvailable")
public Boolean getHeadersAvailable() {
return headersAvailable;
}

@JsonProperty("headersAvailable")
public void setHeadersAvailable(Boolean headersAvailable) {
this.headersAvailable = headersAvailable;
}

@JsonProperty("headers")
public List<Header> getHeaders() {
return headers;
}

@JsonProperty("headers")
public void setHeaders(List<Header> headers) {
this.headers = headers;
}


}