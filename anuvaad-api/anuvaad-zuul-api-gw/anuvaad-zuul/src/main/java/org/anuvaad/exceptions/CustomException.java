package org.anuvaad.exceptions;

import com.netflix.zuul.exception.ZuulException;
import org.springframework.stereotype.Component;

@Component
public class CustomException extends ZuulException {
    public CustomException(Throwable throwable, String sMessage, int nStatusCode, String errorCause) {
        super(throwable, sMessage, nStatusCode, errorCause);
    }

    public CustomException(String sMessage, int nStatusCode, String errorCause) {
        super(sMessage, nStatusCode, errorCause);
    }

    public CustomException(Throwable throwable, int nStatusCode, String errorCause) {
        super(throwable, nStatusCode, errorCause);
    }
}
