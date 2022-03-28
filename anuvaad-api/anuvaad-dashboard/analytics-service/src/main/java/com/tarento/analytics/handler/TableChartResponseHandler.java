package com.tarento.analytics.handler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import com.tarento.analytics.helper.ComputedFieldHelper;
/**
 * This handles ES response for single index, multiple index to compute performance
 * Creates plots by performing ordered (ex: top n performance or last n performance)
 * AGGS_PATH : configurable to this defines the path/key to be used to search the tree
 * VALUE_TYPE : configurable to define the data type for the value formed, this could be amount, percentage, number
 * PLOT_LABEL :  configurable to define the label for the plot
 * TYPE_MAPPING : defines for a plot data type
 */
@Component
public class TableChartResponseHandler implements IResponseHandler {
    public static final Logger logger = LoggerFactory.getLogger(TableChartResponseHandler.class);


    @Autowired
    ComputedFieldHelper computedFieldHelper;
    @Override
    public AggregateDto translate(String profileName, AggregateRequestDto requestDto, ObjectNode aggregations) throws IOException {


        JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
        JsonNode chartNode = requestDto.getChartNode();
        String postAggrTheoryName = chartNode.get(POST_AGGREGATION_THEORY) == null ? "" :  chartNode.get(POST_AGGREGATION_THEORY).asText();
        String plotLabel = chartNode.get(PLOT_LABEL).asText();
        ArrayNode pathDataTypeMap = (ArrayNode) chartNode.get(TYPE_MAPPING);
        ArrayNode aggrsPaths = (ArrayNode) chartNode.get(IResponseHandler.AGGS_PATH);
        Map<String, Map<String, Plot>> mappings = new HashMap<>();
        List<JsonNode> aggrNodes = aggregationNode.findValues(BUCKETS);

        int[] idx = { 1 };

        aggrNodes.stream().forEach(node -> {
            ArrayNode buckets = (ArrayNode) node;
            buckets.forEach(bucket -> {
                Map<String, Plot> plotMap = new LinkedHashMap<>();
                String key = bucket.findValue(IResponseHandler.KEY).asText();

                aggrsPaths.forEach(headerPath -> {
                    JsonNode datatype = pathDataTypeMap.findValue(headerPath.asText());
                    JsonNode valueNode = bucket.findValue(headerPath.asText());
                    //Double value = (null == valueNode || null == valueNode.get(VALUE)) ? 0.0 : valueNode.get(VALUE).asDouble();
                    Double doc_value = 0.0;
                    if(valueNode!=null)
                        doc_value = (null == valueNode.findValue(DOC_COUNT)) ? 0.0 : valueNode.findValue(DOC_COUNT).asDouble();
                    Double value = (null == valueNode || null == valueNode.findValue(VALUE)) ? doc_value : valueNode.findValue(VALUE).asDouble();
                    Plot plot = new Plot(headerPath.asText(), value, datatype.asText());
                    if (mappings.containsKey(key)) {
                        double newval = mappings.get(key).get(headerPath.asText()) == null ? value : ((double)mappings.get(key).get(headerPath.asText()).getValue() + value);
                        plot.setValue(newval);
                        mappings.get(key).put(headerPath.asText(), plot);
                    } else {
                        plotMap.put(headerPath.asText(), plot);
                    }
                });

                if (plotMap.size() > 0) {
                    Map<String, Plot> plots = new LinkedHashMap<>();
                    Plot sno = new Plot(SERIAL_NUMBER, null, TABLE_TEXT);
                    sno.setLabel(idx[0]++);
                    Plot plotkey = new Plot(plotLabel.isEmpty() ? TABLE_KEY : plotLabel, null, TABLE_TEXT);
                    plotkey.setLabel(key);

                    plots.put(SERIAL_NUMBER, sno);
                    plots.put(plotLabel.isEmpty() ? TABLE_KEY : plotLabel, plotkey);
                    plots.putAll(plotMap);
                    mappings.put(key, plots);

                }
            });

        });

        List<Data> dataList = new ArrayList<>();
        mappings.entrySet().stream().parallel().forEach(plotMap -> {
            List<Plot> plotList = plotMap.getValue().values().stream().parallel().collect(Collectors.toList());
            //filter out data object with all zero data.
            List<Plot> filterPlot = plotList.stream().filter(c -> (!c.getName().equalsIgnoreCase(SERIAL_NUMBER) && !c.getName().equalsIgnoreCase(plotLabel) && (double)c.getValue() != 0.0)).collect(Collectors.toList());

            if(filterPlot.size()>0){
                Data data = new Data(plotMap.getKey(), Integer.parseInt(String.valueOf(plotMap.getValue().get(SERIAL_NUMBER).getLabel())), null);
                data.setPlots(plotList);
                if(requestDto.getVisualizationCode().equals(PT_DDR_BOUNDARY) || requestDto.getVisualizationCode().equals(PT_BOUNDARY) || requestDto.getVisualizationCode().equals(PT_BOUNDARY_DRILL)
                        || requestDto.getVisualizationCode().equals(TL_DDR_BOUNDARY) || requestDto.getVisualizationCode().equals(TL_BOUNDARY) || requestDto.getVisualizationCode().equals(TL_BOUNDARY_DRILL)) {

                    computedFieldHelper.set(requestDto, postAggrTheoryName);
                    computedFieldHelper.add(data,TARGET_ACHIEVED, TOTAL_COLLECTION, TARGET_COLLECTION );
                }

                dataList.add(data);
            }


        });
        //dataList.sort((o1, o2) -> ((Integer) o1.getHeaderValue()).compareTo((Integer) o2.getHeaderValue()));
        return getAggregatedDto(chartNode, dataList, requestDto.getVisualizationCode());
    }

}
