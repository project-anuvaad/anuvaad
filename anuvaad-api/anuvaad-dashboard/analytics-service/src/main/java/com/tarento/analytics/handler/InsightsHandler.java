package com.tarento.analytics.handler;

import java.util.List;

import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.enums.ChartType;
import com.tarento.analytics.model.InsightsConfiguration;

public interface InsightsHandler {
	
	public static final String CHART_NAME = "chartName";
	public static final String CHART_TYPE = "chartType";
	public static final String DRILL_CHART = "drillChart";
	public static final String VALUE_TYPE = "valueType";
	public static final String FILTER_KEYS = "filterKeys";
	public static final String INSIGHT_WIDGET_NAME = "INSIGHTS"; 
	public static final String INDICATOR_PLACEHOLDER = "$indicator"; 
	public static final String VALUE_PLACEHOLDER = "$value";
	public static final String INSIGHT_INTERVAL_PLACEHOLDER = "$insightInterval"; 
	public static final String INSIGHT_INDICATOR_POSITIVE = "upper_green"; 
	public static final String INSIGHT_INDICATOR_NEGATIVE = "lower_red"; 
	public static final String POSITIVE = "+";
	public static final String NEGATIVE = "-"; 
	
	public static final String INSIGHT_NUMBER_DIFFERENCE = "differenceOfNumbers" ; 
	public static final String INSIGHT_PERCENTAGE_DIFFERENCE = "differenceOfPercentage" ;
	
	AggregateDto getInsights(AggregateDto aggregateDto, String visualizationCode, String moduleLevel, InsightsConfiguration insightsConfig);
	
	default AggregateDto getAggregatedDto(List<Data> dataList, String visualizationCode) {
		AggregateDto aggregateDto = new AggregateDto();
		aggregateDto.setVisualizationCode(visualizationCode);
		aggregateDto.setDrillDownChartId("none");
		ChartType chartType = ChartType.fromValue("metric");
		aggregateDto.setChartType(chartType);
		aggregateDto.setData(dataList);
		return aggregateDto;
	}

}
