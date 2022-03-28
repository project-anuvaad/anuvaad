package com.tarento.analytics.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.dto.RoleDto;
import com.tarento.analytics.exception.AINException;
import com.tarento.analytics.handler.IResponseHandler;
import com.tarento.analytics.service.MetadataService;

@Service("metadataService")
public class MetadataServiceImpl implements MetadataService {

	public static final Logger logger = LoggerFactory.getLogger(MetadataServiceImpl.class);

	 @Autowired
	 private ConfigurationLoader configurationLoader;
	 
	 @Autowired
	 private ObjectMapper objectMapper;
	 
	 @Autowired
	 private RestTemplate restTemplate;

	 
//	 @Value("${egov.mdms-service.target.url}")
	 private String mdmsServiceTargetUrl;

	@Override
	public ArrayNode getDashboardConfiguration(String profileName, String dashboardId, String catagory, List<RoleDto> roleIds) throws AINException, IOException {


		Calendar cal = Calendar.getInstance();
		cal.set(cal.getWeekYear()-1, Calendar.APRIL, 1);
		Date startDate = cal.getTime();
		Date endDate = new Date();
		
		// To show the date selection if needed 
		// String fyInfo = "From " + Constants.DASHBOARD_DATE_FORMAT.format(startDate) + " to " + Constants.DASHBOARD_DATE_FORMAT.format(endDate);

		ObjectNode dashboardNode = configurationLoader.getConfigForProfile(profileName, ConfigurationLoader.MASTER_DASHBOARD_CONFIG);
		ArrayNode dashboardNodes = (ArrayNode) dashboardNode.findValue(Constants.DashBoardConfig.DASHBOARDS);

		ObjectNode roleMappingNode = configurationLoader.getConfigForProfile(profileName, ConfigurationLoader.ROLE_DASHBOARD_CONFIG);
		ArrayNode rolesArray = (ArrayNode) roleMappingNode.findValue(Constants.DashBoardConfig.ROLES);
		ArrayNode dbArray = JsonNodeFactory.instance.arrayNode();

		rolesArray.forEach(role -> {
			Object roleId = roleIds.stream()
					.filter(x -> role.get(Constants.DashBoardConfig.ROLE_ID).asLong() == (x.getId())).findAny()
					.orElse(null);
			if (null != roleId) {
				ArrayNode visArray = JsonNodeFactory.instance.arrayNode();
				ArrayNode widgetArray = JsonNodeFactory.instance.arrayNode();
				ArrayNode filterArray = JsonNodeFactory.instance.arrayNode();
				// checks role has given db id
				role.get(Constants.DashBoardConfig.DASHBOARDS).forEach(db -> {
					ArrayNode visibilityArray = (ArrayNode) db.findValue(Constants.DashBoardConfig.VISIBILITY);
					ObjectNode copyDashboard = objectMapper.createObjectNode();
					
					JsonNode name = JsonNodeFactory.instance.textNode("");
					JsonNode id = JsonNodeFactory.instance.textNode("");
					// Set the FY Info in Title if needed
					// JsonNode title = JsonNodeFactory.instance.textNode(fyInfo);

					if (db.get(Constants.DashBoardConfig.ID).asText().equalsIgnoreCase(dashboardId)) {
						// dasboardNodes.forEach(dbNode -> {
						for (JsonNode dbNode : dashboardNodes) {
							if (dbNode.get(Constants.DashBoardConfig.ID).asText().equalsIgnoreCase(dashboardId)) {
								logger.info("dbNode: " + dbNode);
								name = dbNode.get(Constants.DashBoardConfig.NAME);
								id = dbNode.get(Constants.DashBoardConfig.ID);
								dbNode.get(Constants.DashBoardConfig.VISUALISATIONS).forEach(visual -> {
									visArray.add(visual);
								});
								dbNode.get(Constants.DashBoardConfig.WIDGET_CHARTS).forEach(widget -> {
									widgetArray.add(widget);
								});
								dbNode.get(Constants.DashBoardConfig.FILTERS).forEach(filter -> {
									JsonNode node = filter.deepCopy(); 
									applyVisilibityLayer(visibilityArray, node);
									filterArray.add(node);
								});
							}
							copyDashboard.set(Constants.DashBoardConfig.NAME, name);
							copyDashboard.set(Constants.DashBoardConfig.ID, id);
							// add TITLE with variable dynamically
							// copyDashboard.set(Constants.DashBoardConfig.TITLE, title);
							copyDashboard.set(Constants.DashBoardConfig.WIDGET_CHARTS, widgetArray);
							copyDashboard.set(Constants.DashBoardConfig.FILTERS, filterArray);
							copyDashboard.set(Constants.DashBoardConfig.VISUALISATIONS, visArray);

						} // );
						dbArray.add(copyDashboard);
					}
				});
			}
		});
		return dbArray;
	}
	
	private void applyVisilibityLayer(ArrayNode visibilityArray, JsonNode filter) {
		try { 
		visibilityArray.forEach(visibility -> {
			String visibilityKey = visibility.get(Constants.DashBoardConfig.KEY).asText();
			String filterKey = filter.get(Constants.DashBoardConfig.KEY).asText();
			if(visibilityKey.equals(filterKey)) { 
				ArrayNode valuesAllowed = (ArrayNode) visibility.get(Constants.DashBoardConfig.VALUE);
				ArrayNode valuesAvailable = (ArrayNode) filter.get(Constants.DashBoardConfig.VALUES);
				ObjectNode availableValuesList = new ObjectMapper().createObjectNode(); 
				ArrayNode availableValuesArray = availableValuesList.putArray(Constants.DashBoardConfig.VALUES);
				List<String> allowedValuesList = new ArrayList<>();
				valuesAllowed.forEach(allowedValue -> { 
					allowedValuesList.add(allowedValue.asText());  
				});
				for(int i = 0 ; i < valuesAvailable.size() ; i++) { 
					if(allowedValuesList.contains(valuesAvailable.get(i).asText())) { 
						availableValuesArray.add(valuesAvailable.get(i).asText());  
					}
				}
				if(availableValuesArray.size() > 0) { 
					ObjectNode filterObjectNode = (ObjectNode) filter;
					filterObjectNode.put(Constants.DashBoardConfig.VALUES, availableValuesArray);
				}
			}
		});
		} catch (Exception e) { 
			
		}
	}
	
	@Override
	public ArrayNode getDashboardsForProfile(String profileName, List<RoleDto> roleIds)
			throws AINException, IOException {

		ObjectNode roleMappingNode = configurationLoader.getConfigForProfile(profileName,
				ConfigurationLoader.ROLE_DASHBOARD_CONFIG);
		ArrayNode rolesArray = (ArrayNode) roleMappingNode.findValue(Constants.DashBoardConfig.ROLES);
		ArrayNode dbArray = JsonNodeFactory.instance.arrayNode();

		rolesArray.forEach(role -> {
			Object roleId = roleIds.stream()
					.filter(x -> role.get(Constants.DashBoardConfig.ROLE_ID).asLong() == (x.getId())).findAny()
					.orElse(null);
			logger.info("roleId: " + roleId);
			RoleDto dto = RoleDto.class.cast(roleId);
			if (dto != null && dto.getId() != null && role.get(Constants.DashBoardConfig.ROLE_ID).asLong() == dto.getId())
				role.get(Constants.DashBoardConfig.DASHBOARDS).forEach(db -> {
					JsonNode name = JsonNodeFactory.instance.textNode("");
					JsonNode id = JsonNodeFactory.instance.textNode("");
					name = db.get(Constants.DashBoardConfig.NAME);
					id = db.get(Constants.DashBoardConfig.ID);
					ObjectNode copyDashboard = objectMapper.createObjectNode();
					copyDashboard.set(Constants.DashBoardConfig.NAME, name);
					copyDashboard.set(Constants.DashBoardConfig.ID, id);
					dbArray.add(copyDashboard);
				});

		});
		return dbArray;
	}

}
