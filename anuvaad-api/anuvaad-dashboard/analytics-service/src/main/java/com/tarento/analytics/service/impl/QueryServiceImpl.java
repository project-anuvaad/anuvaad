package com.tarento.analytics.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.elasticsearch.action.search.MultiSearchResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.Aggregations;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedLongTerms;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.metrics.avg.ParsedAvg;
import org.elasticsearch.search.aggregations.metrics.sum.ParsedSum;
import org.elasticsearch.search.aggregations.metrics.valuecount.ParsedValueCount;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.dao.ElasticSearchDao;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.enums.ChartType;
import com.tarento.analytics.exception.AINException;
import com.tarento.analytics.model.ElasticSearchDictator;
import com.tarento.analytics.model.KeyData;
import com.tarento.analytics.model.Query;
import com.tarento.analytics.model.ServiceQuery;
import com.tarento.analytics.service.QueryService;
import com.tarento.analytics.utils.ElasticProperties;

@Component
public class QueryServiceImpl implements QueryService {

	public static final Logger logger = LoggerFactory.getLogger(QueryServiceImpl.class);
	/*
	 * @Autowired private MetadataDao metaDataDao;
	 */

	@Autowired
	private ElasticSearchDao elasticSearchDao;

	/*
	 * @Autowired private DecoratorService decoratorService;
	 * 
	 */
	@Autowired
	private ConfigurationLoader configurationLoader;

	private static final Map<Integer, String> WeekDayMap = createMap();

	private static Map<Integer, String> createMap() {
		Map<Integer, String> result = new HashMap<Integer, String>();
		result.put(1, "SUN");
		result.put(2, "MON");
		result.put(3, "TUE");
		result.put(4, "WED");
		result.put(5, "THU");
		result.put(6, "FRI");
		result.put(7, "SAT");

		return Collections.unmodifiableMap(result);
	}

	/*
	 * @Override public Aggregations getAggregateData(AggregateRequestDto
	 * aggregateDto, String orgId) throws AINException {
	 * 
	 * //public List<Aggregation> getAggregateData(AggregateRequestDto aggregateDto,
	 * String orgId) throws AINException { Aggregations aggregations = null;
	 * ElasticSearchDictator dictator = null; ServiceQuery elasticServiceQuery =
	 * metaDataDao.getServiceQuery(Long.parseLong(orgId),
	 * aggregateDto.getServiceApi());
	 * 
	 * ObjectMapper mapper = new ObjectMapper();
	 */
	/* Map<KeyData, Object> resonseMap = null; *//*
													 * 
													 * try {
													 * 
													 * //Query Builder Query queryJson =
													 * mapper.readValue(elasticServiceQuery.getQueryJson(),
													 * Query.class); // Set index name and document Type for elastic
													 * Map<String, Object> queryMap = queryJson.getAggregation();
													 * 
													 * //Label Mapping Map<String,String> labelMap = new HashMap<>();
													 * getAggregateLabelRecursively(queryMap,labelMap);
													 * 
													 * dictator = elasticSearchDao.createSearchDictator(aggregateDto,
													 * elasticServiceQuery.getIndexName(),
													 * elasticServiceQuery.getDocumentType(),
													 * queryJson.getDateFilterField());
													 * dictator.setQueryAggregationMap(queryMap); SearchRequest
													 * searchRequest =
													 * elasticSearchDao.buildElasticSearchQuery(dictator);
													 * List<SearchRequest> searchRequestList = new ArrayList<>();
													 * searchRequestList.add(searchRequest); MultiSearchResponse
													 * response =
													 * elasticSearchDao.executeMultiSearchRequest(searchRequestList,
													 * Boolean.TRUE); SearchResponse searchResponse =
													 * response.getResponses()[0].getResponse(); aggregations =
													 * searchResponse.getAggregations();
													 */
	/*
	 * resonseMap= translateResponse(response,
	 * aggregateDto.getChartType(),aggregateDto.getInterval(), labelMap);
	 * decoratorService.getChartData(aggregateDto, chartFormat, chartType,
	 * serviceApi, chartCode)
	 *//*
		 * 
		 * } catch (Exception e) { // TODO Auto-generated catch block
		 * e.printStackTrace(); } return aggregations; }
		 * 
		 * @Override public Aggregations getAggregateDataV2(AggregateRequestDtoV2
		 * aggregateDto, String orgId) throws AINException, JsonParseException,
		 * JsonMappingException, IOException { Boolean primaryOrNot = Boolean.TRUE;
		 * ServiceQuery elasticServiceQuery = new ServiceQuery(); String
		 * visualizationCode = aggregateDto.getVisualizationCode(); ObjectNode
		 * configNode = configurationLoader.get(API_CONFIG_JSON);
		 * elasticServiceQuery.setIndexName(configNode.get(visualizationCode).get(
		 * INDEX_NAME).asText());
		 * elasticServiceQuery.setDocumentType(configNode.get(visualizationCode).get(
		 * DOCUMENT_TYPE).asText());
		 * elasticServiceQuery.setQueryJson(configNode.get(visualizationCode).get(
		 * AGG_QUERY_JSON).asText());
		 * if(elasticServiceQuery.getIndexName().equals("dss-col-v1")) { primaryOrNot =
		 * Boolean.TRUE; } else { primaryOrNot = Boolean.FALSE; } ObjectMapper mapper =
		 * new ObjectMapper(); Query queryJson =
		 * mapper.readValue(elasticServiceQuery.getQueryJson(), Query.class);
		 * 
		 * // Set index name and document Type for elastic Map<String, Object> queryMap
		 * = queryJson.getAggregation();
		 * 
		 * //Label Mapping Map<String,String> labelMap = new HashMap<>();
		 * getAggregateLabelRecursively(queryMap,labelMap);
		 * 
		 * Aggregations aggregations = null; ElasticSearchDictator dictator = null;
		 * 
		 * try { dictator = elasticSearchDao.createSearchDictatorV2(aggregateDto,
		 * elasticServiceQuery.getIndexName(), elasticServiceQuery.getDocumentType(),
		 * queryJson.getDateFilterField()); dictator.setQueryAggregationMap(queryMap);
		 * SearchRequest searchRequest =
		 * elasticSearchDao.buildElasticSearchQuery(dictator); List<SearchRequest>
		 * searchRequestList = new ArrayList<>(); searchRequestList.add(searchRequest);
		 * MultiSearchResponse response =
		 * elasticSearchDao.executeMultiSearchRequest(searchRequestList, primaryOrNot);
		 * SearchResponse searchResponse = response.getResponses()[0].getResponse();
		 * aggregations = searchResponse.getAggregations(); } catch (Exception e) {
		 * logger.error("Encountered an error while getting the Aggregated Data  : " +
		 * e.getMessage()); } return aggregations; }
		 */

	/*
	 * private Map<KeyData, Object> translateResponse(MultiSearchResponse response,
	 * ChartType chartType, String interval, Map<String,String> labelMap) {
	 * SearchResponse searchResponse = response.getResponses()[0].getResponse();
	 * List<Aggregation> aggregations = searchResponse.getAggregations().asList();
	 * Map<KeyData, Object> responseMap = new HashMap<>();
	 * 
	 * if (chartType.equals(ChartType.BAR) ||
	 * chartType.equals(ChartType.HORIZONTALBAR) || chartType.equals(ChartType.PIE)
	 * || chartType.equals(ChartType.DOUGHNUT)) {
	 * 
	 * if (aggregations.get(0) instanceof ParsedLongTerms) { responseMap =
	 * parseParseLongTerms((ParsedLongTerms) aggregations.get(0), chartType,
	 * labelMap); } }
	 * 
	 * return responseMap; }
	 */

	@SuppressWarnings("unchecked")
	void getAggregateLabelRecursively(Map<String, Object> queryMap, Map<String, String> labelMap) {
		try {
			if (queryMap.containsKey(ElasticProperties.Query.AGGREGATION_CONDITION.toLowerCase())) {

				Map<String, Object> valueMap = (HashMap<String, Object>) queryMap
						.get(ElasticProperties.Query.AGGREGATION_CONDITION.toLowerCase());
				getAggregateLabelRecursively(valueMap, labelMap);
			}
			for (Map.Entry<String, Object> itrQuery : queryMap.entrySet()) {
				if (itrQuery.getKey().equals(ElasticProperties.Query.AGGREGATION_CONDITION.toLowerCase())) {
					continue;
				}
				Map<String, Object> propertiesMap = (HashMap<String, Object>) itrQuery.getValue();
				labelMap.put(itrQuery.getKey(),
						propertiesMap.get(ElasticProperties.Query.LABEL.toLowerCase()).toString());
			}
		} catch (Exception e) {
			logger.error("Exception in getAggregateLabelRecursively {} ", e.getMessage());

		}
	}
	/*
	 * private Map<KeyData, Object> parseDateHistogramForMultiLine(List<Aggregation>
	 * aggregations, ChartType chartType, String interval) { Map<KeyData, Object>
	 * responseMap = new HashMap<>();
	 * 
	 * for (Histogram.Bucket bucket : ((ParsedDateHistogram)
	 * aggregations.get(0)).getBuckets()) { List<Aggregation> subAggregations =
	 * bucket.getAggregations().asList(); if (subAggregations.get(0) instanceof
	 * ParsedLongTerms) { parseParseLongTermsOnInterval(bucket, chartType, interval,
	 * responseMap); }
	 * 
	 * }
	 * 
	 * return responseMap;
	 * 
	 * }
	 */

	/*
	 * private Map<KeyData, Object> parseNested(List<Aggregation> aggregations,
	 * ChartType chartType, String interval) {
	 * 
	 * Map<KeyData, Object> responseMap = new HashMap<>(); for (Aggregation
	 * aggregationData : ((ParsedNested) aggregations.get(0)).getAggregations()) {
	 * if (aggregationData instanceof ParsedLongTerms) { responseMap =
	 * parseParseLongTerms((ParsedLongTerms) aggregationData, chartType, interval);
	 * }
	 * 
	 * } return responseMap;
	 * 
	 * }
	 */

	/*
	 * private Map<KeyData, Object> parseDateHistogram(List<Aggregation>
	 * aggregations, ChartType chartType, String interval) {
	 * 
	 * Map<KeyData, Object> responseMap = new HashMap<>(); if
	 * (interval.equals(ElasticSearchConstants.DAY_OF_WEEK)) { Map<Integer, Object>
	 * dayWiseObjectMap = new HashMap<Integer, Object>() { { put(1, null); put(2,
	 * null); put(3, null); put(4, null); put(5, null); put(6, null); put(7, null);
	 * 
	 * } };
	 * 
	 * for (Histogram.Bucket bucket : ((ParsedDateHistogram)
	 * aggregations.get(0)).getBuckets()) { Calendar cal = Calendar.getInstance();
	 * cal.setTimeInMillis(Long.parseLong(bucket.getKeyAsString())); int dayofWeek =
	 * cal.get(Calendar.DAY_OF_WEEK);
	 * 
	 * Object val = getAggregationValue(bucket); if
	 * (dayWiseObjectMap.containsKey(dayofWeek)) { Object dayWiseCount =
	 * dayWiseObjectMap.get(dayofWeek); if (val instanceof Double) { Double
	 * doubleValue = 0.0; if (dayWiseCount == null) { doubleValue = 0.0; } else {
	 * doubleValue = (Double) dayWiseCount; } doubleValue +=
	 * getFormattedDouble((Double) val); dayWiseCount = doubleValue; } else if (val
	 * instanceof Long) { Long longValue = 0L; if (dayWiseCount == null) { longValue
	 * = 0L; } else { longValue = (Long) dayWiseCount; } longValue += (Long) val;
	 * dayWiseCount = longValue; } dayWiseObjectMap.put(dayofWeek, dayWiseCount); }
	 * else { if (val instanceof Double) { Double doubleValue = (Double) val;
	 * doubleValue += getFormattedDouble((Double) val); val = doubleValue; }
	 * dayWiseObjectMap.put(dayofWeek, val); } } for (Map.Entry<Integer, Object>
	 * entry : dayWiseObjectMap.entrySet()) {
	 * 
	 * responseMap.put(WeekDayMap.get(entry.getKey()), (entry.getValue())); } } else
	 * { for (Histogram.Bucket bucket : ((ParsedDateHistogram)
	 * aggregations.get(0)).getBuckets()) { List<Aggregation> subAggregations =
	 * bucket.getAggregations().asList(); if (subAggregations.get(0) instanceof
	 * ParsedLongTerms) {
	 * 
	 * 
	 * responseMap = parseParseLongTermsOnInterval(bucket, chartType, interval); }
	 * else { responseMap = parseDateHistogramBasedOnInterval(bucket, chartType,
	 * interval); }
	 * 
	 * } } return responseMap;
	 * 
	 * }
	 */
	/*
	 * private void parseParseLongTermsOnInterval(Bucket buckets, ChartType
	 * chartType, String interval, Map<KeyData, Object> responseMap) { Calendar cal
	 * = Calendar.getInstance();
	 * cal.setTimeInMillis(Long.parseLong(buckets.getKeyAsString())); String key =
	 * null; if (interval.equals(ElasticSearchConstants.DAY)) { int day =
	 * cal.get(Calendar.DAY_OF_MONTH); int month = cal.get(Calendar.MONTH) + 1;
	 * 
	 * key = day + "/" + month; } else if
	 * (interval.equals(ElasticSearchConstants.HOUR)) { int hour =
	 * cal.get(Calendar.HOUR_OF_DAY); String suffix = "AM"; if
	 * (cal.get(Calendar.AM_PM) > 0) suffix = "PM";
	 * 
	 * key = String.valueOf(hour + 1) + suffix;
	 * 
	 * } Map<String, Object> innerResponseMap = new HashMap<>();
	 * 
	 * for (Terms.Bucket bucket : ((ParsedLongTerms) buckets).getBuckets()) {
	 * 
	 * Map<String, Aggregation> valueMap = bucket.getAggregations().getAsMap();
	 * Object val = null;
	 * 
	 * for (Map.Entry<String, Aggregation> aggregation : valueMap.entrySet()) { if
	 * (aggregation.getKey().contains(ElasticProperties.Query.SUM.toLowerCase()) ) {
	 * ParsedSum sum = (ParsedSum) aggregation.getValue(); val = sum.getValue(); }
	 * else if
	 * (aggregation.getKey().contains(ElasticProperties.Query.AVG.toLowerCase()) ) {
	 * ParsedAvg avg = (ParsedAvg) aggregation.getValue(); val = avg.getValue();
	 * 
	 * } else if
	 * (aggregation.getKey().contains(ElasticProperties.Query.COUNT.toLowerCase( )))
	 * { ParsedValueCount count = (ParsedValueCount) aggregation.getValue(); val =
	 * count.getValue();
	 * 
	 * }
	 * 
	 * } innerResponseMap.put(bucket.getKeyAsString(), val); } responseMap.put(key,
	 * innerResponseMap);
	 * 
	 * }
	 */

	/*
	 * private Map<KeyData, Object> parseDateHistogramBasedOnInterval(Bucket bucket,
	 * ChartType chartType, String interval) { Map<KeyData, Object> responseMap =
	 * new HashMap<>(); Calendar cal = Calendar.getInstance();
	 * cal.setTimeInMillis(Long.parseLong(bucket.getKeyAsString())); String key =
	 * null; Object val = null; if (interval.equals(ElasticSearchConstants.DAY)) {
	 * int day = cal.get(Calendar.DAY_OF_MONTH); int month = cal.get(Calendar.MONTH)
	 * + 1;
	 * 
	 * key = day + "/" + month; val = getAggregationValue(bucket);
	 * 
	 * } else if (interval.equals(ElasticSearchConstants.HOUR)) { int hour =
	 * cal.get(Calendar.HOUR_OF_DAY); String suffix = "AM"; if
	 * (cal.get(Calendar.AM_PM) > 0) suffix = "PM"; val =
	 * getAggregationValue(bucket);
	 * 
	 * key = String.valueOf(hour + 1) + suffix;
	 * 
	 * } responseMap.put(key, val); return responseMap;
	 * 
	 * }
	 */

	/*
	 * private Object getAggregationValue(Bucket bucket) { Map<String, Aggregation>
	 * valueMap = bucket.getAggregations().getAsMap(); Object val = null;
	 * 
	 * for (Map.Entry<String, Aggregation> aggregation : valueMap.entrySet()) { if
	 * (aggregation.getKey().contains(ElasticProperties.Query.SUM.toLowerCase()) ) {
	 * ParsedSum sum = (ParsedSum) aggregation.getValue(); val = sum.getValue(); }
	 * else if
	 * (aggregation.getKey().contains(ElasticProperties.Query.AVG.toLowerCase()) ) {
	 * ParsedAvg avg = (ParsedAvg) aggregation.getValue(); val = avg.getValue();
	 * 
	 * } else if
	 * (aggregation.getKey().contains(ElasticProperties.Query.COUNT.toLowerCase( )))
	 * { ParsedValueCount count = (ParsedValueCount) aggregation.getValue(); val =
	 * count.getValue();
	 * 
	 * } } return val; }
	 */

	private Map<KeyData, Object> parseParseLongTerms(ParsedLongTerms aggregations, ChartType chartType,
			Map<String, String> labelMap) {

		Map<KeyData, Object> keyValueMap = new HashMap<>();

		for (Terms.Bucket bucket : aggregations.getBuckets()) {
			KeyData keyData = new KeyData();
			KeyData valueData = new KeyData();

			String key = bucket.getKey().toString();

			Map<String, Aggregation> valueMap = bucket.getAggregations().getAsMap();
			Object val = null;
			String valueLabel = null;
			for (Map.Entry<String, Aggregation> aggregation : valueMap.entrySet()) {
				if (aggregation.getKey().contains(ElasticProperties.Query.SUM.toLowerCase())) {
					ParsedSum sum = (ParsedSum) aggregation.getValue();
					val = sum.getValue();
					valueLabel = ElasticProperties.Query.SUM.toLowerCase();
				} else if (aggregation.getKey().contains(ElasticProperties.Query.AVG.toLowerCase())) {
					ParsedAvg avg = (ParsedAvg) aggregation.getValue();
					val = avg.getValue();
					valueLabel = ElasticProperties.Query.SUM.toLowerCase();

				} else if (aggregation.getKey().contains(ElasticProperties.Query.COUNT.toLowerCase())) {
					ParsedValueCount count = (ParsedValueCount) aggregation.getValue();
					val = count.getValue();
					valueLabel = ElasticProperties.Query.SUM.toLowerCase();

				}

			}
			keyData.setKey(key);
			keyData.setLabel(labelMap.get(ElasticProperties.Query.TERM.toLowerCase()));
			valueData.setKey(val);
			valueData.setLabel(labelMap.get(valueLabel));
			keyValueMap.put(keyData, valueData);

		}
		return keyValueMap;

	}

	private Double getFormattedDouble(double val) {
		return (Math.round(new Double(val).isInfinite() ? 0.0 : new Double(val) * 100.0) / 100.0);
	}

	@Override
	public ObjectNode getChartConfigurationQuery(AggregateRequestDto request, JsonNode query, String indexName,
			String interval) {
		String aggrQuery = query.get(Constants.JsonPaths.AGGREGATION_QUERY).asText();
		if (interval != null && !interval.isEmpty())
			aggrQuery = aggrQuery.replace(Constants.JsonPaths.INTERVAL_VAL, interval);
		String rqMs = query.get(Constants.JsonPaths.REQUEST_QUERY_MAP).asText();
		String dateReferenceField = query.get(Constants.JsonPaths.DATE_REF_FIELD).asText();
		JsonNode requestQueryMaps = null;
		ObjectNode objectNode = null;
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> esFilterMap = new HashMap<>();
		try {
			requestQueryMaps = new ObjectMapper().readTree(rqMs);
			request.setEsFilters(esFilterMap);
			if (query.get(Constants.JsonPaths.MODULE).asText().equals(Constants.Modules.COMMON)
					&& !request.getModuleLevel().equals(Constants.Modules.HOME_REVENUE)
					&& !request.getModuleLevel().equals(Constants.Modules.HOME_SERVICES)) {
				request.getFilters().put(Constants.Filters.MODULE, request.getModuleLevel());
			}
			Iterator<Entry<String, Object>> filtersItr = request.getFilters().entrySet().iterator();
			while (filtersItr.hasNext()) {
				Entry<String, Object> entry = filtersItr.next();
				if (!String.valueOf(entry.getValue()).equals(Constants.Filters.FILTER_ALL)) {
					String esQueryKey = requestQueryMaps.get(entry.getKey()).asText();
					request.getEsFilters().put(esQueryKey, entry.getValue());
				}
			}
			ElasticSearchDictator dictator = elasticSearchDao.createSearchDictatorV2(request, indexName, "",
					dateReferenceField);
			SearchRequest searchRequest = elasticSearchDao.buildElasticSearchQuery(dictator);
			JsonNode querySegment = mapper.readTree(searchRequest.source().toString());
			objectNode = (ObjectNode) querySegment;
			JsonNode aggrNode = mapper.readTree(aggrQuery).get(Constants.JsonPaths.AGGS);
			objectNode.put(Constants.JsonPaths.AGGS, mapper.readTree(aggrQuery).get(Constants.JsonPaths.AGGS));
		} catch (Exception ex) {
			logger.error("Encountered an Exception while parsing the JSON : {} ", ex.getMessage());
		}
		return objectNode;

	}

}
