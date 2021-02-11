package com.tarento.retail.util;


public class CustomException {
	public CustomException() {
	}
	
	public CustomException(Integer errorCode, String errorMessage, String errorMessageCode, CustomResponse response) { 
		this.errorCode = errorCode; 
		this.errorMessage = errorMessage; 
		this.errorMessageCode = errorMessageCode; 
		this.response = response; 
	}

	protected Integer errorCode;
	protected String errorMessage;
	protected String errorMessageCode;
	protected CustomResponse response;

	public Integer getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(Integer errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getErrorMessageCode() {
		return errorMessageCode;
	}

	public void setErrorMessageCode(String errorMessageCode) {
		this.errorMessageCode = errorMessageCode;
	}

	public void setResponse(CustomResponse response) {
		this.response = response;
	}

	public CustomException(int errorCode, String errorMessage) {
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
		this.errorMessageCode = Constants.ERROR_MESSAGE_VALUE + errorCode;
	}
}
