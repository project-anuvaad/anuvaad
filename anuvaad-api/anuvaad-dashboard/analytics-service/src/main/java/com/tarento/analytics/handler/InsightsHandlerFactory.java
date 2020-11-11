package com.tarento.analytics.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tarento.analytics.enums.ChartType;

@Component
public class InsightsHandlerFactory {

	@Autowired
    private MetricsInsightsHandler metricInsightsHandler;
	
	public InsightsHandler getInstance(ChartType chartType) { 
		if(chartType == ChartType.METRIC)
			return metricInsightsHandler;
		return metricInsightsHandler; 
	}
}
