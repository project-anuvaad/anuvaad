package org.egov.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Setter
@Getter
@ToString
@Slf4j
@Builder
public class CustomAsyncRequest {

	private Map<String, Object> request;
	private Map<String, Object> response;
	private String sourceUri;
	Map<String, List<String>> queryParamMap = new HashMap<>();
	
}
