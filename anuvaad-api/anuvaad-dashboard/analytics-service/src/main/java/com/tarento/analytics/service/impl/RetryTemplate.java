package com.tarento.analytics.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import javax.naming.ServiceUnavailableException;

/**
 * Wraps rest template with retry
 */
@Component
public class RetryTemplate {

    @Autowired
    private RestTemplate restTemplate;

    @Retryable(value = {RuntimeException.class, ResourceAccessException.class, ServiceUnavailableException.class},
            maxAttemptsExpression = "#{${service.retry.maxAttempts}}",
            backoff = @Backoff(delayExpression = "#{${service.retry.backoff.delay}}"))
    public ResponseEntity<Object> postForEntity(String url, Object request) {
        return restTemplate.postForEntity(url, request, Object.class);
    }

    @Retryable(value = {RuntimeException.class, ResourceAccessException.class, ServiceUnavailableException.class},
            maxAttemptsExpression = "#{${service.retry.maxAttempts}}",
            backoff = @Backoff(delayExpression = "#{${service.retry.backoff.delay}}"))
    public ResponseEntity<Object> getForEntity(String url, HttpEntity headerEntity) {
        return restTemplate.exchange(url, HttpMethod.GET, headerEntity, Object.class);
    }

}

