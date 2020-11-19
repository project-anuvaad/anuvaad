package com.tarento.analytics.org.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.dto.*;
import com.tarento.analytics.enums.ChartType;
import com.tarento.analytics.exception.AINException;
import com.tarento.analytics.handler.IResponseHandler;
import com.tarento.analytics.handler.ResponseHandlerFactory;
import com.tarento.analytics.service.QueryService;
import com.tarento.analytics.service.impl.RestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class MdmsServiceImpl implements ClientService {

    public static final Logger logger = LoggerFactory.getLogger(MdmsServiceImpl.class);

    @Autowired
    private QueryService queryService;

    @Autowired
    private RestService restService;

    @Autowired
    private ConfigurationLoader configurationLoader;

    @Autowired
    private ResponseHandlerFactory responseHandlerFactory;

    @Autowired
    private MdmsApiMappings mdmsApiMappings;

    Map<String, List<String>> groupTenantIds;

    @Override
    public AggregateDto getAggregatedData(String profileName, AggregateRequestDto request, List<RoleDto> roles) throws AINException, IOException {
        // Read visualization Code
        String chartId = request.getVisualizationCode();

        // Load Chart API configuration to Object Node for easy retrieval later
        ObjectNode node = configurationLoader.getConfigForProfile(profileName, Constants.ConfigurationFiles.CHART_API_CONFIG);
        ObjectNode chartNode = (ObjectNode) node.get(chartId);
        ChartType chartType = ChartType.fromValue(chartNode.get(Constants.JsonPaths.CHART_TYPE).asText());
        groupTenantIds = mdmsApiMappings.getGroupedTenants((List) request.getFilters().get("tenantId"));


        ObjectNode reponseNode = buildResponse(chartNode, request);
        logger.info("reponseNode do == "+reponseNode);

        //replacing default values by
        request.setChartNode(chartNode);
        IResponseHandler responseHandler = responseHandlerFactory.getInstance(chartType);
        AggregateDto aggregateDto = new AggregateDto();
        if (reponseNode.fields().hasNext()) {

            aggregateDto = responseHandler.translate(profileName, request, reponseNode);
        }
        return aggregateDto;
    }

    public ObjectNode buildResponse(ObjectNode chartNode, AggregateRequestDto request) {

        String plotName = chartNode.get("plotLabel") == null ? "DDR" : chartNode.get("plotLabel").asText();
        ChartType chartType = ChartType.fromValue(chartNode.get(Constants.JsonPaths.CHART_TYPE).asText());
        boolean isDefaultPresent = chartType.equals(ChartType.LINE) && chartNode.get(Constants.JsonPaths.INTERVAL) != null;
        boolean isRequestContainsInterval = null == request.getRequestDate() ? false : (request.getRequestDate().getInterval() != null && !request.getRequestDate().getInterval().isEmpty());
        String interval = isRequestContainsInterval ? request.getRequestDate().getInterval() : (isDefaultPresent ? chartNode.get(Constants.JsonPaths.INTERVAL).asText() : "");

        ObjectNode aggrObjectNode = JsonNodeFactory.instance.objectNode();
        ObjectNode nodes = JsonNodeFactory.instance.objectNode();

        ArrayNode queries = (ArrayNode) chartNode.get(Constants.JsonPaths.QUERIES);
        queries.forEach(query -> {
            AggregateRequestDto requestDto = request;

            String module = query.get(Constants.JsonPaths.MODULE).asText();
            if (request.getModuleLevel().equals(Constants.Modules.HOME_REVENUE) ||
                    request.getModuleLevel().equals(Constants.Modules.HOME_SERVICES) ||
                    query.get(Constants.JsonPaths.MODULE).asText().equals(Constants.Modules.COMMON) ||
                    request.getModuleLevel().equals(module)) {

                String indexName = query.get(Constants.JsonPaths.INDEX_NAME).asText();
                // intercept request + _search operation
                ObjectNode aggrResponse = aggrResponseBuilder(plotName, requestDto, query, indexName, interval);

                if(nodes.has(indexName)) {
                    indexName = indexName + "_1";
                }
                logger.info("indexName +"+indexName);
                nodes.set(indexName, aggrResponse);
                aggrObjectNode.set(Constants.JsonPaths.AGGREGATIONS, nodes);
            }
        });
        return aggrObjectNode;
    }


    private ObjectNode aggrResponseBuilder(String nodeName, AggregateRequestDto requestDto, JsonNode query, String indexName, String interval) {

        ObjectNode nodes = JsonNodeFactory.instance.objectNode();
        ArrayNode bucket = JsonNodeFactory.instance.arrayNode();

        if (groupTenantIds.size() == 0) { //for all DDRS, no tenantId filter present
            bucket = getBuckets(mdmsApiMappings.getAll(), requestDto, query, indexName);
            requestDto.getFilters().clear();

        } else { //comes from global filter
            bucket = getBuckets(groupTenantIds, requestDto, query, indexName);

        }
        ObjectNode buckets = JsonNodeFactory.instance.objectNode();
        buckets.set("buckets", bucket);
        nodes.put(nodeName, buckets);
        return nodes;

    }

    private ArrayNode getBuckets(Map<String, List<String>> map, AggregateRequestDto requestDto, JsonNode query, String indexName) {
        ObjectNode nodes = JsonNodeFactory.instance.objectNode();
        ArrayNode bucket = JsonNodeFactory.instance.arrayNode();
        for (String ddrkey : map.keySet()) {
            List<String> tenantIds = map.get(ddrkey);
            requestDto.getFilters().put("tenantId", tenantIds);
            ObjectNode requestNode = queryService.getChartConfigurationQuery(requestDto, query, indexName, null);
            logger.info("requestNode " + requestNode);

            try {
                ObjectNode aggrNode = (ObjectNode) restService.search(indexName, requestNode.toString(),Constants.PRIMARY);

                if(!ddrkey.equalsIgnoreCase("null")) bucket.add(((ObjectNode) aggrNode.get(Constants.JsonPaths.AGGREGATIONS)).put("key", ddrkey));
            } catch (Exception e) {
                logger.error("Encountered an Exception while Executing the Query : " + e.getMessage());
            }
        }
        return bucket;
    }

    @Override
    public List<DashboardHeaderDto> getHeaderData(CummulativeDataRequestDto requestDto, List<RoleDto> roles) throws AINException {
        return null;
    }
}
