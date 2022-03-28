package org.tarento.retail.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.tarento.retail.util.ResponseGenerator;
import org.tarento.retail.util.ResponseMessages.FailureMessages;
import org.tarento.retail.util.ResponseMessages.StandardKeysToCompare;

import com.fasterxml.jackson.core.JsonProcessingException;




/**
 * 
 * @author Darshan Nagesh
 *
 */

@ControllerAdvice
@RestController
public class ZuulErrorController implements ErrorController {
	
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Value("${error.path:/error}")
	private String errorPath;

	@Override
	public String getErrorPath() {
		return errorPath;
	}

	@RequestMapping(value = "${error.path:/error}", produces = "application/json")
	public @ResponseBody String error(HttpServletRequest request) throws JsonProcessingException {
		logger.info("Request on the Zuul Error Controller : " + request.toString());
		logger.info("Request URL : " + request.getPathInfo());
		logger.info("Error Status Message : "+ request.getAttribute(StandardKeysToCompare.ERROR_STATUS_MESSAGE));
		logger.info("Error Status Code : " + request.getAttribute(StandardKeysToCompare.ERROR_STATUS_CODE));
		if(request.getAttribute(StandardKeysToCompare.ERROR_STATUS_CODE) != null 
				&& Integer.parseInt(String.valueOf(request.getAttribute(StandardKeysToCompare.ERROR_STATUS_CODE))) == 500 
				&& request.getAttribute(StandardKeysToCompare.ERROR_STATUS_MESSAGE).equals(StandardKeysToCompare.UNAUTHORIZED_FILTER_SOURCE)) {
			return ResponseGenerator.unauthorizedResponse(FailureMessages.INVALID_SESSION);
		}
		
		if(request.getAttribute(StandardKeysToCompare.ERROR_STATUS_CODE) != null 
				&& Integer.parseInt(String.valueOf(request.getAttribute(StandardKeysToCompare.ERROR_STATUS_CODE))) == 500 
				&& request.getAttribute(StandardKeysToCompare.ERROR_STATUS_MESSAGE).equals(StandardKeysToCompare.INVALID_AUTH_FILTER_SOURCE)) {
			return ResponseGenerator.invalidSessionResponse(FailureMessages.INVALID_AUTH_TOKEN);
		}
		return ResponseGenerator.invalidSessionResponse(FailureMessages.INVALID_SESSION);
	}
}

