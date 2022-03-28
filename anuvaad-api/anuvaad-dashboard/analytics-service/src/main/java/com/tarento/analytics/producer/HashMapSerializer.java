package com.tarento.analytics.producer;

import java.util.Map;

import org.apache.kafka.common.serialization.Serializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HashMapSerializer implements Serializer<Map> {

	private static final Logger logger = LoggerFactory.getLogger(HashMapSerializer.class);

	@Override
	public void close() {
		// TODO Auto-generated method stub
	}

	@Override
	public void configure(Map<String, ?> arg0, boolean arg1) {
		// TODO Auto-generated method stub
	}

	@Override
	public byte[] serialize(String topic, Map data) {
		byte[] value = null;
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			value = objectMapper.writeValueAsString(data).getBytes();
		} catch (JsonProcessingException e) {
			logger.error("Exception in serialize {} ", e.getMessage());
		}
		return value;
	}
}