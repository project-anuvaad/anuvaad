package com.tarento.analytics.utils;

public interface PathRoutes {

	public interface DashboardApi { 
		final String DASHBOARD_ROOT_PATH = "/dashboard";

		final String TEST_PATH = "/test";
		
		final String GET_CHART = "/getChart";
		final String GET_CHART_V2 = "/getChartV2";
		final String GET_REPORT = "/getReport";
		final String GET_DASHBOARD_CONFIG = "/getDashboardConfig"; 
		final String GET_HOME_CONFIG = "/getHomeConfig";
		final String GET_ALL_VISUALIZATIONS = "/getAllVisualizations"; 
		final String ADD_NEW_DASHBOARD = "/addNewDashboard"; 
		final String MAP_DASHBOARD_VISUALIZATIOn = "/mapVisualizationToDashboard"; 
		final String MAP_VISUALIZATION_ROLE = "/mapVisualizationToRole";
		final String GET_HEADER_DATA = "/getDashboardHeader";
		final String GET_FEEDBACK_MESSAGE="/getPulseFeedbackMessage";
		final String TARGET_DISTRICT_ULB = "/targetDistrict";
		final String GET_DASHBOARDS_FOR_PROFILE= "/getDashboardsForProfile"; 

	}
	
	public interface MetadataApi { 
		final String METADATA_ROOT_PATH = "/meta";
		
		final String GET_CATEGORIES = "/getCategories";
		final String GET_SUB_CATEGORIES = "/getSubCategories"; 
		final String GET_ITEMS = "/getItems"; 
		final String GET_MASTERS = "/getMasters"; 
		final String FLUSH_MASTERS = "/flushMasters"; 
		final String GET_PULSE_RATING_CONFIG="/getPulseRatingConfig";
		final String GET_RATING_CONFIG = "/getRatingConfiguration"; 
		final String GET_RATING_CONFIG_ENCODE = "/getRatingConfig"; 
		final String GET_CONFIG_VERSION = "/getConfigVersion"; 
		final String PULSE_VERIFY_ORG_PIN = "/verifyOrgs"; 
		final String PUT_ORG_INDEX ="/putIndex";
		final String PUT_QUERY ="/createQuery";

		
	}
}
