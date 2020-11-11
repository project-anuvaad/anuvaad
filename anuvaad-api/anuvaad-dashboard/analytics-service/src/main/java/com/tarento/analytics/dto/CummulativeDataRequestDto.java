package com.tarento.analytics.dto;

import java.util.Map;

public class CummulativeDataRequestDto {
	private Map<String, Object> customData;
	private RequestDate dates;
	private String dashCode;
	
	

	public String getDashCode() {
		return dashCode;
	}
	public void setDashCode(String dashCode) {
		this.dashCode = dashCode;
	}
	public Map<String, Object> getCustomData() {
		return customData;
	}
	public void setCustomData(Map<String, Object> customData) {
		this.customData = customData;
	}
	public RequestDate getDates() {
		return dates;
	}
	public void setDates(RequestDate dates) {
		this.dates = dates;
	}
	
}
