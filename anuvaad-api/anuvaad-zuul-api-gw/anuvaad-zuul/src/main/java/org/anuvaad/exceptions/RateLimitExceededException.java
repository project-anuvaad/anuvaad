package org.anuvaad.exceptions;

import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.config.repository.DefaultRateLimiterErrorHandler;
import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.config.repository.RateLimiterErrorHandler;
import com.netflix.zuul.exception.ZuulException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.netflix.zuul.util.ZuulRuntimeException;
import org.springframework.http.HttpStatus;

public class RateLimitExceededException extends ZuulRuntimeException {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public RateLimitExceededException() {
        super(new ZuulException(HttpStatus.TOO_MANY_REQUESTS.toString(), HttpStatus.TOO_MANY_REQUESTS.value(), "Too Many Requests"));
    }

    public RateLimiterErrorHandler rateLimitErrorHandler() {
        return new DefaultRateLimiterErrorHandler() {
            @Override
            public void handleSaveError(String key, Exception e) {
                logger.info("handleSaveError");
                // custom code
            }

            @Override
            public void handleFetchError(String key, Exception e) {
                logger.info("handleFetchError");
                // custom code
            }

            @Override
            public void handleError(String msg, Exception e) {
                logger.info("handleError");
                // custom code
            }
        };
    }
}
