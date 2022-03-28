package com.tarento.analytics.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.tarento.analytics.constant.Constants;

@Component("responseRecorder")
public class ResponseRecorder {

	private static Logger logger = LoggerFactory.getLogger(ResponseRecorder.class);
	protected static final ConcurrentHashMap<String, Map<String, Object>> requestModuleResponseMap = new ConcurrentHashMap<>();

	public Object get(String visualizationCode, String module) {
		if (StringUtils.isNotBlank(module)) {
			module = Constants.Modules.COMMON.toString();
		}
		if (requestModuleResponseMap.get(visualizationCode) != null
				&& requestModuleResponseMap.get(visualizationCode).get(module) != null) {
			return requestModuleResponseMap.get(visualizationCode).get(module);
		}
		return null;
	}

	public Boolean put(String visualizationCode, String module, Object object) {
		if (StringUtils.isNotBlank(module)) {
			module = Constants.Modules.COMMON.toString();
		}
		if (requestModuleResponseMap.containsKey(visualizationCode)) {
			Map<String, Object> innerMap = requestModuleResponseMap.get(visualizationCode);
			innerMap.put(module, object);
		} else {
			Map<String, Object> innerMap = new HashMap<>();
			innerMap.put(module, object);
			requestModuleResponseMap.put(visualizationCode, innerMap);
		}
		return Boolean.TRUE;
	}

}
