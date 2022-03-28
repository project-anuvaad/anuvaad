package com.tarento.analytics.model;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author Darshan
 *
 */
public class ElasticSearchDictator {

	private String visualisationName;
	private String indexName;
	private String documentType;
	private Map<String, Map<String, List<Object>>> queryMap;
	private Map<String, LinkedList<Map<String, Map<String, Object>>>> aggregationMap;
	private Map<String, Object> queryAggregationMap;

	public Map<String, Object> getQueryAggregationMap() {
		return queryAggregationMap;
	}

	public void setQueryAggregationMap(Map<String, Object> queryAggregationMap) {
		this.queryAggregationMap = queryAggregationMap;
	}

	public String getVisualisationName() {
		return visualisationName;
	}

	public void setVisualisationName(String visualisationName) {
		this.visualisationName = visualisationName;
	}

	public String getIndexName() {
		return indexName;
	}

	public void setIndexName(String indexName) {
		this.indexName = indexName;
	}

	public String getDocumentType() {
		return documentType;
	}

	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}

	public Map<String, Map<String, List<Object>>> getQueryMap() {
		return queryMap;
	}

	public void setQueryMap(Map<String, Map<String, List<Object>>> queryMap) {
		this.queryMap = queryMap;
	}

	public Map<String, LinkedList<Map<String, Map<String, Object>>>> getAggregationMap() {
		return aggregationMap;
	}

	public void setAggregationMap(Map<String, LinkedList<Map<String, Map<String, Object>>>> aggregationMap) {
		this.aggregationMap = aggregationMap;
	}

}
