package com.tarento.analytics.dto;

public class RichPlot extends Plot {

	public RichPlot(String name, Double value, String symbol) {
		super(name, value, symbol);
	}
	
	public RichPlot() {} 
	private Object xAxis; 
	private String xAxisLabel; 
	private Object yAxis;
	private String yAxisLabel;
	private Object zAxis;
	private String zAxisLabel;
	
	public Object getzAxis() {
		return zAxis;
	}

	public void setzAxis(Object zAxis) {
		this.zAxis = zAxis;
	}

	public String getzAxisLabel() {
		return zAxisLabel;
	}

	public void setzAxisLabel(String zAxisLabel) {
		this.zAxisLabel = zAxisLabel;
	}

	public String getxAxisLabel() {
		return xAxisLabel;
	}

	public void setxAxisLabel(String xAxisLabel) {
		this.xAxisLabel = xAxisLabel;
	}

	public String getyAxisLabel() {
		return yAxisLabel;
	}

	public void setyAxisLabel(String yAxisLabel) {
		this.yAxisLabel = yAxisLabel;
	}

	public Object getxAxis() {
		return xAxis;
	}
	public void setxAxis(Object xAxis) {
		this.xAxis = xAxis;
	}
	public Object getyAxis() {
		return yAxis;
	}
	public void setyAxis(Object yAxis) {
		this.yAxis = yAxis;
	} 
}

