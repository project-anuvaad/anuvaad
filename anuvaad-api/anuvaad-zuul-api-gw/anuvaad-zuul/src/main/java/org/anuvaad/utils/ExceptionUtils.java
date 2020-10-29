package org.anuvaad.utils;

import org.anuvaad.exceptions.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ExceptionUtils {
    private static final Logger logger = LoggerFactory.getLogger(ExceptionUtils.class);

    public static void raiseCustomException(HttpStatus status, String message) {
        throw new RuntimeException(new CustomException(message, status.value(), "CustomException"));
    }

}
