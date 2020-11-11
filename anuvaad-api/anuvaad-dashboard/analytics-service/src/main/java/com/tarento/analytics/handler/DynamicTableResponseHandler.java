package com.tarento.analytics.handler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;
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
import com.tarento.analytics.utils.MapConstants;

/**
 * This handles ES response for single index, multiple index to compute
 * performance Creates plots by performing ordered (ex: top n performance or
 * last n performance) AGGS_PATH : configurable to this defines the path/key to
 * be used to search the tree VALUE_TYPE : configurable to define the data type
 * for the value formed, this could be amount, percentage, number PLOT_LABEL :
 * configurable to define the label for the plot TYPE_MAPPING : defines for a
 * plot data type
 */
@Component
public class DynamicTableResponseHandler implements IResponseHandler {
	public static final Logger logger = LoggerFactory.getLogger(TableChartResponseHandler.class);

	@Autowired
	ComputedFieldHelper computedFieldHelper;

	@Override
	public AggregateDto translate(String profileName, AggregateRequestDto requestDto, ObjectNode aggregations)
			throws IOException {

		JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
		JsonNode chartNode = requestDto.getChartNode();
		
		String plotLabel = chartNode.get(PLOT_LABEL).asText();
		ArrayNode pathDataTypeMap = (ArrayNode) chartNode.get(TYPE_MAPPING);
		ArrayNode aggrsPaths = (ArrayNode) chartNode.get(IResponseHandler.AGGS_PATH);
		Map<String, Map<String, Plot>> mappings = new HashMap<>();
		List<JsonNode> aggrNodes = aggregationNode.findValues(BUCKETS);
		List<String> professionNames = new ArrayList<>();

		aggrNodes.stream().forEach(node -> {
			ArrayNode buckets = (ArrayNode) node;
			buckets.forEach(bucket -> {

				String distName = bucket.findValue(IResponseHandler.KEY).asText();
				if (StringUtils.isNotBlank(distName)) {
					aggrsPaths.forEach(aggrPath -> {
						JsonNode datatype = pathDataTypeMap.findValue(aggrPath.asText());

						ArrayNode innerBuckets = (ArrayNode) bucket.findValues(BUCKETS).get(0);
						for (JsonNode eachInnerBucket : innerBuckets) {
							String profName = eachInnerBucket.findValue(IResponseHandler.KEY).asText();
							if (!professionNames.contains(profName))
								professionNames.add(profName);
							JsonNode valueNode = eachInnerBucket.findValue(aggrPath.asText());
							Double docValue = 0.0;
							if (valueNode != null)
								docValue = (null == valueNode.findValue(DOC_COUNT)) ? 0.0
										: valueNode.findValue(DOC_COUNT).asDouble();
							Double value = (null == valueNode || null == valueNode.findValue(VALUE)) ? docValue
									: valueNode.findValue(VALUE).asDouble();
							Plot plot = new Plot(profName, value, datatype.asText());
							if (!mappings.containsKey(distName)) {
								Map<String, Plot> plotMap = new LinkedHashMap<>();
								plotMap.put(profName, plot);
								mappings.put(distName, plotMap);
							} else {
								mappings.get(distName).put(profName, plot);
							}
						}
					});
				}
			});
		});

		professionNames.sort(Comparator.naturalOrder());
		List<Data> dataList = new ArrayList<>();
		int[] idx = { 1 };

		Iterator<Entry<String, Map<String, Plot>>> mappingItr = mappings.entrySet().iterator();
		while (mappingItr.hasNext()) {
			int slNumber = idx[0]++;
			Entry<String, Map<String, Plot>> mappingEntry = mappingItr.next();
			String districtName = mappingEntry.getKey();
			Data data = new Data(mappingEntry.getKey(), slNumber, null);
			List<Plot> plotList = new LinkedList<>();

			Plot serialNumberPlot = new Plot(SERIAL_NUMBER, null, TABLE_TEXT);
			serialNumberPlot.setLabel(slNumber);
			plotList.add(serialNumberPlot);

			Plot keyPlot = new Plot(plotLabel.isEmpty() ? TABLE_KEY : plotLabel, null, TABLE_TEXT);
			keyPlot.setLabel(districtName);
			plotList.add(keyPlot);

			Plot statePlot = new Plot("State Name", null, TABLE_TEXT);
			statePlot.setLabel(MapConstants.DISTRICT_STATE_MAP.get(districtName));
			statePlot.setValue(MapConstants.DISTRICT_STATE_MAP.get(districtName));
			statePlot.setValueLabel("State Name");
			plotList.add(statePlot);

			Map<String, Plot> innerPlotMap = mappingEntry.getValue();
			for (String eachProfessionName : professionNames) {
				if (!innerPlotMap.containsKey(eachProfessionName)) {
					Plot plot = new Plot(eachProfessionName, 0.0, "number");
					plotList.add(plot);
				} else {
					Plot eachPlotForProfession = innerPlotMap.get(eachProfessionName);
					plotList.add(eachPlotForProfession);
				}
			}
			data.setPlots(plotList);
			dataList.add(data);
		}

		return getAggregatedDto(chartNode, dataList, requestDto.getVisualizationCode());
	}
}
