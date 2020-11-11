package com.tarento.analytics.handler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
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

@Component
public class PerformanceChartResponeHandler implements IResponseHandler {

    public static final Logger logger = LoggerFactory.getLogger(PerformanceChartResponeHandler.class);

    @Override
    public AggregateDto translate(String profileName, AggregateRequestDto requestDto, ObjectNode aggregations) throws IOException {

        JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
        JsonNode chartNode = requestDto.getChartNode();
        String symbol = chartNode.get(IResponseHandler.VALUE_TYPE).asText();
        String plotLabel = chartNode.get(PLOT_LABEL).asText();
        String order = chartNode.get(ORDER).asText();
        int limit = chartNode.get(LIMIT).asInt();


        ArrayNode aggrsPaths = (ArrayNode) chartNode.get(IResponseHandler.AGGS_PATH);
        Map<String, Map<String, Double>> mappings = new LinkedHashMap<>();//HashMap<>();

        aggrsPaths.forEach(headerPath -> {
            aggregationNode.findValues(headerPath.asText()).forEach(aggrNode -> {
                if (aggrNode.findValues(IResponseHandler.BUCKETS).size() > 0) {

                    ArrayNode buckets = (ArrayNode) aggrNode.findValues(IResponseHandler.BUCKETS).get(0);
                    buckets.forEach(bucket -> {
                        String key = bucket.findValue(IResponseHandler.KEY).asText();
                        Double value = bucket.findValue(IResponseHandler.VALUE).asDouble();

                        if (mappings.containsKey(key)) {
                            Double sum = (mappings.get(key)).containsKey(headerPath.asText()) ? (mappings.get(key)).get(headerPath.asText()) + value : value;
                            (mappings.get(key)).put(headerPath.asText(), sum);

                        } else {
                            Map<String, Double> additiveMap = new HashMap<>();
                            additiveMap.put(aggrsPaths.get(0).asText(), new Double("0"));
                            additiveMap.put(aggrsPaths.get(1).asText(), new Double("0"));

                            additiveMap.put(headerPath.asText(), value);
                            mappings.put(key, additiveMap);
                        }
                    });
                }
            });
        });
        logger.info("performance chart data mappings : "+mappings);
        List<Plot> plotList = mappings.entrySet().stream().parallel().map(e -> new Plot(e.getKey(), getPercentage(e.getValue(), aggrsPaths.get(0).asText(),aggrsPaths.get(1).asText()), symbol)).collect(Collectors.toList());
        List<Plot> plots = plotList.stream().filter(plot -> (double)plot.getValue() != 0.0).collect(Collectors.toList());

        plots.stream().parallel().forEach(item -> item.setLabel(plotLabel));
        /*Comparator<Plot> plotValueComparator = Comparator.thenComparingDouble(Plot::getValue);
        plots.sort(plotValueComparator.reversed());*/
        return getAggregatedDto(chartNode, getDataOnPerformingOrder(plots, limit, order, symbol), requestDto.getVisualizationCode());
    }

    /**
     * Prepare the plots with it's header Data in performing order
     * @param plots
     * @param limit n number of plots elements
     * @param order top wise or bottom wise performance
     * @param symbol
     * @return
     */
	private List<Data> getDataOnPerformingOrder(List<Plot> plots, int limit, String order, String symbol) {

		List<Data> dataList = new ArrayList<>();
		if (order.equals(ASC)) {
			for (int i = (plots.size() - 1); i >= 0; i--) {
				dataList.add(getRankedPLot(i, symbol, plots));
			}
		} else if (order.equals(DESC)) {
			for (int i = 0; i < plots.size(); i++) {
				dataList.add(getRankedPLot(i, symbol, plots));
			}
		}
		// return dataList.subList(Math.max(0, 0), Math.min(dataList.size(), limit));
		return dataList;

	}

    private Data getRankedPLot(int rank, String dataType, List<Plot> plots){
        Data data = new Data(RANK, rank+1, dataType);
        List<Plot> p = new ArrayList<Plot>();
        p.add(plots.get(rank));
        data.setPlots(p);
        return data;
    }

}


