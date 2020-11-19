package com.tarento.analytics.utils;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class ElasticSearchClient {
	private final String hostName;
	private final Integer port;
	private final static String  HTTP = "http";
    private final Integer topPerformanceCount;
    private final String transactionIndex;
    private final String transactionType;
    private final String targetIndex;
    private final String targetType;

    public  ElasticSearchClient(@Value("${services.esindexer.primary.host.name}") String hostName,
		@Value("${services.esindexer.primary.host.port}") Integer port,
        @Value("${top.performance.record.count}") Integer topPerformanceCount,
        @Value("${es.index.name}") String transactionIndex,
        @Value("${es.document.type}") String transactionType,
        @Value("${es.target.index.name}") String targetIndex,
        @Value("${es.target.document.type}") String targetType){
	
			this.hostName = hostName;
			this.port = port;
			this.topPerformanceCount = topPerformanceCount;
			this.transactionIndex = transactionIndex;
			this.transactionType = transactionType;
		    this.targetIndex = targetIndex;
		    this.targetType = targetType;
	
	}
    
    public RestHighLevelClient getClient() {
		return new RestHighLevelClient(
                RestClient.builder(new HttpHost(hostName, port,HTTP)));

    }

	


}
