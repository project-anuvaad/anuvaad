package com.tarento.analytics.producer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsProducer {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(AnalyticsProducer.class);

	@Autowired
	private KafkaTemplate<String, Object> kafkaTemplate;
	
	public void pushToPipeline(Object object, String topic, String key) {
		LOGGER.info("Pushing data to : " + topic);
		kafkaTemplate.send(topic, key, object);
	}
}

