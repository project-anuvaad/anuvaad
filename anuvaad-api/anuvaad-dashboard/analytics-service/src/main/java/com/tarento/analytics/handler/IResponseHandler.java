package com.tarento.analytics.handler;

import java.io.IOException;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import com.tarento.analytics.enums.ChartType;

/**
 * Handles Elastic search consolidate responses
 */
public interface IResponseHandler {

	public static final Logger logger = LoggerFactory.getLogger(IResponseHandler.class);

	public static final String API_CONFIG_JSON = "ChartApiConfig.json";
	public static final String AGGS_PATH = "aggregationPaths";
	public static final String DEPTH_STEPS = "depthSteps";
	public static final String NEGATIVE_COUNT="Negative Count";
	public static final String CUMULATIVE_VALUE="Cumulative Value";
	
	public static final String CHART_NAME = "chartName";
	public static final String CHART_TYPE = "chartType";
	public static final String DRILL_CHART = "drillChart";
	public static final String VALUE_TYPE = "valueType";
	public static final String FILTER_KEYS = "filterKeys";
	public static final String LABEL = "label";
	public static final String FILTER = "filter"; 
	
	public static final String COLOR_PALETTE_CODE = "colorPaletteCode"; 
	public static final String COLOR_PALETTE_ID = "colorPaletteId"; 
	
	public static final String XPATH = "xPath";
	public static final String YPATH = "yPath";
	public static final String ZPATH = "zPath";
	public static final String CURRENT_PATH = "CurrentPath";
	
	// Table Chart Keys
	public static final String SERIAL_NUMBER = "S.N.";
	public static final String TABLE_TEXT = "text" ; 
	public static final String TABLE_KEY = "Key"; 
	
    public static final String TOTAL_COLLECTION = "Total Collection";
    public static final String TARGET_COLLECTION = "Target Collection";
    public static final String TARGET_ACHIEVED = "Target Achievement";

	public static final String PT_DDR_BOUNDARY = "demandCollectionIndexDDRRevenue";
	public static final String PT_BOUNDARY = "demandCollectionIndexBoundaryRevenue";
	public static final String PT_BOUNDARY_DRILL = "boundaryDrillDown";
	public static final String TL_DDR_BOUNDARY = "licenseIssuedDDRRevenue";
	public static final String TL_BOUNDARY = "licenseIssuedBoundaryRevenue";
	public static final String TL_BOUNDARY_DRILL = "licenseIssuedBoundaryDrillDown";


    public final String ASC = "asc";
	public final String DESC = "desc";
	public final String RANK = "Rank";
	public final String AGGREGATIONS = "aggregations";
	public final String PLOT_LABEL = "plotLabel";
	public final String LIMIT = "limit";
	public final String ORDER = "order";
	public final String ACTION = "action";
	public final String TYPE_MAPPING = "pathDataTypeMapping";
	public final String RESULT_TYPE = "resultType";

	public static String BUCKETS = "buckets";
	public static String KEY = "key";
	public static String VALUE = "value";
	
	public static String HEADER_LABEL = "headerLabel";
	public static String VALUE_LABEL = "valueLabel";
	public static String PARENT_LABEL = "parentLabel"; 
	public static String HEADER_LABEL_DEFAULT = "Header";
	public static String VALUE_LABEL_DEFAULT = "Value";
	public static String PARENT_LABEL_DEFAULT = "Parent"; 
	
	
	public final String PERCENTAGE = "percentage";
	public final String METRIC_GROUP = "metricgroup"; 
    public final String DOC_COUNT = "doc_count"; 
    
    public final String IS_DECIMAL = "isDecimal"; 
    
    public static final String POST_AGGREGATION_THEORY = "postAggregationTheory";

	public static Double BOUNDARY_VALUE = 50.0;

	/**
	 * Translate the consolidated/aggregated response
	 *
	 * @param requestDto
	 * @param aggregations
	 * @return
	 * @throws IOException
	 */
	public AggregateDto translate(String profileName, AggregateRequestDto requestDto, ObjectNode aggregations) throws IOException;

	/**
	 * Prepare aggregated dato for a chart node
	 *
	 * @param chartNode
	 * @param dataList - data plots object
	 * @return
	 */
	default AggregateDto getAggregatedDto(JsonNode chartNode, List<Data> dataList, String visualizationCode) {
		AggregateDto aggregateDto = new AggregateDto();
		if(chartNode.get(FILTER) != null && StringUtils.isNotBlank(chartNode.get(FILTER).asText())) { 
			aggregateDto.setFilter(chartNode.get(FILTER).asText());
		}
		aggregateDto.setVisualizationCode(visualizationCode);
		aggregateDto.setDrillDownChartId(chartNode.get(DRILL_CHART).asText());
		
		ChartType chartType = ChartType.fromValue(chartNode.get(CHART_TYPE).asText());
		aggregateDto.setChartType(chartType);
		aggregateDto.setData(dataList);
		if(null!=chartNode.get(FILTER_KEYS))
			aggregateDto.setFilterKeys((ArrayNode) chartNode.get(FILTER_KEYS));
		return aggregateDto;
	}

	/**
	 * Append computed field for a given Data, for its existing fields
	 * computes as partfield/wholefield * 100
	 *
	 * @param data
	 * @param newfield
	 * @param partField
	 * @param wholeField
	 */
	default void addComputedField(Data data, String newfield, String partField, String wholeField) {
		try {
			Map<String, Plot> plotMap = data.getPlots().stream().parallel().collect(Collectors.toMap(Plot::getName, Function.identity()));

			if ((double)plotMap.get(partField).getValue() == 0.0 || (double)plotMap.get(wholeField).getValue() == 0.0) {
				data.getPlots().add(new Plot(newfield, 0.0, "percentage"));
			} else {
				double fieldValue = (double)plotMap.get(partField).getValue() / (double)plotMap.get(wholeField).getValue() * 100;
				data.getPlots().add(new Plot(newfield, fieldValue, "percentage"));

			}
		} catch (Exception e) {
			data.getPlots().add(new Plot(newfield, 0.0, "percentage"));
		}

	}

	/**
	 * Computes the percentage from 0th and 1st index of list
	 * Ex: 0th element/1st element * 100
	 * @param values
	 * @return
	 */
	default Double percentageValue(List<Double> values) {
		double val = (values.get(0)/values.get(1) * 100);
		return (values.size() > 1 && values.get(0) != 0.0 && values.get(1) != 0.0) ? val : 0.0;
	}


	/**
	 * Computes the percentage from 1st & 2nd element of collection
	 * Ex: first element/second element * 100
	 * @param values
	 * @return
	 */
	default Double getPercentage(Map<String, Double> values, String partField, String wholeField) {

		double val = (values.get(partField)/ values.get(wholeField) * 100);
		return (values.size() > 1 && values.get(partField) != 0.0 && values.get(wholeField) != 0.0)  ? val: 0.0;
	}

	/**
	 * Adding missing plot elements with cumulative data
	 * @param plotKeys - all required plot key
	 * @param data
	 * @param symbol
	 */
	default void appendMissingPlot(Set<String> plotKeys, Data data, String symbol, boolean isCumulative) {

		//To maintain the sorted plots list order
		Map<String, Plot> sortedMap = data.getPlots().stream()
				.collect(Collectors.toMap(
						Plot::getName,
						plot -> plot,
						(u,v) -> { throw new IllegalStateException(String.format("Duplicate key %s", u)); },
						LinkedHashMap::new
				));

		logger.info(data.getHeaderName() + " existing keys: "+sortedMap.keySet()+ "& size:"+sortedMap.keySet().size());

		Collection<String> allKeysMinusDataKeys = CollectionUtils.subtract(plotKeys, sortedMap.keySet());
		logger.info(data.getHeaderName() +" missing keys: "+allKeysMinusDataKeys);


		for(String plKey:allKeysMinusDataKeys){
			sortedMap.put(plKey, new Plot(plKey, new Double("0"), symbol));
			if(isCumulative){
				List<String> keys = sortedMap.keySet().stream().collect(Collectors.toList());
				int index = keys.indexOf(plKey);
				double value = index>0 ? (double) sortedMap.get(keys.get(index-1)).getValue():0.0;
				sortedMap.get(plKey).setValue(value);
			}
		}
		logger.info("after appending missing plots : "+ sortedMap);
		data.setPlots(sortedMap.values().stream().collect(Collectors.toList()));
	}

}
