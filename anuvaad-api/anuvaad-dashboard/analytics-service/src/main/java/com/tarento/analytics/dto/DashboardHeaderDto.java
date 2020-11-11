package com.tarento.analytics.dto;

import com.tarento.analytics.model.LineData;

public class DashboardHeaderDto {

	private String type;
	private Object data;
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	public LineData getLineData() {
		return lineData;
	}
	public void setLineData(LineData lineData) {
		this.lineData = lineData;
	}
	private LineData lineData;
}
