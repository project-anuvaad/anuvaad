package com.tarento.analytics.dto;

import java.util.Map;

public class RequestDto {

	private Map<String, Object> headers;
	private AggregateRequestDto aggregationRequestDto;
	
	public Map<String, Object> getHeaders() {
		return headers;
	}
	public void setHeaders(Map<String, Object> headers) {
		this.headers = headers;
	}
	public AggregateRequestDto getAggregationRequestDto() {
		return aggregationRequestDto;
	}
	public void setAggregationRequestDto(AggregateRequestDto aggregationRequestDto) {
		this.aggregationRequestDto = aggregationRequestDto;
	} 
}
