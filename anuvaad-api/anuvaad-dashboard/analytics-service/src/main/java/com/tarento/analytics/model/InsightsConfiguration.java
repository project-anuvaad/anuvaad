package com.tarento.analytics.model;

public class InsightsConfiguration {
	private String chartResponseMap; 
	private String action; 
	private String upwardIndicator; 
	private String downwardIndicator; 
	private String textMessage; 
	private String colorCode;
	private String insightInterval; 
	
	public String getInsightInterval() {
		return insightInterval;
	}
	public void setInsightInterval(String insightInterval) {
		this.insightInterval = insightInterval;
	}
	public String getChartResponseMap() {
		return chartResponseMap;
	}
	public void setChartResponseMap(String chartResponseMap) {
		this.chartResponseMap = chartResponseMap;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getUpwardIndicator() {
		return upwardIndicator;
	}
	public void setUpwardIndicator(String upwardIndicator) {
		this.upwardIndicator = upwardIndicator;
	}
	public String getDownwardIndicator() {
		return downwardIndicator;
	}
	public void setDownwardIndicator(String downwardIndicator) {
		this.downwardIndicator = downwardIndicator;
	}
	public String getTextMessage() {
		return textMessage;
	}
	public void setTextMessage(String textMessage) {
		this.textMessage = textMessage;
	}
	public String getColorCode() {
		return colorCode;
	}
	public void setColorCode(String colorCode) {
		this.colorCode = colorCode;
	}
}
