package com.tarento.analytics.handler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;

/**
 * This handles ES response for single index, multiple index to represent data as line chart
 * Creates plots by merging/computing(by summation) index values for same key
 * AGGS_PATH : this defines the path/key to be used to search the tree
 * VALUE_TYPE : defines the data type for the value formed, this could be amount, percentage, number
 *
 */
@Component
public class AdvancedMapResponseHandler implements IResponseHandler {
    public static final Logger logger = LoggerFactory.getLogger(AdvancedMapResponseHandler.class);


    @Override
    public AggregateDto translate(String profileName, AggregateRequestDto requestDto, ObjectNode aggregations) throws IOException {

        List<Data> dataList = new LinkedList<>();

        JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
        JsonNode chartNode = requestDto.getChartNode();
        String symbol = chartNode.get(IResponseHandler.VALUE_TYPE).asText();
        ArrayNode aggrsPaths = (ArrayNode) chartNode.get(IResponseHandler.AGGS_PATH);
        ArrayNode depthSteps = (ArrayNode) chartNode.get(IResponseHandler.DEPTH_STEPS);
        
        for(JsonNode headerPath : aggrsPaths) { 
        	List<JsonNode> aggrNodes = aggregationNode.findValues(headerPath.asText());
        	Map<String, Double> plotMap = new LinkedHashMap<>();
            List<Double> totalValues = new ArrayList<>();
            for(JsonNode aggrNode : aggrNodes) { 
            	if (!aggrNode.findValues(IResponseHandler.BUCKETS).isEmpty()) {
                    ArrayNode buckets = (ArrayNode) aggrNode.findValues(IResponseHandler.BUCKETS).get(0);
                    String headerLabel = chartNode.get(HEADER_LABEL) != null ? chartNode.get(HEADER_LABEL).asText() : HEADER_LABEL_DEFAULT; 
                    String valueLabel = chartNode.get(VALUE_LABEL) != null ? chartNode.get(VALUE_LABEL).asText() : VALUE_LABEL_DEFAULT;
                    for(JsonNode bucket : buckets) { 
                    	String bkey = bucket.findValue(IResponseHandler.KEY).asText();
                    	for(JsonNode eachDepthStep : depthSteps) { 
                    		JsonNode innerNode = bucket.findValue(eachDepthStep.asText());
                    		ArrayNode innerBuckets = (ArrayNode) innerNode.findValues(IResponseHandler.BUCKETS).get(0);
                    		for(JsonNode innerBucket : innerBuckets) { 
                    			String innerBucketKey = innerBucket.findValue(IResponseHandler.KEY).asText();
                    			double value = (innerBucket.findValue(IResponseHandler.VALUE) != null) ? innerBucket.findValue(IResponseHandler.VALUE).asDouble():innerBucket.findValue(IResponseHandler.DOC_COUNT).asDouble();
                    			plotMap.put(innerBucketKey, value); 
                    			totalValues.add(value); 
                    		}
                    	}
                    	List<Plot> plots = plotMap.entrySet().stream().map(e -> new Plot(e.getKey(), e.getValue(), symbol, bkey, headerLabel, valueLabel)).collect(Collectors.toList());
                    	plotMap.clear(); 
                    	Data data = new Data(bkey, (totalValues==null || totalValues.isEmpty()) ? 0.0 : totalValues.stream().reduce(0.0, Double::sum), symbol);
                        data.setPlots(plots);
                        dataList.add(data);
                    }
                }
            }
        }
        return getAggregatedDto(chartNode, dataList, requestDto.getVisualizationCode());
    }

}
