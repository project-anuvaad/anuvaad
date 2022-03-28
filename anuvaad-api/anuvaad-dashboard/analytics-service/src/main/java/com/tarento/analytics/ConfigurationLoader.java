package com.tarento.analytics;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Component("configurationLoader")
public class ConfigurationLoader {

	private static Logger logger = LoggerFactory.getLogger(ConfigurationLoader.class);
	private Map<String, ObjectNode> nameContentMap = new HashMap<>();
	@Autowired
	private ResourceLoader resourceLoader;
	@Autowired
	private ObjectMapper objectMapper;

	private static final String RESOURCE_LOCATION = "classpath*:schema/*.json";

	public static final String ROLE_DASHBOARD_CONFIG = "RoleDashboardMappingsConf.json";
	public static final String MASTER_DASHBOARD_CONFIG = "MasterDashboardConfig.json";

	/**
	 * Loads config resources
	 * 
	 * @throws IOException
	 * 
	 * @throws Exception
	 */
	@PostConstruct
	public void loadResources() throws IOException {
		Resource[] resources = getResources(RESOURCE_LOCATION);

		for (Resource resource : resources) {
			String jsonContent = getContent(resource);
			ObjectNode jsonNode = (ObjectNode) objectMapper.readTree(jsonContent);
			nameContentMap.put(resource.getFilename(), jsonNode);
		}
		logger.info("Number of resources loaded {} ", nameContentMap.size());

	}

	/**
	 * Obtains a ObjectNode w.r.t given resource/file name in classpath*:schema
	 * 
	 * @param name
	 * @return
	 */
	public ObjectNode getConfigForProfile(String profileName, String name) {
		return nameContentMap.get(profileName + "_" + name);
	}

	/**
	 * Loads all the resources/files with a given pattern *.json
	 * 
	 * @param pattern
	 *            path with *json
	 * @return
	 * @throws IOException
	 */
	private Resource[] getResources(String pattern) throws IOException {
		return ResourcePatternUtils.getResourcePatternResolver(resourceLoader).getResources(pattern);
	}

	/**
	 * Returns a content of resource
	 * 
	 * @param resource
	 * @return
	 */
	private String getContent(Resource resource) {
		String content = null;
		try {
			InputStream is = resource.getInputStream();
			byte[] encoded = IOUtils.toByteArray(is);
			content = new String(encoded, StandardCharsets.UTF_8);

		} catch (IOException e) {
			logger.error("Cannot load resource {} ", resource.getFilename());

		}
		return content;
	}

}
