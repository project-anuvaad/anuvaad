package com.tarento.analytics.handler;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.enums.ChartType;
import com.tarento.analytics.helper.ComputeHelper;
import com.tarento.analytics.helper.ComputeHelperFactory;
import com.tarento.analytics.utils.ResponseRecorder;

/**
 * This handles ES response for single index, multiple index to represent single data value
 * Creates plots by merging/computing(by summation or by percentage) index values for same key
 * ACTION:  for the chart config defines the type either summation or computing percentage
 * AGGS_PATH : this defines the path/key to be used to search the tree
 *
 */
@Component
public class MetricChartResponseHandler implements IResponseHandler{
    public static final Logger logger = LoggerFactory.getLogger(MetricChartResponseHandler.class);
    char insightPrefix = 'i';
    
    @Autowired
    ConfigurationLoader configurationLoader;
    
    @Autowired
    ComputeHelperFactory computeHelperFactory; 
    
    @Autowired
    ResponseRecorder responseRecorder;

    @Override
    public AggregateDto translate(String profileName, AggregateRequestDto request, ObjectNode aggregations) throws IOException {
        List<Data> dataList = new ArrayList<>();
        String requestId = request.getRequestId(); 
        String visualizationCode = request.getVisualizationCode();
        JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
        JsonNode chartNode = null; 
        
        if(request.getVisualizationCode().charAt(0) == insightPrefix) { 
        	String internalChartId = request.getVisualizationCode().substring(1);
        	chartNode = configurationLoader.getConfigForProfile(profileName, API_CONFIG_JSON).get(internalChartId);
        } else {
        	chartNode = configurationLoader.getConfigForProfile(profileName, API_CONFIG_JSON).get(request.getVisualizationCode());
        }
        Boolean isDecimalCheck = chartNode.get(IS_DECIMAL).asBoolean();  
        List<Double> totalValues = new LinkedList<>();
        List<String> headerPathList = new LinkedList<>(); 
        String chartName = chartNode.get(CHART_NAME).asText();
        String action = chartNode.get(ACTION).asText();
        
        List<Double> percentageList = new LinkedList<>();
        ArrayNode aggrsPaths = (ArrayNode) chartNode.get(AGGS_PATH);

        aggrsPaths.forEach(headerPath -> {
            List<JsonNode> values =  aggregationNode.findValues(headerPath.asText());
            values.stream().parallel().forEach(value -> {
                List<JsonNode> valueNodes = value.findValues(VALUE).isEmpty() ? value.findValues(DOC_COUNT) : value.findValues(VALUE);
                Double sum = valueNodes.stream().mapToDouble(o -> o.asDouble()).sum();
                DecimalFormat decimalFormat = null; 
                decimalFormat = new DecimalFormat("#.##");
                Double formattedSum = Double.parseDouble(decimalFormat.format(sum));
                headerPathList.add(headerPath.asText()); 
                if(action.equals(PERCENTAGE) && aggrsPaths.size()==2){
                    percentageList.add(formattedSum);
                } else {
                    totalValues.add(formattedSum);
                }
            });
        });

        String symbol = chartNode.get(IResponseHandler.VALUE_TYPE).asText();
        try{
        	ChartType chartType = ChartType.fromValue(chartNode.get(Constants.JsonPaths.CHART_TYPE).asText());
        	Data data = null; 
        	if(!chartType.equals(ChartType.METRICCOLLECTION)) { 
        		data = new Data(chartName, action.equals(PERCENTAGE) && aggrsPaths.size()==2 ? percentageValue(percentageList) : (totalValues==null || totalValues.isEmpty())? 0.0 :totalValues.stream().reduce(0.0, Double::sum), symbol);
        		data.setIsDecimal(isDecimalCheck);
        		dataList.add(data);
        	} else { 
        		if(action.equals(METRIC_GROUP)) { 
        			for(int i = 0 ; i < totalValues.size(); i++) { 
        				data = new Data(headerPathList.get(i), totalValues.get(i), symbol);
        				dataList.add(data);
        			}
        		}
        	}
            responseRecorder.put(visualizationCode, request.getModuleLevel(), data);
            
            if(chartNode.get(POST_AGGREGATION_THEORY) != null) { 
            	ComputeHelper computeHelper = computeHelperFactory.getInstance(chartNode.get(POST_AGGREGATION_THEORY).asText());
            	computeHelper.compute(request, dataList); 
            }
        }catch (Exception e){
            logger.info("data chart name = "+chartName +" ex occurred "+e.getMessage());
        }

        return getAggregatedDto(chartNode, dataList, request.getVisualizationCode());
    }
}
