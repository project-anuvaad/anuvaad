package com.tarento.analytics.org.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.CummulativeDataRequestDto;
import com.tarento.analytics.dto.DashboardHeaderDto;
import com.tarento.analytics.dto.RoleDto;
import com.tarento.analytics.enums.AlwaysView;
import com.tarento.analytics.enums.ChartType;
import com.tarento.analytics.exception.AINException;
import com.tarento.analytics.handler.IResponseHandler;
import com.tarento.analytics.handler.InsightsHandler;
import com.tarento.analytics.handler.InsightsHandlerFactory;
import com.tarento.analytics.handler.ResponseHandlerFactory;
import com.tarento.analytics.model.InsightsConfiguration;
import com.tarento.analytics.service.QueryService;
import com.tarento.analytics.service.impl.RestService;

@Component
public class TarentoServiceImpl implements ClientService {

	public static final Logger logger = LoggerFactory.getLogger(TarentoServiceImpl.class);
	ObjectMapper mapper = new ObjectMapper();
	char insightPrefix = 'i';

	@Autowired
	private QueryService queryService;

	@Autowired
	private RestService restService;

	@Autowired
	private ConfigurationLoader configurationLoader;

	@Autowired
	private ResponseHandlerFactory responseHandlerFactory;

	@Autowired
	private InsightsHandlerFactory insightsHandlerFactory;

	@Override
	public AggregateDto getAggregatedData(String profileName, AggregateRequestDto request, List<RoleDto> roles)
			throws AINException, IOException {
		// Read visualization Code
		String internalChartId = request.getVisualizationCode();
		ObjectNode aggrObjectNode = JsonNodeFactory.instance.objectNode();
		ObjectNode insightAggrObjectNode = JsonNodeFactory.instance.objectNode();
		ObjectNode nodes = JsonNodeFactory.instance.objectNode();
		ObjectNode insightNodes = JsonNodeFactory.instance.objectNode();
		Boolean continueWithInsight = Boolean.FALSE;

		// Load Chart API configuration to Object Node for easy retrieval later
		ObjectNode node = configurationLoader.getConfigForProfile(profileName,
				Constants.ConfigurationFiles.CHART_API_CONFIG);
		ObjectNode chartNode = (ObjectNode) node.get(internalChartId);
		InsightsConfiguration insightsConfig = null;
		if (chartNode.get(Constants.JsonPaths.INSIGHT) != null) {
			insightsConfig = mapper.treeToValue(chartNode.get(Constants.JsonPaths.INSIGHT),
					InsightsConfiguration.class);
		}
		ChartType chartType = ChartType.fromValue(chartNode.get(Constants.JsonPaths.CHART_TYPE).asText());
		boolean isDefaultPresent = chartType.equals(ChartType.LINE)
				&& chartNode.get(Constants.JsonPaths.INTERVAL) != null;
		boolean isRequestContainsInterval = null == request.getRequestDate() ? false
				: (request.getRequestDate().getInterval() != null && !request.getRequestDate().getInterval().isEmpty());
		String interval = isRequestContainsInterval ? request.getRequestDate().getInterval()
				: (isDefaultPresent ? chartNode.get(Constants.JsonPaths.INTERVAL).asText() : "");
		if (chartNode.get(Constants.JsonPaths.ALWAYS_VIEW) != null) {
			if (AlwaysView.MONTHWISE
					.equals(AlwaysView.fromValue(chartNode.get(Constants.JsonPaths.ALWAYS_VIEW).asText()))) {
				changeDatesToMonthWiseView(request);
			}
		}
		applyVisibilityTint(profileName, request, roles);
		executeConfiguredQueries(chartNode, aggrObjectNode, nodes, request, interval);
		request.setChartNode(chartNode);
		ChartType masqueradeChartType = null;
		if (request.getVisualizationCode().equals("stateProfessionTable")) {
			masqueradeChartType = ChartType.fromValue("dynamictable");
		} else {
			masqueradeChartType = chartType;
		}
		IResponseHandler responseHandler = responseHandlerFactory.getInstance(masqueradeChartType);
		AggregateDto aggregateDto = new AggregateDto();
		if (aggrObjectNode.fields().hasNext()) {
			aggregateDto = responseHandler.translate(profileName, request, aggrObjectNode);
		}

		if (insightsConfig != null && StringUtils.isNotBlank(insightsConfig.getInsightInterval())) {
			continueWithInsight = getInsightsDate(request, insightsConfig.getInsightInterval());
			if (continueWithInsight) {
				String insightVisualizationCode = insightPrefix + request.getVisualizationCode();
				request.setVisualizationCode(insightVisualizationCode);
				executeConfiguredQueries(chartNode, insightAggrObjectNode, insightNodes, request, interval);
				request.setChartNode(chartNode);
				if (request.getVisualizationCode().equals("stateProfessionTable")) {
					masqueradeChartType = ChartType.fromValue("dynamictable");
				} else {
					masqueradeChartType = chartType;
				}
				responseHandler = responseHandlerFactory.getInstance(masqueradeChartType);
				if (insightAggrObjectNode.fields().hasNext()) {
					responseHandler.translate(profileName, request, insightAggrObjectNode);
				}
				InsightsHandler insightsHandler = insightsHandlerFactory.getInstance(chartType);
				aggregateDto = insightsHandler.getInsights(aggregateDto, request.getVisualizationCode(),
						request.getModuleLevel(), insightsConfig);
			}
		}

		return aggregateDto;
	}

	private void applyVisibilityTint(String profileName, AggregateRequestDto request, List<RoleDto> roles) {
		ObjectNode roleMappingNode = configurationLoader.getConfigForProfile(profileName,
				ConfigurationLoader.ROLE_DASHBOARD_CONFIG);
		ArrayNode rolesArray = (ArrayNode) roleMappingNode.findValue(Constants.DashBoardConfig.ROLES);

		rolesArray.forEach(role -> {
			Object roleId = roles.stream()
					.filter(x -> role.get(Constants.DashBoardConfig.ROLE_ID).asLong() == (x.getId())).findAny()
					.orElse(null);
			if (null != roleId) {
				// checks role has given db id
				role.get(Constants.DashBoardConfig.DASHBOARDS).forEach(db -> {
					if (db.get(Constants.DashBoardConfig.ID).asText().equalsIgnoreCase(request.getDashboardId())) {
						ArrayNode visibilityArray = (ArrayNode) db.get(Constants.DashBoardConfig.VISIBILITY);
						if (visibilityArray != null) {
							Map<String, Object> filterMap = new HashMap<>();
							visibilityArray.forEach(visibility -> {
								String key = visibility.get(Constants.DashBoardConfig.KEY).asText();
								ArrayNode valueArray = (ArrayNode) visibility.get(Constants.DashBoardConfig.VALUE);
								List<String> valueList = new ArrayList<>();
								valueArray.forEach(value -> {
									valueList.add(value.asText());
								});
								if (!request.getFilters().containsKey(key)) {
									filterMap.put(key, valueList);
								}
							});
							request.getFilters().putAll(filterMap);
						}
					}
				});
			}
		});
	}

	private void executeConfiguredQueries(ObjectNode chartNode, ObjectNode aggrObjectNode, ObjectNode nodes,
			AggregateRequestDto request, String interval) {
		ArrayNode queries = (ArrayNode) chartNode.get(Constants.JsonPaths.QUERIES);
		queries.forEach(query -> {
			String module = query.get(Constants.JsonPaths.MODULE).asText();
			if (request.getModuleLevel().equals(Constants.Modules.HOME_REVENUE)
					|| request.getModuleLevel().equals(Constants.Modules.HOME_SERVICES)
					|| query.get(Constants.JsonPaths.MODULE).asText().equals(Constants.Modules.COMMON)
					|| request.getModuleLevel().equals(module)) {

				String indexName = query.get(Constants.JsonPaths.INDEX_NAME).asText();
				ObjectNode objectNode = queryService.getChartConfigurationQuery(request, query, indexName, interval);
				String instance = query.get(Constants.JsonPaths.ES_INSTANCE).asText();
				try {
					JsonNode aggrNode = restService.search(indexName, objectNode.toString(), instance);
					if (nodes.has(indexName)) {
						indexName = indexName + "_1";
					}
					logger.info("indexName +" + indexName);
					nodes.set(indexName, aggrNode.get(Constants.JsonPaths.AGGREGATIONS));
				} catch (Exception e) {
					logger.error("Encountered an Exception while Executing the Query : " + e.getMessage());
				}
				aggrObjectNode.set(Constants.JsonPaths.AGGREGATIONS, nodes);

			}
		});
	}

	private void changeDatesToMonthWiseView(AggregateRequestDto request) {
		Long daysBetween = daysBetween(Long.parseLong(request.getRequestDate().getStartDate()),
				Long.parseLong(request.getRequestDate().getEndDate()));
		if (daysBetween <= 30) {
			Calendar startCal = Calendar.getInstance();
			Calendar endCal = Calendar.getInstance();
			startCal.setTime(new Date(Long.parseLong(request.getRequestDate().getStartDate())));
			startCal.set(Calendar.DAY_OF_MONTH, 1);
			endCal.setTime(new Date(Long.parseLong(request.getRequestDate().getEndDate())));
			int month = endCal.get(Calendar.MONTH) + 1;
			endCal.set(Calendar.MONTH, month + 1);
			request.getRequestDate().setStartDate(String.valueOf(startCal.getTimeInMillis()));
			request.getRequestDate().setEndDate(String.valueOf(endCal.getTimeInMillis()));
		}
	}

	private Boolean getInsightsDate(AggregateRequestDto request, String insightInterval) {
		Long daysBetween = daysBetween(Long.parseLong(request.getRequestDate().getStartDate()),
				Long.parseLong(request.getRequestDate().getEndDate()));
		if (insightInterval.equalsIgnoreCase(Constants.Interval.month.toString()) && daysBetween > 32) {
			return Boolean.FALSE;
		}
		if (insightInterval.equalsIgnoreCase(Constants.Interval.week.toString()) && daysBetween > 8) {
			return Boolean.FALSE;
		}
		if (insightInterval.equalsIgnoreCase(Constants.Interval.year.toString()) && daysBetween > 366) {
			return Boolean.FALSE;
		}
		Calendar startCal = Calendar.getInstance();
		Calendar endCal = Calendar.getInstance();
		startCal.setTime(new Date(Long.parseLong(request.getRequestDate().getStartDate())));
		endCal.setTime(new Date(Long.parseLong(request.getRequestDate().getEndDate())));
		if (insightInterval.equalsIgnoreCase(Constants.Interval.month.toString())) {
			startCal.add(Calendar.MONTH, -1);
			endCal.add(Calendar.MONTH, -1);
		} else if (insightInterval.equalsIgnoreCase(Constants.Interval.week.toString())) {
			startCal.add(Calendar.WEEK_OF_YEAR, -1);
			endCal.add(Calendar.WEEK_OF_YEAR, -1);
		} else if (StringUtils.isBlank(insightInterval)
				|| insightInterval.equalsIgnoreCase(Constants.Interval.year.toString())) {
			startCal.add(Calendar.YEAR, -1);
			endCal.add(Calendar.YEAR, -1);
		}
		request.getRequestDate().setStartDate(String.valueOf(startCal.getTimeInMillis()));
		request.getRequestDate().setEndDate(String.valueOf(endCal.getTimeInMillis()));
		return Boolean.TRUE;
	}

	public long daysBetween(Long start, Long end) {
		return TimeUnit.MILLISECONDS.toDays(Math.abs(end - start));
	}

	@Override
	public List<DashboardHeaderDto> getHeaderData(CummulativeDataRequestDto requestDto, List<RoleDto> roles)
			throws AINException {
		// TODO Auto-generated method stub
		return null;
	}

}
