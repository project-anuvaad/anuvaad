package com.tarento.analytics.model;

public class ServiceQuery {

	private String indexName;
	private String queryJson;
	private String documentType;
	public String getIndexName() {
		return indexName;
	}
	public void setIndexName(String indexName) {
		this.indexName = indexName;
	}
	public String getQueryJson() {
		return queryJson;
	}
	public void setQueryJson(String queryJson) {
		this.queryJson = queryJson;
	}
	public String getDocumentType() {
		return documentType;
	}
	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}
	
}
