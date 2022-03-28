package com.tarento.analytics.model;

import java.util.Map;

public class Query {

	private String dateFilterField;
	private Map<String, Object> aggregation;

	public String getDateFilterField() {
		return dateFilterField;
	}

	public void setDateFilterField(String dateFilterField) {
		this.dateFilterField = dateFilterField;
	}

	public Map<String, Object> getAggregation() {
		return aggregation;
	}

	public void setAggregation(Map<String, Object> aggregation) {
		this.aggregation = aggregation;
	}

}
