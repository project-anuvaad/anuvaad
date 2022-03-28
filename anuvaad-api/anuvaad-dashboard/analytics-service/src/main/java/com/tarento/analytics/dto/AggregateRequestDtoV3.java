package com.tarento.analytics.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.node.ObjectNode;

public class AggregateRequestDtoV3 {
	
	private String requestId; 
	private List<Visualization> visualizations; 
	private String moduleLevel; 
	private String queryType;
	private Map<String, Object> filters; 
	private Map<String, Object> esFilters; 
	private Map<String, Object> aggregationFactors; 
	private RequestDate requestDate; 
	private String interval;
	private ObjectNode chartNode;
	
	public String getRequestId() {
		return requestId;
	}

	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}

	public ObjectNode getChartNode() {
		return chartNode;
	}

	public void setChartNode(ObjectNode chartNode) {
		this.chartNode = chartNode;
	}

	public String getModuleLevel() {
		return moduleLevel;
	}
	public void setModuleLevel(String moduleLevel) {
		this.moduleLevel = moduleLevel;
	}
	public Map<String, Object> getEsFilters() {
		return esFilters;
	}
	public void setEsFilters(Map<String, Object> esFilters) {
		this.esFilters = esFilters;
	}
	public String getQueryType() {
		return queryType;
	}
	public void setQueryType(String queryType) {
		this.queryType = queryType;
	}
	public Map<String, Object> getFilters() {
		return filters;
	}
	public void setFilters(Map<String, Object> filters) {
		this.filters = filters;
	}
	public Map<String, Object> getAggregationFactors() {
		return aggregationFactors;
	}
	public void setAggregationFactors(Map<String, Object> aggregationFactors) {
		this.aggregationFactors = aggregationFactors;
	}
	public RequestDate getRequestDate() {
		return requestDate;
	}
	public void setRequestDate(RequestDate requestDate) {
		this.requestDate = requestDate;
	}
	public String getInterval() {
		return interval;
	}
	public void setInterval(String interval) {
		this.interval = interval;
	}

	public List<Visualization> getVisualizations() {
		return visualizations;
	}

	public void setVisualizations(List<Visualization> visualizations) {
		this.visualizations = visualizations;
	}
	
}
