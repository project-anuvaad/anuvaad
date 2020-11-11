package org.tarento.retail.util;

/**
 * 
 * @author Darshan Nagesh
 *
 */

public interface ResponseMessages {
	
	public interface StandardKeysToCompare { 
		final String ERROR_STATUS_CODE = "javax.servlet.error.status_code";
		final String UNAUTHORIZED_FILTER_SOURCE = "pre:RbacFilter"; 
		final String INVALID_AUTH_FILTER_SOURCE = "pre:AuthFilter"; 
		final String ERROR_STATUS_MESSAGE = "javax.servlet.error.message";
		
		
	}

	public interface FailureMessages { 
		final String INVALID_SESSION = "Session has expired. Please login again and continue";
		final String INVALID_AUTH_TOKEN = "Invalid Token ID. Please login again and continue";
	}
}
