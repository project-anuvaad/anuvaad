package com.tarento.analytics.model.dashboardConfig;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Header {

@JsonProperty("id")
private Long id;
@JsonProperty("label")
private String label;
@JsonProperty("data")
private String data;
@JsonProperty("field")
private String field; 


public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

public String getField() {
	return field;
}

public void setField(String field) {
	this.field = field;
}

@JsonProperty("label")
public String getLabel() {
return label;
}

@JsonProperty("label")
public void setLabel(String label) {
this.label = label;
}

@JsonProperty("data")
public String getData() {
return data;
}

@JsonProperty("data")
public void setData(String data) {
this.data = data;
}

}