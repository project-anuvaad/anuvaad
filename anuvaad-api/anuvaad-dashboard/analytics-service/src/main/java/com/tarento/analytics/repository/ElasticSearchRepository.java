package com.tarento.analytics.repository;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.tarento.analytics.dto.MappingDto;
import com.tarento.analytics.model.Transaction;

/**
 * This Repository Class is used to perform the transactions of storing the data
 * into the Elastic Search Repository
 * 
 * @author Darshan Nagesh
 *
 */
@Service
public class ElasticSearchRepository {

	public static final Logger LOGGER = LoggerFactory.getLogger(ElasticSearchRepository.class);

	private final RestTemplate restTemplate;

	public ElasticSearchRepository(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	/**
	 * Based on the Transaction Index Data Obtained and the URL with Headers, this
	 * method will put the Data obtained on the Elastic Search Database and returns
	 * the response in the form of Positive or Negative outcome (True Or False)
	 * 
	 * @param transactionIndex
	 * @param url
	 * @param headers
	 * @return
	 */
	public Boolean saveTransaction(Transaction transaction, String url, HttpHeaders headers) {
		ResponseEntity<Map> map = null;
		try {
			map = restTemplate.exchange(url, HttpMethod.PUT, new HttpEntity<>(transaction, headers), Map.class);
		} catch (final HttpClientErrorException httpClientErrorException) {
			LOGGER.error("Error : " + httpClientErrorException);
		} catch (HttpServerErrorException httpServerErrorException) {
			LOGGER.error("Error : " + httpServerErrorException);
		} catch (Exception e) {
			LOGGER.error("Error : " + e);
		}
		if (map != null && (map.getStatusCode() != null && (map.getStatusCode() == HttpStatus.OK)
				|| (map.getStatusCode() == HttpStatus.CREATED))) {
			return true;
		}
		return false;
	}

	// create index
	public Boolean createTransactionIndex(MappingDto dto, String url, HttpHeaders headers) {
		ResponseEntity<Map> map = null;
		try {
			LOGGER.info("Each Channel Content : " + dto.toString());
			map = restTemplate.exchange(url, HttpMethod.PUT, new HttpEntity<>(dto, headers), Map.class);
		} catch (final HttpClientErrorException httpClientErrorException) {
			LOGGER.error("Error : " + httpClientErrorException);
		} catch (HttpServerErrorException httpServerErrorException) {
			LOGGER.error("Error : " + httpServerErrorException);
		} catch (Exception e) {
			LOGGER.error("Error : " + e);
		}
		if (map != null && (map.getStatusCode() != null && (map.getStatusCode() == HttpStatus.OK)
				|| (map.getStatusCode() == HttpStatus.CREATED))) {
			return true;
		}
		return false;
	}

}
