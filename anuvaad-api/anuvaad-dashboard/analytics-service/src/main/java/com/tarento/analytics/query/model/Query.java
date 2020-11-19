package com.tarento.analytics.query.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Query {

	@JsonProperty("x_axis")
	public XAxis xAxis;

	@JsonProperty("y_axis")
	public YAxis yAxis;

	public XAxis getxAxis() {
		return xAxis;
	}

	public void setxAxis(XAxis xAxis) {
		this.xAxis = xAxis;
	}

	public YAxis getyAxis() {
		return yAxis;
	}

	public void setyAxis(YAxis yAxis) {
		this.yAxis = yAxis;
	}
}
