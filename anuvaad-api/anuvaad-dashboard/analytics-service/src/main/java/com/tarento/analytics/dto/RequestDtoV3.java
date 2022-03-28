package com.tarento.analytics.dto;

import java.util.Map;

public class RequestDtoV3 {

	private Map<String, Object> headers;
	private AggregateRequestDtoV3 aggregationRequestDto;
	
	public Map<String, Object> getHeaders() {
		return headers;
	}
	public void setHeaders(Map<String, Object> headers) {
		this.headers = headers;
	}
	public AggregateRequestDtoV3 getAggregationRequestDto() {
		return aggregationRequestDto;
	}
	public void setAggregationRequestDto(AggregateRequestDtoV3 aggregationRequestDto) {
		this.aggregationRequestDto = aggregationRequestDto;
	}
}
