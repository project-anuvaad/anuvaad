package com.tarento.analytics.dto;

public class InsightsWidget {
	
	private String name; 
	private Object value; 
	private String indicator; 
	private String colorCode;
	
	public InsightsWidget() {}
	public InsightsWidget(String name, Object value, String indicator, String colorCode) { 
		this.name = name;
		this.value = value; 
		this.indicator = indicator; 
		this.colorCode = colorCode; 
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
	public String getIndicator() {
		return indicator;
	}
	public void setIndicator(String indicator) {
		this.indicator = indicator;
	}
	public String getColorCode() {
		return colorCode;
	}
	public void setColorCode(String colorCode) {
		this.colorCode = colorCode;
	} 
	
	

}
