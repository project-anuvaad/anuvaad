package com.tarento.analytics.handler;

import com.tarento.analytics.enums.ChartType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ResponseHandlerFactory {

	@Autowired
	private MetricChartResponseHandler metricChartResponseHandler;
	@Autowired
	private LineChartResponseHandler lineChartResponseHandler;
	@Autowired
	private PieChartResponseHandler pieChartResponseHandler;
	@Autowired
	private PerformanceChartResponeHandler performingBarChartResponeHandler;
	@Autowired
	private TableChartResponseHandler tableChartResponseHandler;
	@Autowired
	private AdvanceTableChartResponseHandler advanceTableChartResponseHandler;
	@Autowired
	private WeightChartResponseHandler weightChartResponseHandler;
	@Autowired
	private AdvancedMapResponseHandler advancedMapResponseHandler;
	@Autowired
	private MapResponseHandler mapResponseHandler;
	@Autowired
	private TableChartResponseHandler reportResponseHandler;
	@Autowired
	private MultiBarChartResponseHandler multiBarChartResponseHandler;
	@Autowired
	private DynamicTableResponseHandler dynamicTableResponseHandler;
	@Autowired
	private LineBarResponseHandler lineBarResponseHandler;

	public IResponseHandler getInstance(ChartType chartType) {

		if (chartType == ChartType.METRIC) {
			return metricChartResponseHandler;

		} else if (chartType == ChartType.LINE) {
			return lineChartResponseHandler;

		} else if (chartType == ChartType.PIE) {
			return pieChartResponseHandler;

		} else if (chartType == ChartType.PERFORM) {
			return performingBarChartResponeHandler;

		} else if (chartType == ChartType.TABLE) {
			return tableChartResponseHandler;

		} else if (chartType == ChartType.XTABLE) {
			return advanceTableChartResponseHandler;

		} else if (chartType == ChartType.BAR) {
			return pieChartResponseHandler;

		} else if (chartType == ChartType.STACKEDBAR) {
			return lineChartResponseHandler;

		} else if (chartType == ChartType.MULTIBAR) {
			return multiBarChartResponseHandler;

		} else if (chartType == ChartType.DONUT) {
			return pieChartResponseHandler;

		} else if (chartType == ChartType.HORIZONTALBAR) {
			return pieChartResponseHandler;

		} else if (chartType == ChartType.POLARAREA) {
			return pieChartResponseHandler;

		} else if (chartType == ChartType.METRICCOLLECTION) {
			return metricChartResponseHandler;

		} else if (chartType == ChartType.TREEMAP) {
			return pieChartResponseHandler;

		} else if (chartType == ChartType.BUBBLECHART) {
			return weightChartResponseHandler;

		} else if (chartType == ChartType.INDIAMAP) {
			return pieChartResponseHandler;

		} else if (chartType == ChartType.INDIADISTRICTMAP) {
			return mapResponseHandler;

		} else if (chartType == ChartType.REPORT) {
			return reportResponseHandler;

		} else if (chartType == ChartType.DYNAMICTABLE) {
			return dynamicTableResponseHandler;

		} else if (chartType == ChartType.LINE_BAR) {
			return lineBarResponseHandler;

		} else if (chartType == ChartType.CALENDARHEATMAP) {
			return lineChartResponseHandler;

		}

		return null;
	}

	@Autowired
	private TablePostResponseHandler tablePostResponseHandler;

	public IPostResponseHandler get(ChartType chartType) {

		if (chartType == ChartType.TABLE) {
			return tablePostResponseHandler;
		}
		return null;
	}

}
