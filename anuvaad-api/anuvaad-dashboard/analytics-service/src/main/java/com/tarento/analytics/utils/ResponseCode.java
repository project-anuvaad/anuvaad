package com.tarento.analytics.utils;

import com.tarento.analytics.constant.Constants;

/**
 * 
 * @author Abhishek
 *
 */
public enum ResponseCode {
    UnAuthorised(Constants.UNAUTHORIZED_ID, Constants.UNAUTHORIZED), Success(
    		Constants.SUCCESS_ID, Constants.SUCCESS),FAILURE(
	    	    Constants.FAILURE_ID, Constants.PROCESS_FAIL);
    /**
     * error code contains int value
     */
    private int errorCode;
    /**
     * errorMessage contains proper error message.
     */
    private String errorMessage;



    /**
     * @param errorCode
     * @param errorMessage
     */
    private ResponseCode(int errorCode, String errorMessage) {
	this.errorCode = errorCode;
	this.errorMessage = errorMessage;
    }

    /**
     * 
     * @param errorCode
     * @return
     */
    public String getMessage(int errorCode) {
	return "";
    }

    /**
     * @return
     */
    public int getErrorCode() {
	return errorCode;
    }

    /**
     * @param errorCode
     */
    public void setErrorCode(int errorCode) {
	this.errorCode = errorCode;
    }

    /**
     * @return
     */
    public String getErrorMessage() {
	return errorMessage;
    }

    /**
     * @param errorMessage
     */
    public void setErrorMessage(String errorMessage) {
	this.errorMessage = errorMessage;
    }

    /**
     * This method will provide status message based on code
     * 
     * @param code
     * @return String
     */
    public static String getResponseMessage(int code) {
	String value = "";
	ResponseCode responseCodes[] = ResponseCode.values();
	for (ResponseCode actionState : responseCodes) {
	    if (actionState.getErrorCode() == code) {
		value = actionState.getErrorMessage();
	    }
	}
	return value;
    }
}
