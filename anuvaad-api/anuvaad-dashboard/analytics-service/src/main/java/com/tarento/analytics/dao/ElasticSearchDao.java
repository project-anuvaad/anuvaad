package com.tarento.analytics.dao;

import java.util.List;
import java.util.Map;

import org.elasticsearch.action.search.MultiSearchResponse;
import org.elasticsearch.action.search.SearchRequest;

import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.SearchDto;
import com.tarento.analytics.model.ElasticSearchDictator;

public interface ElasticSearchDao {

	public Map<String, Object> getDataByIdentifier(String index, String type, String identifier);

	public Map<String, Object> searchData(String index, String type, Map<String, Object> searchData);

	public Map<String, Object> complexSearch(SearchDto searchDTO, String index, String... type);

	public boolean healthCheck();

	/*
	 * public ElasticSearchDictator createSearchDictator(AggregateRequestDto dto,
	 * String tenant) throws Exception ;
	 * 
	 * public ElasticSearchDictator createSearchDictator(AggregateRequestDto dto,
	 * String indexName, String documentType, String filterDateField) throws
	 * Exception ;
	 */
	public ElasticSearchDictator createSearchDictatorV2(AggregateRequestDto dto, String indexName, String documentType,
			String filterDateField);

	public SearchRequest buildElasticSearchQuery(ElasticSearchDictator dictator);

	public MultiSearchResponse executeMultiSearchRequest(List<SearchRequest> searchRequestList, String tenant);

	// public ElasticSearchDictator createSearchDictator(String indexName, String
	// documentType, CummulativeDataRequestDto dto, String tenant) throws Exception
	// ;

	MultiSearchResponse executeMultiSearchRequest(List<SearchRequest> searchRequestList, Boolean primaryOrNot);

}
