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
public class MapResponseHandler implements IResponseHandler {
    public static final Logger logger = LoggerFactory.getLogger(MapResponseHandler.class);


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
        	
            List<Double> totalValues = new ArrayList<>();
            List<Plot> finalPlots = new ArrayList<>(); 
            String bkey = ""; 
            for(JsonNode aggrNode : aggrNodes) { 
            	if (aggrNode.findValues(IResponseHandler.BUCKETS).size() > 0) {
                    ArrayNode buckets = (ArrayNode) aggrNode.findValues(IResponseHandler.BUCKETS).get(0);
                    String headerLabel = chartNode.get(HEADER_LABEL) != null ? chartNode.get(HEADER_LABEL).asText() : HEADER_LABEL_DEFAULT; 
                    String valueLabel = chartNode.get(VALUE_LABEL) != null ? chartNode.get(VALUE_LABEL).asText() : VALUE_LABEL_DEFAULT;
                    String parentLabel = chartNode.get(PARENT_LABEL) != null ? chartNode.get(PARENT_LABEL).asText() : PARENT_LABEL_DEFAULT;
                    for(JsonNode bucket : buckets) { 
                    	List<Plot> plots = new ArrayList<>(); 
                    	Map<String, Plot> plotMap = new LinkedHashMap<>();
                    	bkey = bucket.findValue(IResponseHandler.KEY).asText();
                    	String innerBucketKey = null;
                    	for(JsonNode eachDepthStep : depthSteps) { 
                    		JsonNode innerNode = bucket.findValue(eachDepthStep.asText());
                    		ArrayNode innerBuckets = (ArrayNode) innerNode.findValues(IResponseHandler.BUCKETS).get(0);
                    		for(JsonNode innerBucket : innerBuckets) { 
                    			innerBucketKey = innerBucket.findValue(IResponseHandler.KEY).asText();
                    			double value = (innerBucket.findValue(IResponseHandler.VALUE) != null) ? innerBucket.findValue(IResponseHandler.VALUE).asDouble():innerBucket.findValue(IResponseHandler.DOC_COUNT).asDouble();
                    			Plot plot = new Plot(innerBucketKey, value, symbol, bkey, headerLabel, valueLabel, parentLabel);
                    			plotMap.put(innerBucketKey, plot);
                    			totalValues.add(value); 
                    		}
                    	}
                    	plots = plotMap.entrySet().stream().map(e -> e.getValue()).collect(Collectors.toList());
                    	finalPlots.addAll(plots); 
                    }
                }
            }
            Data data = new Data(headerPath.asText(), (totalValues==null || totalValues.isEmpty()) ? 0.0 : totalValues.stream().reduce(0.0, Double::sum), symbol);
            data.setPlots(finalPlots);
            if(chartNode.get(COLOR_PALETTE_CODE) != null && chartNode.get(COLOR_PALETTE_ID) != null) { 
            	data.setColorPaletteCode(chartNode.get(COLOR_PALETTE_CODE).asText());
            	data.setColorPaletteId(chartNode.get(COLOR_PALETTE_ID).asLong());
            }
            dataList.add(data);
        }
        return getAggregatedDto(chartNode, dataList, requestDto.getVisualizationCode());
    }

}
