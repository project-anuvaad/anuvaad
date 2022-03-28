package com.tarento.analytics.handler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import com.tarento.analytics.helper.ComputedFieldFactory;
import com.tarento.analytics.helper.IComputedField;
import com.tarento.analytics.model.ComputedFields;

/**
 * This handles ES response for single index, multiple index to represent data
 * as pie figure Creates plots by merging/computing(by summation) index values
 * for same key AGGS_PATH : this defines the path/key to be used to search the
 * tree VALUE_TYPE : defines the data type for the value formed, this could be
 * amount, percentage, number
 *
 */
@Component
public class AdvanceTableChartResponseHandler implements IResponseHandler {
	public static final Logger logger = LoggerFactory.getLogger(AdvanceTableChartResponseHandler.class);

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private ComputedFieldFactory computedFieldFactory;

	@Override
	public AggregateDto translate(String profileName, AggregateRequestDto requestDto, ObjectNode aggregations)
			throws IOException {

		// String input = "{\"aggregations\":{\"AGGR\":{\"doc_count\":33,\"ULBs
		// \":{\"doc_count_error_upper_bound\":0,\"sum_other_doc_count\":0,\"buckets\":[{\"key\":\"pb.zirakpur\",\"doc_count\":14,\"Transactions\":{\"value\":14},\"Total
		// Licence Issued\":{\"value\":0},\"Total
		// Collection\":{\"value\":14110}},{\"key\":\"pb.derabassi\",\"doc_count\":9,\"Transactions\":{\"value\":9},\"Total
		// Licence Issued\":{\"value\":0},\"Total
		// Collection\":{\"value\":4000}},{\"key\":\"pb.mohali\",\"doc_count\":6,\"Transactions\":{\"value\":6},\"Total
		// Licence Issued\":{\"value\":0},\"Total
		// Collection\":{\"value\":6400}},{\"key\":\"pb.barnala\",\"doc_count\":1,\"Transactions\":{\"value\":1},\"Total
		// Licence Issued\":{\"value\":0},\"Total
		// Collection\":{\"value\":600}},{\"key\":\"pb.dharamkot\",\"doc_count\":1,\"Transactions\":{\"value\":1},\"Total
		// Licence Issued\":{\"value\":0},\"Total
		// Collection\":{\"value\":200}},{\"key\":\"pb.jalandhar\",\"doc_count\":1,\"Transactions\":{\"value\":1},\"Total
		// Licence Issued\":{\"value\":0},\"Total
		// Collection\":{\"value\":650}},{\"key\":\"pb.ludhiana\",\"doc_count\":1,\"Transactions\":{\"value\":1},\"Total
		// Licence Issued\":{\"value\":0},\"Total Collection\":{\"value\":500}}]}}}}";
		// aggregations = (ObjectNode) new ObjectMapper().readTree(input);

		JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
		logger.info("aggregationNode --------------- {} ", aggregationNode);
		JsonNode chartNode = requestDto.getChartNode();
		String plotLabel = chartNode.get(PLOT_LABEL).asText();
		JsonNode computedFields = chartNode.get("computedFields");
		JsonNode excludedFields = chartNode.get("excludedColumns");

		boolean executeComputedFields = computedFields != null && computedFields.isArray();
		List<JsonNode> aggrNodes = aggregationNode.findValues(BUCKETS);

		int[] idx = { 1 };
		List<Data> dataList = new ArrayList<>();
		Map<String, Map<String, Plot>> mappings = new HashMap<>();

		aggrNodes.stream().forEach(node -> {
			logger.info("mdms node ->  {} ", node);

			ArrayNode buckets = (ArrayNode) node;
			buckets.forEach(bucket -> {

				logger.info("mdms bucket -> {} ", bucket);
				Map<String, Plot> plotMap = new LinkedHashMap<>();
				String key = bucket.get(IResponseHandler.KEY).asText();
				logger.info("key===========: {}  bucket.findValues(BUCKETS)========= {} ", key,
						bucket.findValues(BUCKETS));

				processNestedObjects(bucket, mappings, key, plotMap);
				// removed boilerplated code

				if (!plotMap.isEmpty()) {
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
		mappings.entrySet().stream().parallel().forEach(plotMap -> {
			List<Plot> plotList = plotMap.getValue().values().stream().parallel().collect(Collectors.toList());
			// filter out data object with all zero data.
			List<Plot> filterPlot = plotList.stream()
					.filter(c -> (!c.getName().equalsIgnoreCase(SERIAL_NUMBER)
							&& !c.getName().equalsIgnoreCase(plotLabel) && (double) c.getValue() != 0.0))
					.collect(Collectors.toList());

			if (!filterPlot.isEmpty()) {
				Data data = new Data(plotMap.getKey(),
						Integer.parseInt(String.valueOf(plotMap.getValue().get(SERIAL_NUMBER).getLabel())), null);
				data.setPlots(plotList);
				//
				if (executeComputedFields) {
					try {
						List<String> list = mapper.readValue(excludedFields.toString(),
								new TypeReference<List<String>>() {
								});
						logger.info("excluded list {} ", list);

						List<ComputedFields> computedFieldsList = mapper.readValue(computedFields.toString(),
								new TypeReference<List<ComputedFields>>() {
								});
						computedFieldsList.forEach(cfs -> {
							IComputedField computedFieldObject = computedFieldFactory.getInstance(cfs.getActionName());
							computedFieldObject.set(requestDto, cfs.getPostAggregationTheory());
							computedFieldObject.add(data, cfs.getFields(), cfs.getNewField());

						});

						List<Plot> removeplots = data.getPlots().stream().filter(c -> list.contains(c.getName()))
								.collect(Collectors.toList());
						data.getPlots().removeAll(removeplots);
					} catch (Exception e) {
						logger.error("execution of computed field : {} ", e.getMessage());
					}
				}
				// exclude the fields no to be displayed

				dataList.add(data);
			}

		});
		// dataList.sort((o1, o2) -> ((Integer) o1.getHeaderValue()).compareTo((Integer)
		// o2.getHeaderValue()));
		return getAggregatedDto(chartNode, dataList, requestDto.getVisualizationCode());

	}

	/**
	 * Preparing the plots
	 * 
	 * @param bucketNode
	 * @param mappings
	 * @param key
	 * @param headerName
	 * @param plotMap
	 */
	private void process(JsonNode bucketNode, Map<String, Map<String, Plot>> mappings, String key, String headerName,
			Map<String, Plot> plotMap) {
		JsonNode valNode = bucketNode.findValue(VALUE) != null ? bucketNode.findValue(VALUE)
				: bucketNode.findValue(DOC_COUNT);
		Double value = valNode.isDouble() ? valNode.asDouble() : valNode.asInt();
		String dataType = valNode.isDouble() ? "amount" : "number"; // to move to config or constants
		// String headerName = bucketNode.findValue(KEY).asText();
		Plot plot = new Plot(headerName, value, dataType);

		if (mappings.containsKey(key)) {
			double newval = mappings.get(key).get(headerName) == null ? value
					: ((double) mappings.get(key).get(headerName).getValue() + value);
			plot.setValue(newval);
			mappings.get(key).put(headerName, plot);
		} else {
			plotMap.put(headerName, plot);
		}
	}

	/**
	 * Recursively processing the nodes
	 * 
	 * @param node
	 * @param mappings
	 * @param key
	 * @param plotMap
	 */
	private void processNestedObjects(JsonNode node, Map<String, Map<String, Plot>> mappings, String key,
			Map<String, Plot> plotMap) {

		Iterator<String> fieldNames = node.fieldNames();
		while (fieldNames.hasNext()) {
			String fieldName = fieldNames.next();
			if (node.get(fieldName).isArray()) {
				logger.info("process array ===========: {} ", node.get(fieldName));
				ArrayNode bucketNodes = (ArrayNode) node.get(fieldName);
				bucketNodes.forEach(bucketNode -> {
					logger.info("2nd level bucket node = {} ", bucketNode);
					process(bucketNode, mappings, key, bucketNode.findValue(KEY).asText(), plotMap);
				});

			} else if (node.get(fieldName).isObject() && node.get(fieldName).get(VALUE) != null) {
				logger.info("process lowest object ===========: {} ", node.get(fieldName));
				logger.info("SEARCH - key value pairs: {} , {} ", fieldName, node.get(fieldName).get(VALUE));
				process(node.get(fieldName), mappings, key, fieldName, plotMap);

			} else {
				processNestedObjects(node.get(fieldName), mappings, key, plotMap);
			}

		}

	}

}
