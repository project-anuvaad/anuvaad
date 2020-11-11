package com.tarento.analytics.handler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
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
import com.tarento.analytics.dto.RichPlot;

/**
 * 
 * @author darshan
 *
 */
@Component
public class WeightChartResponseHandler implements IResponseHandler {
    public static final Logger logger = LoggerFactory.getLogger(WeightChartResponseHandler.class);


    @Override
    public AggregateDto translate(String profileName, AggregateRequestDto requestDto, ObjectNode aggregations) throws IOException {

        JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
        JsonNode chartNode = requestDto.getChartNode();

        String symbol = chartNode.get(IResponseHandler.VALUE_TYPE).asText();
        Map<String, String> headerPathMap = new HashMap<>();
        headerPathMap.put(XPATH, chartNode.get(IResponseHandler.XPATH).asText());
        headerPathMap.put(YPATH, chartNode.get(IResponseHandler.YPATH).asText());
        headerPathMap.put(ZPATH, chartNode.get(IResponseHandler.ZPATH).asText());
        ArrayNode aggrsPaths = (ArrayNode) chartNode.get(IResponseHandler.AGGS_PATH);
        Map<String, RichPlot> plotMap = new HashMap<>();
        Map<String, Data> dataMap = new HashMap<>();
 
        for(JsonNode headerPath : aggrsPaths) { 
        	List<JsonNode> aggrNodes = aggregationNode.findValues(headerPath.asText());
        	headerPathMap.put(CURRENT_PATH, headerPath.asText());
        	for(JsonNode aggrNode : aggrNodes) { 
        		if (aggrNode.findValues(IResponseHandler.BUCKETS).size() > 0) {

                    ArrayNode buckets = (ArrayNode) aggrNode.findValues(IResponseHandler.BUCKETS).get(0);
                    for(JsonNode bucket : buckets) {
                        String bkey = bucket.findValue(IResponseHandler.KEY).asText();
                        double value = ((bucket.findValue(IResponseHandler.VALUE) != null) ? bucket.findValue(IResponseHandler.VALUE).asDouble():bucket.findValue(IResponseHandler.DOC_COUNT).asDouble());
                        if(plotMap.containsKey(bkey)) { 
                        	RichPlot existingRichPlot = plotMap.get(bkey);
                        	Data existingData = dataMap.get(bkey); 
                        	setPlotAxis(headerPathMap, headerPath, value, existingRichPlot);
                        	existingData.setHeaderName(bkey);
                        } else { 
                        	RichPlot newRichPlot = new RichPlot();
                        	Data data = new Data(bkey, null, symbol); 
                        	setPlotAxis(headerPathMap, headerPath, value, newRichPlot);
                        	dataMap.put(bkey, data); 
                        	plotMap.put(bkey, newRichPlot); 
                        }
                    }
        		}
        	}
        }
        
        for(Entry<String, Data> entry : dataMap.entrySet()) { 
        	List<Plot> plots = new ArrayList<>();
        	plots.add(plotMap.get(entry.getKey()));
        	entry.getValue().setPlots(plots);
        }
        return getAggregatedDto(chartNode, dataMap.values().stream().collect(Collectors.toList()), requestDto.getVisualizationCode());
    }
    
    private void setPlotAxis(Map<String, String> headerPathMap, JsonNode headerPath, double value, RichPlot richPlot) { 
    	if(headerPathMap.get(CURRENT_PATH).equals(headerPathMap.get(XPATH))) {
    		richPlot.setxAxis(value);
    		richPlot.setxAxisLabel(headerPath.asText());
    	}
    	if(headerPathMap.get(CURRENT_PATH).equals(headerPathMap.get(YPATH))) {
    		richPlot.setyAxis(value);
    		richPlot.setyAxisLabel(headerPath.asText());
    	}
    	if(headerPathMap.get(CURRENT_PATH).equals(headerPathMap.get(ZPATH))) {
    		richPlot.setzAxis(value/10.0);
    		richPlot.setzAxisLabel(headerPath.asText());
    	}
    }
}
