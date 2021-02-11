package com.tarento.analytics.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tarento.analytics.constant.Constants;

import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import static javax.servlet.http.HttpServletRequest.BASIC_AUTH;
import static org.apache.commons.codec.CharEncoding.US_ASCII;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class RestService {
	public static final Logger LOGGER = LoggerFactory.getLogger(RestService.class);

	@Value("${services.esindexer.primary.host}")
	private String indexServicePrimaryHost;
//	@Value("${services.esindexer.secondary.host}")
//	private String indexServiceSecondaryHost;
//	@Value("${services.esindexer.ternary.host}")
//	private String indexServiceTernaryHost;
	@Value("${es.services.esindexer.host.search}")
	private String indexServiceHostSearch;
	@Value("${services.esindexer.primary.username}")
	private String primaryUsername;
	@Value("${services.esindexer.primary.password}")
	private String primaryPassword;
//	@Value("${services.esindexer.secondary.username}")
//	private String secondaryUsername;
//	@Value("${services.esindexer.secondary.password}")
//	private String secondaryPassword;
//	@Value("${services.esindexer.ternary.username}")
//	private String ternaryUsername;
//	@Value("${services.esindexer.ternary.password}")
//	private String ternaryPassword;
//	@Value("${services.esindexer.quadnary.username}")
//	private String quadnaryUsername;
//	@Value("${services.esindexer.quadnary.password}")
//	private String quadnaryPassword;
//	@Value("${services.esindexer.quadnary.host}")
//	private String indexServiceQuadnaryHost;

	@Autowired
	private RetryTemplate retryTemplate;

	/**
	 * search on Elastic search for a search query
	 * 
	 * @param index
	 *            elastic search index name against which search operation
	 * @param searchQuery
	 *            search query as request body
	 * @return
	 * @throws IOException
	 */
	public JsonNode search(String index, String searchQuery, String instance) {
		String url = "";
		if (instance.equals(Constants.PRIMARY)) {
			url = (indexServicePrimaryHost) + index + indexServiceHostSearch;
		} 
//			else if (instance.equals(Constants.SECONDARY)) {
//				url = (indexServiceSecondaryHost) + index + indexServiceHostSearch;
//			} else if (instance.equals(Constants.TERNARY)) {
//				url = (indexServiceTernaryHost) + index + indexServiceHostSearch;
//			} else if (instance.equals(Constants.QUADNARY)) {
//				url = (indexServiceQuadnaryHost) + index + indexServiceHostSearch;
//			}

		HttpHeaders headers = getHttpHeaders(instance);
		headers.setContentType(MediaType.APPLICATION_JSON);
		LOGGER.info("ES URL hitting : " + url);
		LOGGER.info("Index Name : " + index);
		LOGGER.info("Searching ES for Query: " + searchQuery);
		HttpEntity<String> requestEntity = new HttpEntity<>(searchQuery, headers);
		String reqBody = requestEntity.getBody();
		JsonNode responseNode = null;

		try {
			ResponseEntity<Object> response = retryTemplate.postForEntity(url, requestEntity);
			responseNode = new ObjectMapper().convertValue(response.getBody(), JsonNode.class);
		} catch (HttpClientErrorException e) {
			LOGGER.error("client error while searching ES : {} ", e.getMessage());
		}
		return responseNode;
	}

	/**
	 * makes a client rest api call of Http POST option
	 * 
	 * @param uri
	 * @param authToken
	 * @param requestNode
	 * @return
	 * @throws IOException
	 */
	public JsonNode post(String uri, String authToken, JsonNode requestNode) {

		HttpHeaders headers = new HttpHeaders();
		if (authToken != null && !authToken.isEmpty())
			headers.add("Authorization", "Bearer " + authToken);
		headers.setContentType(MediaType.APPLICATION_JSON);

		LOGGER.info("Request Node: " + requestNode);
		HttpEntity<String> requestEntity = null;
		if (requestNode != null)
			requestEntity = new HttpEntity<>(requestNode.toString(), headers);
		else
			requestEntity = new HttpEntity<>("{}", headers);

		JsonNode responseNode = null;

		try {
			ResponseEntity<Object> response = retryTemplate.postForEntity(uri, requestEntity);
			responseNode = new ObjectMapper().convertValue(response.getBody(), JsonNode.class);
			LOGGER.info("RestTemplate response :- " + responseNode);

		} catch (HttpClientErrorException e) {
			LOGGER.error("post client exception: " + e.getMessage());
		}
		return responseNode;
	}

	/**
	 * makes a client rest api call of Http GET option
	 * 
	 * @param uri
	 * @param authToken
	 * @return
	 * @throws IOException
	 */
	public JsonNode get(String uri, String authToken) {

		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + authToken);
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<String> headerEntity = new HttpEntity<>("{}", headers);

		JsonNode responseNode = null;
		try {
			ResponseEntity<Object> response = retryTemplate.getForEntity(uri, headerEntity);
			responseNode = new ObjectMapper().convertValue(response.getBody(), JsonNode.class);
			LOGGER.info("RestTemplate response :- " + responseNode);

		} catch (HttpClientErrorException e) {
			LOGGER.error("get client exception: " + e.getMessage());
		}
		return responseNode;
	}

	private HttpHeaders getHttpHeaders(String instance) {
		HttpHeaders headers = new HttpHeaders();
		String username = null;
		String password = null;
		if (instance.equals(Constants.PRIMARY)) {
			username = primaryUsername;
			password = primaryPassword;
		} 
//		else if (instance.equals(Constants.SECONDARY)) {
//			username = secondaryUsername;
//			password = secondaryPassword;
//		} else if (instance.equals(Constants.TERNARY)) {
//			username = ternaryUsername;
//			password = ternaryPassword;
//		} else if (instance.equals(Constants.QUADNARY)) {
//			username = quadnaryUsername;
//			password = quadnaryPassword;
//		}
		String plainCreds = String.format("%s:%s", username, password);
		byte[] plainCredsBytes = plainCreds.getBytes();
		byte[] base64CredsBytes = Base64.encodeBase64(plainCredsBytes);
		String base64Creds = new String(base64CredsBytes);

		headers.add(AUTHORIZATION, "Basic " + base64Creds);
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.setContentType(MediaType.APPLICATION_JSON);

		List<MediaType> mediaTypes = new ArrayList<>();
		mediaTypes.add(MediaType.APPLICATION_JSON);
		headers.setAccept(mediaTypes);
		return headers;
	}

}
