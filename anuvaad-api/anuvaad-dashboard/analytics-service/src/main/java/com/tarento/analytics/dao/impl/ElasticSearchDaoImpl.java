package com.tarento.analytics.dao.impl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHost;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.MultiSearchRequest;
import org.elasticsearch.action.search.MultiSearchResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.ExistsQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.index.query.TermsQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.BucketOrder;
import org.elasticsearch.search.aggregations.PipelineAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogramAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogramInterval;
import org.elasticsearch.search.aggregations.bucket.histogram.ExtendedBounds;
import org.elasticsearch.search.aggregations.bucket.nested.NestedAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.avg.AvgAggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.sum.SumAggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.valuecount.ValueCountAggregationBuilder;
import org.elasticsearch.search.aggregations.pipeline.cumulativesum.CumulativeSumPipelineAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tarento.analytics.constant.ElasticSearchConstants;
import com.tarento.analytics.dao.ElasticSearchDao;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.SearchDto;
import com.tarento.analytics.model.ElasticSearchDictator;
import com.tarento.analytics.utils.ElasticProperties;
import com.tarento.analytics.utils.ElasticSearchClient;

@Component
public class ElasticSearchDaoImpl implements ElasticSearchDao {

	@Autowired
	private ElasticSearchClient elasticSearchClient;

	@Autowired
	public ObjectMapper mapper;

	private static String elasticHost;
	private static int elasticPort;
	private static final String REST_SCHEME = "http";
	private static final String REST_SCHEME2 = "https";
	private static RestHighLevelClient client;
	private static RestHighLevelClient alternateClient;
	private String indexName;
	private String docType;

	public String getIndexName() {
		return indexName;
	}

	public void setIndexName(String indexName) {
		this.indexName = indexName;
	}

	public String getDocType() {
		return docType;
	}

	public void setDocType(String docType) {
		this.docType = docType;
	}

	public static final Logger logger = LoggerFactory.getLogger(ElasticSearchDaoImpl.class);

	public ElasticSearchDaoImpl(@Value("${services.esindexer.primary.host.name}") String elasticsearchHost,
			@Value("${services.esindexer.primary.host.port}") int elasticsearchPort) {
		elasticHost = elasticsearchHost;
		elasticPort = elasticsearchPort;
		client = getClientForElastic();

	}

	@Override
	public Map<String, Object> getDataByIdentifier(String index, String type, String identifier) {
		RestHighLevelClient restHighLevelClient = elasticSearchClient.getClient();
		long startTime = System.currentTimeMillis();
		logger.info("ElasticSearchUtil getDataByIdentifier method started at == {} for Type {} ", startTime, type);
		GetResponse response = null;

		try {
			if (StringUtils.isBlank(index) || StringUtils.isBlank(identifier)) {
				logger.error("Invalid request is coming.");
				return new HashMap<>();
			} else if (StringUtils.isBlank(type)) {
				response = restHighLevelClient.get(new GetRequest(index).type(type));

			} else {
				response = restHighLevelClient.get(new GetRequest(index, type, identifier));
			}
			if (response == null || null == response.getSource()) {
				return new HashMap<>();
			}
			long stopTime = System.currentTimeMillis();
			long elapsedTime = stopTime - startTime;
			logger.info(
					"ElasticSearchUtil getDataByIdentifier method end at ==  {} for Type {} , Total time elapsed = {} ",
					stopTime, type, elapsedTime);
			return response.getSource();
		} catch (IOException ex) {
			logger.error("Exception in getDataByIdentifier {} ", ex.getMessage());
		} finally {
			try {
				restHighLevelClient.close();
			} catch (IOException e) {
				logger.error("Exception in getDataByIdentifier {} ", e.getMessage());
			}
		}
		return null;
	}

	@Override
	public Map<String, Object> searchData(String index, String type, Map<String, Object> searchData) {
		RestHighLevelClient client = elasticSearchClient.getClient();

		long startTime = System.currentTimeMillis();
		logger.info("ElasticSearchUtil searchData method started at == {}  for Type  {} ", startTime, type);
		SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
		Iterator<Entry<String, Object>> itr = searchData.entrySet().iterator();
		while (itr.hasNext()) {
			Entry<String, Object> entry = itr.next();
			sourceBuilder.query(QueryBuilders.commonTermsQuery(entry.getKey(), entry.getValue()));
		}

		SearchResponse sr = null;
		try {
			sr = client.search(new SearchRequest(index).types(type).source(sourceBuilder));

		} catch (IOException ex) {
			logger.error("Error while execution in Elasticsearch", ex);
		}

		if (sr != null && (sr.getHits() == null || sr.getHits().getTotalHits() == 0)) {
			return new HashMap<>();
		}
		sr.getHits().getAt(0).getSourceAsMap();
		long stopTime = System.currentTimeMillis();
		long elapsedTime = stopTime - startTime;

		logger.info("ElasticSearchUtil searchData method end at == {}  for Type  {} ,Total time elapsed = {} ",
				stopTime, type, elapsedTime);
		try {
			client.close();
		} catch (IOException e) {
			logger.error("Error while closing the client");
		}
		return sr.getAggregations().asList().get(0).getMetaData();
	}

	@SuppressWarnings("rawtypes")
	@Override
	public Map<String, Object> complexSearch(SearchDto searchDTO, String index, String... type) {
		RestHighLevelClient restHighLevelClient = elasticSearchClient.getClient();

		long startTime = System.currentTimeMillis();
		logger.info("ElasticSearchUtil complexSearch method started at == {} ", startTime);

		// Map<String, Float> constraintsMap = getConstraints(searchDTO);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().size(0);
		BoolQueryBuilder query = new BoolQueryBuilder();

		if (!StringUtils.isBlank(searchDTO.getQuery())) {
			query.must(QueryBuilders.simpleQueryStringQuery(searchDTO.getQuery()).field("all_fields"));
		}

		// apply sorting
		if (searchDTO.getSortBy() != null && searchDTO.getSortBy().size() > 0) {

			for (Map.Entry<String, String> entry : searchDTO.getSortBy().entrySet()) {
				SortBuilder sortB = SortBuilders.fieldSort(entry.getKey()).order(getSortOrder(entry.getValue()));
				searchSourceBuilder.sort(sortB);

			}
		}

		// apply the fields filter
		searchSourceBuilder.fetchSource(
				searchDTO.getFields() != null ? searchDTO.getFields().stream().toArray(String[]::new) : null,
				searchDTO.getExcludedFields() != null ? searchDTO.getExcludedFields().stream().toArray(String[]::new)
						: null);

		// setting the offset
		if (searchDTO.getOffset() != null) {
			searchSourceBuilder.from(searchDTO.getOffset());
		}

		// setting the limit
		if (searchDTO.getLimit() != null) {
			searchSourceBuilder.size(searchDTO.getLimit());
		}

		// apply additional properties
		if (searchDTO.getAdditionalProperties() != null && searchDTO.getAdditionalProperties().size() > 0) {
			for (Map.Entry<String, Object> entry : searchDTO.getAdditionalProperties().entrySet()) {
				addAdditionalProperties(query, entry);
			}
		}

		searchSourceBuilder.query(query);

		if (null != searchDTO.getFacets() && !searchDTO.getFacets().isEmpty()) {
			// addAggregations(searchSourceBuilder, searchDTO.getFacets());
		}
		logger.info("calling search builder====== {} ", searchSourceBuilder);
		SearchResponse response = null;
		SearchRequest searchReq = new SearchRequest(index).types(type).source(searchSourceBuilder);
		List<Map<String, Object>> esSource = new ArrayList<>();

		try {
			response = restHighLevelClient.search(searchReq);

			if (response != null) {
				SearchHits hits = response.getHits();
				for (SearchHit hit : hits) {
					esSource.add(hit.getSourceAsMap());
				}
			}
		} catch (IOException e) {
			logger.error("Exception in complexSearch {} ", e.getMessage());
		}
		return null;

	}

	@SuppressWarnings("unchecked")
	private void addAggregations(SearchSourceBuilder searchSourceBuilder, Map<String, Object> aggregations) {
		long startTime = System.currentTimeMillis();
		logger.info("ElasticSearchUtil addAggregations method started at == {} ", startTime);
		for (Map.Entry<String, Object> entry : aggregations.entrySet()) {

			String key = entry.getKey();
			String interval = "interval";
			for (Map.Entry<String, Object> en : aggregations.entrySet()) {
				if ("DATE_HISTOGRAM".equalsIgnoreCase(en.getKey())) {
					Map<String, String> aggsVal = (Map<String, String>) en.getValue();
					DateHistogramInterval dateHistogramInterval = null;
					if (aggsVal.get(interval).equals("day")) {
						dateHistogramInterval = DateHistogramInterval.DAY;
					} else if (aggsVal.get(interval).equals("hour")) {
						dateHistogramInterval = DateHistogramInterval.HOUR;

					} else if (aggsVal.get(interval).equals("month")) {
						dateHistogramInterval = DateHistogramInterval.MONTH;

					} else if (aggsVal.get(interval).equals("year")) {
						dateHistogramInterval = DateHistogramInterval.YEAR;

					}
					searchSourceBuilder.aggregation(AggregationBuilders.dateHistogram(key).field(aggsVal.get("field"))
							.dateHistogramInterval(dateHistogramInterval));

				}
				/*
				 * else if ("TERMS".equalsIgnoreCase(en.getKey())) { Map<String, String> aggVal
				 * = (Map<String, String>) en.getValue(); for (Map.Entry<String, String> entryS
				 * : aggVal.entrySet()) { searchSourceBuilder.aggregation(AggregationBuilders.
				 * dateHistogram(key).field(aggsVal.get("field")) .dateHistogramInterval(Date));
				 * } }
				 */
			}

		}
		long stopTime = System.currentTimeMillis();
		long elapsedTime = stopTime - startTime;
		logger.info("ElasticSearchUtil addAggregations method end at == {} ,Total time elapsed = {} ", stopTime,
				elapsedTime);
	}

	@SuppressWarnings("unchecked")
	private void addAdditionalProperties(BoolQueryBuilder query, Entry<String, Object> entry) {
		long startTime = System.currentTimeMillis();
		logger.info("ElasticSearchUtil addAdditionalProperties method started at == {} ", startTime);
		String key = entry.getKey();

		if (key.equalsIgnoreCase("FILTERS")) {

			Map<String, Object> filters = (Map<String, Object>) entry.getValue();
			for (Map.Entry<String, Object> en : filters.entrySet()) {
				createFilterESOpperation(en, query);
			}
		} else if (key.equalsIgnoreCase("EXISTS") || key.equalsIgnoreCase("NOT_EXISTS")) {
			createESOpperation(entry, query);
		}
		long stopTime = System.currentTimeMillis();
		long elapsedTime = stopTime - startTime;
		logger.info("ElasticSearchUtil addAdditionalProperties method end at == {} ,Total time elapsed =  {}", stopTime,
				elapsedTime);
	}

	/** Method to create EXISTS and NOT EXIST FILTER QUERY . */
	@SuppressWarnings("unchecked")
	private void createESOpperation(Entry<String, Object> entry, BoolQueryBuilder query) {

		String operation = entry.getKey();
		List<String> existsList = (List<String>) entry.getValue();

		if (operation.equalsIgnoreCase("EXISTS")) {
			for (String name : existsList) {
				query.must(createExistQuery(name));
			}
		} else if (operation.equalsIgnoreCase("NOT_EXISTS")) {
			for (String name : existsList) {
				query.mustNot(createExistQuery(name));
			}
		}
	}

	/** Method to create CommonTermQuery , multimatch and Range Query. */
	@SuppressWarnings("unchecked")
	private void createFilterESOpperation(Entry<String, Object> entry, BoolQueryBuilder query) {

		String key = entry.getKey();
		Object val = entry.getValue();
		if (val instanceof List) {
			if (!((List) val).isEmpty()) {
				if (((List) val).get(0) instanceof String) {
					((List<String>) val).replaceAll(String::toLowerCase);
					query.must(createTermsQuery(key, (List<String>) val));
				} else {
					query.must(createTermsQuery(key, (List) val));
				}
			}
		} else if (val instanceof Map) {
			Map<String, Object> value = (Map<String, Object>) val;
			Map<String, Object> rangeOperation = new HashMap<>();
			Map<String, Object> lexicalOperation = new HashMap<>();
			for (Map.Entry<String, Object> it : value.entrySet()) {
				String operation = it.getKey();
				if (operation.startsWith(ElasticSearchConstants.LT)
						|| operation.startsWith(ElasticSearchConstants.GT)) {
					rangeOperation.put(operation, it.getValue());
				} else if (operation.startsWith(ElasticSearchConstants.STARTS_WITH)
						|| operation.startsWith(ElasticSearchConstants.ENDS_WITH)) {
					lexicalOperation.put(operation, it.getValue());
				}
			}
			if (!(rangeOperation.isEmpty())) {
				query.must(createRangeQuery(key, rangeOperation));
			}
			if (!(lexicalOperation.isEmpty())) {
				query.must(createLexicalQuery(key, lexicalOperation));
			}

		} else if (val instanceof String) {
			query.must(createTermQuery(key, ((String) val).toLowerCase()));
		} else {
			query.must(createTermQuery(key, val));
		}
	}

	private static TermQueryBuilder createTermQuery(String name, Object text) {

		return QueryBuilders.termQuery(name, text);

	}

	@SuppressWarnings("unchecked")
	private static TermsQueryBuilder createTermsQuery(String key, List values) {

		return QueryBuilders.termsQuery(key, (values).stream().toArray(Object[]::new));

	}

	private static Map<String, Float> getConstraints(SearchDto searchDTO) {
		if (null != searchDTO.getSoftConstraints() && !searchDTO.getSoftConstraints().isEmpty()) {
			return searchDTO.getSoftConstraints().entrySet().stream()
					.collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue().floatValue()));
		}
		return Collections.emptyMap();
	}

	@Override
	public boolean healthCheck() {
		return false;
	}

	/// New Methods for Elastic Search Query Builders

	private RangeQueryBuilder createRangeQuery(String name, Map<String, Object> rangeOperation) {

		RangeQueryBuilder rangeQueryBuilder = QueryBuilders.rangeQuery(name);
		for (Map.Entry<String, Object> it : rangeOperation.entrySet()) {
			if (it.getKey().equalsIgnoreCase(ElasticSearchConstants.LTE)) {
				rangeQueryBuilder.lte(it.getValue());
			} else if (it.getKey().equalsIgnoreCase(ElasticSearchConstants.LT)) {
				rangeQueryBuilder.lt(it.getValue());
			} else if (it.getKey().equalsIgnoreCase(ElasticSearchConstants.GTE)) {
				rangeQueryBuilder.gte(it.getValue());
			} else if (it.getKey().equalsIgnoreCase(ElasticSearchConstants.GT)) {
				rangeQueryBuilder.gt(it.getValue());
			}
		}

		return rangeQueryBuilder;
	}

	private SortOrder getSortOrder(String value) {
		return value.equalsIgnoreCase(ElasticSearchConstants.ASC_ORDER) ? SortOrder.ASC : SortOrder.DESC;
	}

	private QueryBuilder createLexicalQuery(String key, Map<String, Object> rangeOperation) {
		QueryBuilder queryBuilder = null;
		for (Map.Entry<String, Object> it : rangeOperation.entrySet()) {
			if (it.getKey().equalsIgnoreCase(ElasticSearchConstants.STARTS_WITH)) {

				queryBuilder = QueryBuilders.prefixQuery(key, (String) it.getValue());
			} else if (it.getKey().equalsIgnoreCase(ElasticSearchConstants.ENDS_WITH)) {
				String endsWithRegex = "~" + it.getValue();
				queryBuilder = QueryBuilders.regexpQuery(key, endsWithRegex);
			}
		}
		return queryBuilder;
	}

	private ExistsQueryBuilder createExistQuery(String name) {
		return QueryBuilders.existsQuery(name);
	}
	/*
	 * 
	 * @SuppressWarnings("unchecked")
	 * 
	 * @Override public ElasticSearchDictator
	 * createSearchDictator(AggregateRequestDto dto, String tenant) throws Exception
	 * { ElasticSearchDictator dictator = new ElasticSearchDictator(); if
	 * (dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_WRT_TIME) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_DAY_WISE) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_REASON) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_GENDER) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_AGEGROUP) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_TIME) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_TOP_PERFORMING) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_LEAST_PERFORMING)) {
	 * dictator.setIndexName(tenant + ratingElasticIndexName);
	 * dictator.setDocumentType(ratingElasticDocType); } else {
	 * dictator.setIndexName(tenant + transactionElasticIndexName);
	 * dictator.setDocumentType(transactionElasticDocType); } if
	 * (StringUtils.isNotBlank(dto.getServiceApi())) {
	 * dictator.setVisualisationName(dto.getServiceApi()); } Map<String, Map<String,
	 * List<Object>>> queryMap = new HashMap<>(); if (dto.getCustomData() != null) {
	 * for (Map.Entry<String, Object> entry : dto.getCustomData().entrySet()) { if
	 * (StringUtils.isNotBlank(entry.getKey()) && entry.getValue() != null) {
	 * List<Object> valueList = new ArrayList<>();
	 * 
	 * if (entry.getValue() instanceof ArrayList) {
	 * 
	 * List<Object> valueArray = (ArrayList<Object>) entry.getValue();
	 * 
	 * for (Object value : valueArray) { valueList.add(value); } } else {
	 * valueList.add(entry.getValue()); } if (!valueList.isEmpty()) { String
	 * entryKey = entry.getKey(); if
	 * (dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_WRT_TIME) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_DAY_WISE) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_REASON) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_GENDER) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_AGEGROUP) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_TIME) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_TOP_PERFORMING) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_LEAST_PERFORMING)) {
	 * 
	 * entryKey = "storeId"; } if
	 * (queryMap.containsKey(ElasticProperties.Query.MATCH_CONDITION)) { Map<String,
	 * List<Object>> queryInnerMap = queryMap
	 * .get(ElasticProperties.Query.MATCH_CONDITION); queryInnerMap.put(entryKey,
	 * valueList); } else { Map<String, List<Object>> queryInnerMap = new
	 * HashMap<>(); queryInnerMap.put(entryKey, valueList);
	 * queryMap.put(ElasticProperties.Query.MATCH_CONDITION, queryInnerMap); } } } }
	 * }
	 * 
	 * if (dto.getDates() != null) { if
	 * (StringUtils.isNotBlank(dto.getDates().getStartDate()) &&
	 * StringUtils.isNotBlank(dto.getDates().getEndDate())) { List<Object> valueList
	 * = new ArrayList<>();
	 * 
	 * valueList.add(dto.getDates().getStartDate());
	 * valueList.add(dto.getDates().getEndDate()); Map<String, List<Object>>
	 * queryInnerMap = new HashMap<>(); if
	 * (dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_WRT_TIME) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_REASON) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_GENDER) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_AGEGROUP) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_STORE_TIME) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_TOP_PERFORMING) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_LEAST_PERFORMING) ||
	 * dto.getServiceApi().equals(ServiceApiConstants.CSAT_DAY_WISE)) {
	 * queryInnerMap.put(ElasticProperties.Query.FEEDBACK_DATE_TIME, valueList); }
	 * else { queryInnerMap.put(ElasticProperties.Query.TRANSACTION_DATE_FIELD,
	 * valueList); }
	 * 
	 * queryMap.put(ElasticProperties.Query.RANGE_CONDITION, queryInnerMap); } }
	 * dictator.setQueryMap(queryMap);
	 * 
	 */
	/*
	 * Map<String,Map<String,Map<String,Object>>> aggregationMap = new HashMap<>();
	 * Map<String,Map<String, String>> innerMap = new HashMap<>(); Map<String,
	 * String> deepInnerMap = new HashMap<>();
	 *//*
		 * 
		 * 
		 * return dictator;
		 * 
		 * }
		 */

	@SuppressWarnings("unchecked")
	@Override
	public SearchRequest buildElasticSearchQuery(ElasticSearchDictator dictator) {
		SearchSourceBuilder searchBuilder = buildSearchSourceBuilder();
		BoolQueryBuilder boolQuery = buildBoolQuery();
		String localDateStartRange = null;
		String localDateEndRange = null;
		if (dictator.getQueryMap().containsKey(ElasticProperties.Query.RANGE_CONDITION)) {

			String searchParamRange = null;
			Map<String, List<Object>> innerMap = dictator.getQueryMap().get(ElasticProperties.Query.RANGE_CONDITION);
			for (Entry<String, List<Object>> en : innerMap.entrySet()) {
				searchParamRange = en.getKey();
				localDateStartRange = (String) en.getValue().get(0);
				localDateEndRange = (String) en.getValue().get(1);
			}

			addMustOnBoolQuery(boolQuery, buildRangeQuery(searchParamRange, localDateStartRange, localDateEndRange));

		}

		if (dictator.getQueryMap().containsKey(ElasticProperties.Query.MATCH_CONDITION)) {
			String searchTermField = null;
			Map<String, List<Object>> innerMap = dictator.getQueryMap().get(ElasticProperties.Query.MATCH_CONDITION);
			for (Entry<String, List<Object>> en : innerMap.entrySet()) {
				searchTermField = en.getKey();
				addFilterTermsOnBoolQuery(boolQuery, buildTermsQuery(searchTermField, en.getValue()));
			}
		}

		addQueryToSearchBuilder(searchBuilder, boolQuery);

		DateHistogramAggregationBuilder dateAggBuilder = null;
		AvgAggregationBuilder avgAggBuilder = null;
		SumAggregationBuilder sumAggBuilder = null;
		TermsAggregationBuilder termsAggBuilder = null;
		NestedAggregationBuilder nestedAggBuilder = null;
		ValueCountAggregationBuilder valueCountAggBuilder = null;
		if (dictator.getQueryAggregationMap() == null) {
			return new SearchRequest(dictator.getIndexName()).types(dictator.getDocumentType()).source(searchBuilder);
		}

		for (Map.Entry<String, Object> itr : dictator.getQueryAggregationMap().entrySet()) {

			String aggregationType = itr.getKey();
			Object value = itr.getValue();
			if (ElasticProperties.Query.NESTED.equalsIgnoreCase(aggregationType)) {
				Map<String, Object> nestedMap = null;
				if (value instanceof HashMap) {
					nestedMap = (HashMap<String, Object>) value;
				} else if (value instanceof LinkedHashMap) {
					nestedMap = (LinkedHashMap<String, Object>) value;
				}
				if (nestedMap != null) {
					String aggregationName = String.valueOf(nestedMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
					nestedAggBuilder = buildNestedAggregationBuilder(aggregationName, nestedMap);
				}

			} else if (ElasticProperties.Query.SUM.equalsIgnoreCase(aggregationType)) {
				Map<String, Object> sumMap = null;
				if (value instanceof HashMap) {
					sumMap = (HashMap<String, Object>) value;
				} else if (value instanceof LinkedHashMap) {
					sumMap = (LinkedHashMap<String, Object>) value;
				}
				if (sumMap != null) {
					String aggregationName = String.valueOf(sumMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
					sumAggBuilder = buildSumAggregation(aggregationName,
							String.valueOf(sumMap.get(ElasticProperties.Query.FIELD.toLowerCase())));
				}
			} else if (ElasticProperties.Query.TERM.equalsIgnoreCase(aggregationType)) {
				Map<String, Object> termMap = null;
				if (value instanceof HashMap) {
					termMap = (HashMap<String, Object>) value;
				} else if (value instanceof LinkedHashMap) {
					termMap = (LinkedHashMap<String, Object>) value;

				}
				if (termMap != null) {
					String aggregationName = String.valueOf(termMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
					termsAggBuilder = buildTermAggregation(aggregationName, termMap);
				}

			} else if (ElasticProperties.Query.DATE_HISTOGRAM.equalsIgnoreCase(aggregationType)) {
				Map<String, Object> histogramMap = null;

				if (value instanceof HashMap) {
					histogramMap = (HashMap<String, Object>) value;
				} else if (value instanceof LinkedHashMap) {
					histogramMap = (LinkedHashMap<String, Object>) value;

				}
				if (histogramMap != null) {
					String aggregationName = String
							.valueOf(histogramMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
					dateAggBuilder = buildDateHistogramAggregation(aggregationName,
							histogramMap.get(ElasticProperties.Query.FIELD.toLowerCase()).toString(),
							histogramMap.get(ElasticProperties.Query.INTERVAL.toLowerCase()).toString().toUpperCase(),
							Long.parseLong(localDateStartRange), Long.parseLong(localDateEndRange));
				}

			} else if (ElasticProperties.Query.COUNT.equalsIgnoreCase(aggregationType)) {
				Map<String, Object> countAggMap = null;

				if (value instanceof HashMap) {
					countAggMap = (HashMap<String, Object>) value;
				} else if (value instanceof LinkedHashMap) {
					countAggMap = (LinkedHashMap<String, Object>) value;

				}
				if (countAggMap != null) {
					String countField = countAggMap.get(ElasticProperties.Query.FIELD.toLowerCase()).toString();
					String countAggName = String.valueOf(countAggMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
					valueCountAggBuilder = buildCountsAggregationQuery(countAggName, countField);
				}
			} else if (ElasticProperties.Query.AGGREGATION_CONDITION.equalsIgnoreCase(aggregationType)) {

				Map<String, Object> firstLevelAggMap = (LinkedHashMap<String, Object>) value;
				for (Map.Entry<String, Object> firstLevelItrEntry : firstLevelAggMap.entrySet()) {

					String firstLevelEntryKey = firstLevelItrEntry.getKey();
					Object firstLevelEntryValue = firstLevelItrEntry.getValue();
					if (ElasticProperties.Query.SUM.equalsIgnoreCase(firstLevelEntryKey)) {
						Map<String, Object> sumAggMap = (LinkedHashMap<String, Object>) firstLevelEntryValue;
						String sumField = sumAggMap.get(ElasticProperties.Query.FIELD.toLowerCase()).toString();
						String sumAggName = String.valueOf(sumAggMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
						if (termsAggBuilder != null) {
							termsAggBuilder = buildSubSumAggreationForTerms(termsAggBuilder, sumAggName, sumField);
						} else if (dateAggBuilder != null) {
							dateAggBuilder = buildSubSumAggreationForDateHistogram(dateAggBuilder, sumAggName,
									sumField);
						}
					} else if (ElasticProperties.Query.AVG.equalsIgnoreCase(firstLevelEntryKey)) {
						Map<String, Object> avgAggMap = (LinkedHashMap<String, Object>) firstLevelEntryValue;
						String avgField = avgAggMap.get(ElasticProperties.Query.FIELD.toLowerCase()).toString();
						String avgAggName = String.valueOf(avgAggMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
						if (termsAggBuilder != null) {
							termsAggBuilder = buildSubAvgAggreationForTerms(termsAggBuilder, avgAggName, avgField);
						} else if (dateAggBuilder != null) {
							dateAggBuilder = buildSubSumAggreationForDateHistogram(dateAggBuilder, avgAggName,
									avgField);
						}
					} else if (ElasticProperties.Query.COUNT.equalsIgnoreCase(firstLevelEntryKey)) {
						Map<String, Object> countAggMap = (LinkedHashMap<String, Object>) firstLevelEntryValue;
						String countField = countAggMap.get(ElasticProperties.Query.FIELD.toLowerCase()).toString();
						String countAggName = String
								.valueOf(countAggMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
						if (termsAggBuilder != null) {
							termsAggBuilder = buildSubCountAggregationForTerms(termsAggBuilder, countAggName,
									countField);
						} else if (dateAggBuilder != null) {
							dateAggBuilder = buildSubCountAggregationForDateHistogram(dateAggBuilder, countAggName,
									countField);
						}
					} else if (ElasticProperties.Query.TERM.equalsIgnoreCase(firstLevelEntryKey)) {
						Map<String, Object> subTermAggMap = (LinkedHashMap<String, Object>) firstLevelEntryValue;
						String subTermAggName = String
								.valueOf(subTermAggMap.get(ElasticProperties.Query.LABEL.toLowerCase()));
						if (nestedAggBuilder != null) {
							buildSubTermsAggregationForNested(nestedAggBuilder, subTermAggName,
									subTermAggMap.get(ElasticProperties.Query.FIELD.toLowerCase()).toString());
						} else if (dateAggBuilder != null) {
							buildSubTermsAggregationForHistogram(dateAggBuilder, subTermAggName,
									subTermAggMap.get(ElasticProperties.Query.FIELD.toLowerCase()).toString());
						} else if (termsAggBuilder != null) {
							buildSubTermsAggregationForTerms(termsAggBuilder, subTermAggName,
									subTermAggMap.get(ElasticProperties.Query.FIELD.toLowerCase()).toString());
						}

					} else if (ElasticProperties.Query.AGGREGATION_CONDITION.equals(firstLevelEntryKey.toUpperCase())) {

						Map<String, Object> secondLevelAggMap = (LinkedHashMap<String, Object>) firstLevelEntryValue;
						for (Map.Entry<String, Object> secondLevelItrEntry : secondLevelAggMap.entrySet()) {
							String secondLevelItrEntryKey = secondLevelItrEntry.getKey();
							Object secondLevelItrEntryValue = secondLevelItrEntry.getValue();
							if (ElasticProperties.Query.SUM.equalsIgnoreCase(secondLevelItrEntryKey)) {
								Map<String, Object> subSumAggMap = (LinkedHashMap<String, Object>) secondLevelItrEntryValue;

								String subSumField = subSumAggMap.get(ElasticProperties.Query.FIELD.toLowerCase())
										.toString();
								String subSumAggName = String
										.valueOf(subSumAggMap.get(ElasticProperties.Query.LABEL.toLowerCase()));

								if (nestedAggBuilder != null) {
									List<AggregationBuilder> aggBuilders = nestedAggBuilder.getSubAggregations();
									for (AggregationBuilder aggregationBuilder : aggBuilders) {

										if (aggregationBuilder instanceof TermsAggregationBuilder) {
											TermsAggregationBuilder subTermAggBuilder = (TermsAggregationBuilder) aggregationBuilder;
											subTermAggBuilder = buildSubSumAggreationForTerms(subTermAggBuilder,
													subSumAggName, subSumField);

										}
									}
								}
							} else if (ElasticProperties.Query.COUNT.equalsIgnoreCase(secondLevelItrEntryKey)) {
								Map<String, Object> subCountAggMap = (LinkedHashMap<String, Object>) secondLevelItrEntryValue;

								String subCountField = subCountAggMap.get(ElasticProperties.Query.FIELD.toLowerCase())
										.toString();
								String subCountAggName = String
										.valueOf(subCountAggMap.get(ElasticProperties.Query.LABEL.toLowerCase()));

								if (dateAggBuilder != null) {
									List<AggregationBuilder> aggBuilders = dateAggBuilder.getSubAggregations();
									for (AggregationBuilder aggregationBuilder : aggBuilders) {

										if (aggregationBuilder instanceof TermsAggregationBuilder) {
											TermsAggregationBuilder subTermAggBuilder = (TermsAggregationBuilder) aggregationBuilder;
											subTermAggBuilder = buildSubCountAggregationForTerms(subTermAggBuilder,
													subCountAggName, subCountField);
										}
									}
								}
							}
						}
					}
				}
			}
		}

		if (dateAggBuilder != null) {
			addAggregationToSearchBuilder(searchBuilder, dateAggBuilder);
		}
		if (sumAggBuilder != null) {
			addSumAggregationToSearchBuilder(searchBuilder, sumAggBuilder);
		}
		if (avgAggBuilder != null) {
			addAvgAggregationToSearchBuilder(searchBuilder, avgAggBuilder);
		}
		if (valueCountAggBuilder != null) {
			addValueCountAggregationToSearchBuilder(searchBuilder, valueCountAggBuilder);
		}
		if (termsAggBuilder != null) {
			addTermsAggregationToSearchBuilder(searchBuilder, termsAggBuilder);
		}
		if (nestedAggBuilder != null) {
			addNestedAggregationToSearchBuilder(searchBuilder, nestedAggBuilder);
		}
		return new SearchRequest(dictator.getIndexName()).types(dictator.getDocumentType()).source(searchBuilder);
	}

	private NestedAggregationBuilder buildSubTermsAggregationForNested(NestedAggregationBuilder nestedAggBuilder,
			String subAggregationName, String fieldName) {
		return nestedAggBuilder.subAggregation(AggregationBuilders.terms(subAggregationName).field(fieldName));

	}

	private void addNestedAggregationToSearchBuilder(SearchSourceBuilder searchBuilder,
			NestedAggregationBuilder nestedAggBuilder) {
		searchBuilder.aggregation(nestedAggBuilder);
	}

	private RangeQueryBuilder buildRangeQuery(String fieldName, Object startRange, Object endRange) {
		return QueryBuilders.rangeQuery(fieldName).gte(startRange).lte(endRange);
	}

	private TermQueryBuilder buildTermQuery(String fieldName, Object fieldValue) {
		return QueryBuilders.termQuery(fieldName, fieldValue);
	}

	private TermsQueryBuilder buildTermsQuery(String fieldName, List<Object> fieldValue) {
		return QueryBuilders.termsQuery(fieldName, fieldValue);
	}

	private MatchQueryBuilder buildMatchQuery(String fieldName, Object fieldValue) {
		return QueryBuilders.matchQuery(fieldName, fieldValue);
	}

	private ValueCountAggregationBuilder buildCountsAggregationQuery(String aggregationName, String fieldName) {
		return AggregationBuilders.count(aggregationName).field(fieldName);
	}

	private SumAggregationBuilder buildSumAggregation(String aggregationName, String fieldName) {
		return AggregationBuilders.sum(aggregationName).field(fieldName);
	}

	@SuppressWarnings("unchecked")
	private TermsAggregationBuilder buildTermAggregation(String aggregationName, Map<String, Object> paramMap) {
		TermsAggregationBuilder aggBuilder = AggregationBuilders.terms(aggregationName);
		for (Map.Entry<String, Object> param : paramMap.entrySet()) {
			if (param.getKey().equalsIgnoreCase(ElasticProperties.Query.FIELD)) {
				aggBuilder = aggBuilder.field((String) param.getValue());
			} else if (param.getKey().equalsIgnoreCase(ElasticProperties.Query.SIZE)) {
				aggBuilder = aggBuilder.size((Integer) param.getValue());
			} else if (param.getKey().equalsIgnoreCase(ElasticProperties.Query.ORDER)) {
				Map<String, Object> keyMap = (HashMap<String, Object>) param.getValue();
				BucketOrder order = null;
				for (Map.Entry<String, Object> valueMap : keyMap.entrySet()) {
					Map<String, String> orderMap = (HashMap<String, String>) valueMap.getValue();

					String key = valueMap.getKey() + "of" + orderMap.get(ElasticProperties.Query.FIELD.toLowerCase());

					order = BucketOrder.aggregation(key,
							orderMap.get("orderBy").equalsIgnoreCase(ElasticProperties.Query.ASC) ? true : false);
				}
				aggBuilder = aggBuilder.order(order);
			}
		}
		return aggBuilder;

	}

	private AvgAggregationBuilder buildAvgAggregation(String aggregationName, String fieldName) {
		return AggregationBuilders.avg(aggregationName).field(fieldName);
	}

	private NestedAggregationBuilder buildNestedAggregationBuilder(String aggregationName,
			Map<String, Object> paramMap) {
		String pathName = paramMap.get(ElasticProperties.Query.PATH.toLowerCase()).toString();
		return AggregationBuilders.nested(aggregationName, pathName);
	}

	private AggregationBuilder buildSubTermForNestedAggregation(NestedAggregationBuilder nestedBuilder,
			String aggregationName, Map<String, Object> paramMap) {
		return nestedBuilder.subAggregation(buildTermAggregation(aggregationName, paramMap));

	}

	private DateHistogramAggregationBuilder buildDateHistogramAggregation(String aggregationName, String fieldName,
			String interval, Long boundMin, Long boundMax) {
		DateHistogramInterval dateHistogramInterval = null;
		if (ElasticProperties.Query.HOUR.equals(interval)) {
			dateHistogramInterval = DateHistogramInterval.HOUR;
		} else if (ElasticProperties.Query.DAY.equals(interval)) {
			dateHistogramInterval = DateHistogramInterval.DAY;
		} else if (ElasticProperties.Query.MINUTE.equals(interval)) {
			dateHistogramInterval = DateHistogramInterval.MINUTE;
		} else if (ElasticProperties.Query.MONTH.equals(interval)) {
			dateHistogramInterval = DateHistogramInterval.MONTH;

		}
		return AggregationBuilders.dateHistogram(aggregationName).field(fieldName)
				.dateHistogramInterval(dateHistogramInterval).format("epoch_millis")
				.extendedBounds(new ExtendedBounds(boundMin, boundMax));
	}

	private DateHistogramAggregationBuilder buildSubSumAggreationForDateHistogram(
			DateHistogramAggregationBuilder builder, String aggregationName, String fieldName) {
		return builder.subAggregation(AggregationBuilders.sum(aggregationName).field(fieldName));
	}

	private DateHistogramAggregationBuilder buildSubCummulativeSumAggreationForDateHistogram(
			DateHistogramAggregationBuilder builder, String aggregationName, String fieldName) {
		PipelineAggregationBuilder pipeLineAggregation = new CumulativeSumPipelineAggregationBuilder(aggregationName,
				fieldName);
		return builder.subAggregation(pipeLineAggregation);
	}

	private DateHistogramAggregationBuilder buildSubAvgAggreationForDateHistogram(
			DateHistogramAggregationBuilder builder, String aggregationName, String fieldName) {
		return builder.subAggregation(AggregationBuilders.avg(aggregationName).field(fieldName));
	}

	private DateHistogramAggregationBuilder buildSubCountAggregationForDateHistogram(
			DateHistogramAggregationBuilder builder, String aggregationName, String fieldName) {
		return builder.subAggregation(AggregationBuilders.count(aggregationName).field(fieldName));
	}

	private TermsAggregationBuilder buildSubCountAggregationForTerms(TermsAggregationBuilder builder,
			String aggregationName, String fieldName) {
		return builder.subAggregation(AggregationBuilders.count(aggregationName).field(fieldName));
	}

	private TermsAggregationBuilder buildSubTermsAggregationForTerms(TermsAggregationBuilder builder,
			String aggregationName, String fieldName) {
		return builder.subAggregation(AggregationBuilders.terms(aggregationName).field(fieldName));
	}

	private DateHistogramAggregationBuilder buildSubTermsAggregationForHistogram(
			DateHistogramAggregationBuilder builder, String aggregationName, String fieldName) {
		return builder.subAggregation(AggregationBuilders.terms(aggregationName).field(fieldName));
	}

	private TermsAggregationBuilder buildSubSumAggreationForTerms(TermsAggregationBuilder builder,
			String aggregationName, String fieldName) {
		return builder.subAggregation(AggregationBuilders.sum(aggregationName).field(fieldName));
	}

	private TermsAggregationBuilder buildSubAvgAggreationForTerms(TermsAggregationBuilder builder,
			String aggregationName, String fieldName) {
		return builder.subAggregation(AggregationBuilders.avg(aggregationName).field(fieldName));
	}

	private SumAggregationBuilder buildSubSumAggregation(SumAggregationBuilder builder, String aggregationName,
			String fieldName) {
		return builder.subAggregation(AggregationBuilders.sum(aggregationName).field(fieldName));
	}

	private AvgAggregationBuilder buildSubAvgAggregation(AvgAggregationBuilder builder, String aggregationName,
			String fieldName) {
		return builder.subAggregation(AggregationBuilders.avg(aggregationName).field(fieldName));
	}

	private BoolQueryBuilder buildBoolQuery() {
		return QueryBuilders.boolQuery();
	}

	private BoolQueryBuilder addMustOnBoolQuery(BoolQueryBuilder builder, RangeQueryBuilder rangeBuilder) {
		return builder.must(rangeBuilder);
	}

	private BoolQueryBuilder addFilterOnBoolQuery(BoolQueryBuilder builder, TermQueryBuilder termBuilder) {
		return builder.filter(termBuilder);
	}

	private BoolQueryBuilder addFilterTermsOnBoolQuery(BoolQueryBuilder builder, TermsQueryBuilder termBuilder) {
		return builder.filter(termBuilder);
	}

	private BoolQueryBuilder addMatchOnBoolQuery(BoolQueryBuilder builder, MatchQueryBuilder matchBuilder) {
		return builder.filter(matchBuilder);
	}

	private SearchSourceBuilder buildSearchSourceBuilder() {
		return new SearchSourceBuilder().size(0);
	}

	private SearchSourceBuilder addQueryToSearchBuilder(SearchSourceBuilder builder, BoolQueryBuilder queryBuilder) {
		return builder.query(queryBuilder);
	}

	private SearchSourceBuilder addAggregationToSearchBuilder(SearchSourceBuilder builder,
			DateHistogramAggregationBuilder aggBuilder) {
		return builder.aggregation(aggBuilder);
	}

	private SearchSourceBuilder addSumAggregationToSearchBuilder(SearchSourceBuilder builder,
			SumAggregationBuilder aggBuilder) {
		return builder.aggregation(aggBuilder);
	}

	private SearchSourceBuilder addAvgAggregationToSearchBuilder(SearchSourceBuilder builder,
			AvgAggregationBuilder aggBuilder) {
		return builder.aggregation(aggBuilder);
	}

	private SearchSourceBuilder addValueCountAggregationToSearchBuilder(SearchSourceBuilder builder,
			ValueCountAggregationBuilder aggBuilder) {
		return builder.aggregation(aggBuilder);
	}

	private SearchSourceBuilder addTermsAggregationToSearchBuilder(SearchSourceBuilder builder,
			TermsAggregationBuilder aggBuilder) {
		return builder.aggregation(aggBuilder);
	}

	@Override
	public MultiSearchResponse executeMultiSearchRequest(List<SearchRequest> searchRequestList, String tenant) {
		MultiSearchRequest multiRequest = new MultiSearchRequest();
		MultiSearchResponse response = null;

		for (SearchRequest request : searchRequestList) {
			logger.info("ES Query is : " + request.source());
			multiRequest.add(request);
		}

		try {
			response = client.multiSearch(multiRequest);
		} catch (IOException e) {
			logger.error("Encountered an error while connecting : " + e);
			logger.error("Error Message to report : " + e.getMessage());
		}

		return response;
	}

	private RestHighLevelClient getClientForElastic() {
		return new RestHighLevelClient(RestClient.builder(new HttpHost(elasticHost, elasticPort, REST_SCHEME)));
	}

	private RestHighLevelClient getClientForAlternate() throws MalformedURLException {
		URL url = new URL("https://egov-micro-dev.egovernments.org/elasticsearch/");
		return new RestHighLevelClient(RestClient.builder(new HttpHost(url.getHost(), url.getPort(), REST_SCHEME2)));
	}

	/*
	 * @SuppressWarnings("unchecked")
	 * 
	 * @Override public ElasticSearchDictator createSearchDictator(String indexName,
	 * String documentType, CummulativeDataRequestDto dto, String dateField) throws
	 * Exception { ElasticSearchDictator dictator = new ElasticSearchDictator();
	 * 
	 * dictator.setIndexName(indexName); dictator.setDocumentType(documentType);
	 * 
	 * Map<String, Map<String, List<Object>>> queryMap = new HashMap<>(); if
	 * (dto.getCustomData() != null) { for (Map.Entry<String, Object> entry :
	 * dto.getCustomData().entrySet()) { if (StringUtils.isNotBlank(entry.getKey())
	 * && entry.getValue() != null) { List<Object> valueList = new ArrayList<>();
	 * 
	 * if (entry.getValue() instanceof ArrayList) {
	 * 
	 * List<Object> valueArray = (ArrayList<Object>) entry.getValue();
	 * 
	 * for (Object value : valueArray) { valueList.add(value); } } else {
	 * valueList.add(entry.getValue()); } if (!valueList.isEmpty()) { String
	 * entryKey = entry.getKey(); if
	 * (queryMap.containsKey(ElasticProperties.Query.MATCH_CONDITION)) { Map<String,
	 * List<Object>> queryInnerMap = queryMap
	 * .get(ElasticProperties.Query.MATCH_CONDITION); queryInnerMap.put(entryKey,
	 * valueList); } else { Map<String, List<Object>> queryInnerMap = new
	 * HashMap<>(); queryInnerMap.put(entryKey, valueList);
	 * queryMap.put(ElasticProperties.Query.MATCH_CONDITION, queryInnerMap); } } } }
	 * }
	 * 
	 * if (dto.getDates() != null) { if
	 * (StringUtils.isNotBlank(dto.getDates().getStartDate()) &&
	 * StringUtils.isNotBlank(dto.getDates().getEndDate())) { List<Object> valueList
	 * = new ArrayList<>();
	 * 
	 * valueList.add(dto.getDates().getStartDate());
	 * valueList.add(dto.getDates().getEndDate()); Map<String, List<Object>>
	 * queryInnerMap = new HashMap<>(); queryInnerMap.put(dateField, valueList);
	 * queryMap.put(ElasticProperties.Query.RANGE_CONDITION, queryInnerMap); } }
	 * dictator.setQueryMap(queryMap);
	 * 
	 *//*
		 * Map<String,Map<String,Map<String,Object>>> aggregationMap = new HashMap<>();
		 * Map<String,Map<String, String>> innerMap = new HashMap<>(); Map<String,
		 * String> deepInnerMap = new HashMap<>();
		 *//*
			 * 
			 * return dictator; }
			 * 
			 * @Override public ElasticSearchDictator
			 * createSearchDictator(AggregateRequestDto dto, String indexName, String
			 * documentType, String filterDateField) throws Exception {
			 * ElasticSearchDictator dictator = new ElasticSearchDictator();
			 * 
			 * dictator.setIndexName(indexName); dictator.setDocumentType(documentType); if
			 * (StringUtils.isNotBlank(dto.getServiceApi())) {
			 * dictator.setVisualisationName(dto.getServiceApi()); }
			 * 
			 * Map<String, Map<String, List<Object>>> queryMap = new HashMap<>(); if
			 * (dto.getCustomData() != null) { for (Map.Entry<String, Object> entry :
			 * dto.getCustomData().entrySet()) { if (StringUtils.isNotBlank(entry.getKey())
			 * && entry.getValue() != null) { List<Object> valueList = new ArrayList<>();
			 * 
			 * if (entry.getValue() instanceof ArrayList) {
			 * 
			 * List<Object> valueArray = (ArrayList<Object>) entry.getValue();
			 * 
			 * for (Object value : valueArray) { valueList.add(value); } } else {
			 * valueList.add(entry.getValue()); } if (!valueList.isEmpty()) { String
			 * entryKey = entry.getKey(); if
			 * (queryMap.containsKey(ElasticProperties.Query.MATCH_CONDITION)) { Map<String,
			 * List<Object>> queryInnerMap = queryMap
			 * .get(ElasticProperties.Query.MATCH_CONDITION); queryInnerMap.put(entryKey,
			 * valueList); } else { Map<String, List<Object>> queryInnerMap = new
			 * HashMap<>(); queryInnerMap.put(entryKey, valueList);
			 * queryMap.put(ElasticProperties.Query.MATCH_CONDITION, queryInnerMap); } } } }
			 * }
			 * 
			 * if (dto.getDates() != null) { if
			 * (StringUtils.isNotBlank(dto.getDates().getStartDate()) &&
			 * StringUtils.isNotBlank(dto.getDates().getEndDate())) { List<Object> valueList
			 * = new ArrayList<>();
			 * 
			 * valueList.add(dto.getDates().getStartDate());
			 * valueList.add(dto.getDates().getEndDate()); Map<String, List<Object>>
			 * queryInnerMap = new HashMap<>();
			 * 
			 * queryInnerMap.put(filterDateField, valueList);
			 * 
			 * queryMap.put(ElasticProperties.Query.RANGE_CONDITION, queryInnerMap); } }
			 * dictator.setQueryMap(queryMap); return dictator; }
			 */

	@Override
	public ElasticSearchDictator createSearchDictatorV2(AggregateRequestDto dto, String indexName, String documentType,
			String filterDateField) {
		ElasticSearchDictator dictator = new ElasticSearchDictator();
		try {

			dictator.setIndexName(indexName);
			dictator.setDocumentType(documentType);

			Map<String, Map<String, List<Object>>> queryMap = new HashMap<>();
			if (dto.getEsFilters() != null && !dto.getEsFilters().isEmpty()) {
				for (Map.Entry<String, Object> entry : dto.getEsFilters().entrySet()) {
					if (StringUtils.isNotBlank(entry.getKey()) && entry.getValue() != null) {
						List<Object> valueList = new ArrayList<>();

						if (entry.getValue() instanceof ArrayList) {

							List<Object> valueArray = (ArrayList<Object>) entry.getValue();

							for (Object value : valueArray) {
								String valueString = "";
								if (entry.getKey().equals("dataObject.tenantId")) {
									valueString = String.valueOf(value);
									valueString = valueString.replace("uat: ", "");
								}
								if (StringUtils.isBlank(valueString))
									valueList.add(value);
								else
									valueList.add(valueString);
							}
						} else {
							String valueString = "";
							if (entry.getKey().equals("dataObject.tenantId")) {
								valueString = String.valueOf(entry.getValue());
								valueString = valueString.replace("uat: ", "");
							}
							if (StringUtils.isBlank(valueString))
								valueList.add(entry.getValue());
							else
								valueList.add(valueString);
						}
						if (!valueList.isEmpty()) {
							String entryKey = entry.getKey();
							if (queryMap.containsKey(ElasticProperties.Query.MATCH_CONDITION)) {
								Map<String, List<Object>> queryInnerMap = queryMap
										.get(ElasticProperties.Query.MATCH_CONDITION);
								queryInnerMap.put(entryKey, valueList);
							} else {
								Map<String, List<Object>> queryInnerMap = new HashMap<>();
								queryInnerMap.put(entryKey, valueList);
								queryMap.put(ElasticProperties.Query.MATCH_CONDITION, queryInnerMap);
							}
						}
					}
				}
			}

			Map<String, Object> queryAggregationMap = new HashMap<>();
			if (dto.getAggregationFactors() != null && !dto.getAggregationFactors().isEmpty()) {
				for (Map.Entry<String, Object> entry : dto.getAggregationFactors().entrySet()) {
					if (StringUtils.isNotBlank(entry.getKey()) && entry.getValue() != null) {
						Map<String, Object> innerAggregationMap = new HashMap<>();
						innerAggregationMap.put("field", entry.getValue());
						queryAggregationMap.put(entry.getKey(), innerAggregationMap);
					}
				}
			}
			dictator.setQueryAggregationMap(queryAggregationMap);
			if (dto.getRequestDate() != null) {
				if (StringUtils.isNotBlank(dto.getRequestDate().getStartDate())
						&& StringUtils.isNotBlank(dto.getRequestDate().getEndDate())) {
					List<Object> valueList = new ArrayList<>();

					valueList.add(dto.getRequestDate().getStartDate());
					valueList.add(dto.getRequestDate().getEndDate());
					Map<String, List<Object>> queryInnerMap = new HashMap<>();

					if (StringUtils.isNotBlank(filterDateField)) {
						queryInnerMap.put(filterDateField, valueList);
						queryMap.put(ElasticProperties.Query.RANGE_CONDITION, queryInnerMap);
					}
				}
			}
			dictator.setQueryMap(queryMap);
			return dictator;
		} catch (Exception e) {
			logger.info("Exception in createSearchDictatorV2 : {} ", e.getMessage());
			return null;
		}
	}

	@Override
	public MultiSearchResponse executeMultiSearchRequest(List<SearchRequest> searchRequestList, Boolean primaryOrNot) {
		MultiSearchRequest multiRequest = new MultiSearchRequest();
		MultiSearchResponse response = null;
		for (SearchRequest request : searchRequestList) {
			logger.info("ES Query is : " + request.source());
			multiRequest.add(request);
		}

		try {
			if (primaryOrNot) {
				response = client.multiSearch(multiRequest);
			} else {
				logger.info("Alternate Client URL : " + alternateClient.toString());
				response = alternateClient.multiSearch(multiRequest);
			}

		} catch (IOException e) {
			logger.error("Encountered an error while connecting : " + e);
			logger.error("Error Message to report : " + e.getMessage());
		}
		return response;
	}
}
