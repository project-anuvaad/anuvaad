package org.tarento.retail.exceptions.zuulExceptions;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

/**
 * 
 * @author Darshan Nagesh
 *
 */

public class RbacException extends Exception{
	
	private static final long serialVersionUID = 1L;
	/**
	 * The primary message for the exception
	 */
	private String message;
	/**
	 * designated error code of the error
	 */
	private String errorCode;
	/**
	 * Server timestamp when error occured
	 */
	private long timeStamp;
	/**
	 * Additional parameters
	 */
	private Map<String,Object> params;
	/**
	 * root Exception object
	 */
	private Exception ex;
	/**
	 * root throwable object
	 */
	private Throwable t;
	/**
	 * variable determining the error been logged to file or not
	 */
	private boolean logged;
	
	private String originalStackTrace;
	
	public RbacException(Exception e) {
		super(e);
		initializeException(e.getMessage());
		processOriginalStackTrace(e.getStackTrace());
	}
	
	public RbacException(Throwable t) {
		super(t);
		initializeException(t.getMessage());
		processOriginalStackTrace(t.getStackTrace());
	}	
	
	public RbacException(String msg) {
		super(msg);
		initializeException(msg);
	}	
	
	public RbacException(String msg, Throwable t) {
		super(msg,t);
		initializeException(msg);
		processOriginalStackTrace(t.getStackTrace());
	}
	
	public RbacException withParam(String name, Object value){
		if(params == null){
			params = new HashMap<String,Object>();
		}
		params.put(name, value);
		return this;
	}
	
	public RbacException withErrorCode(String errorCode){
		this.errorCode=errorCode;
		return this;
	}
	
	private void initializeException(String msg){
		this.timeStamp = System.currentTimeMillis();
		this.message = msg;
	}
	
	public String prepareFullErrorDescription(){
		StringBuilder stackBuilder = new StringBuilder();
		stackBuilder.append("Exception Message : ").append(this.message).append(" \n");
		stackBuilder.append("Exception Time : ").append(new Date(this.timeStamp)).append(" \n");
		stackBuilder.append("Error code : ").append(this.errorCode).append(" \n ");
		if(this.params != null && !this.params.isEmpty()){
			stackBuilder.append(" Parameters : ");
			for(Entry<String,Object> entry : params.entrySet()){
				stackBuilder.append("\n\t ").append(entry.getKey()).append(" : ").append(entry.getValue());
			}
		}
		if(originalStackTrace != null){
			stackBuilder.append("\n stacktrace : ").append(originalStackTrace);
			return stackBuilder.toString();
		}
		StackTraceElement[] stack;
		if(this.ex != null){
			stack = ex.getStackTrace();
		}else if(this.t != null){
			stack = t.getStackTrace();
		}else{
			stack = super.getStackTrace();
		}
		if(stack == null){
			return stackBuilder.toString();
		}
		stackBuilder.append("\n stacktrace : ");
		for(StackTraceElement s : stack){
			stackBuilder.append(" \n ").append(s);
		}
		return stackBuilder.toString();
	}
	
	private void processOriginalStackTrace(StackTraceElement[] stack){
		if(stack == null || stack.length == 0){
			return;
		}
		StringBuilder stackBuilder = new StringBuilder();
		for(StackTraceElement trace : stack){
			stackBuilder.append(trace).append("\n ");
		}
		originalStackTrace = stackBuilder.toString();
	}

	public boolean isLogged() {
		return logged;
	}

	public void setLogged(boolean logged) {
		this.logged = logged;
	}
	
	public RbacException logToFile(String prependingMessage){
		if(!logged){
			if(prependingMessage != null){
				//logger.error(prependingMessage);
			}
			//logger.error(prepareFullErrorDescription());
			logged = true;
		}
		return this;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public long getTimeStamp() {
		return timeStamp;
	}


	public Map<String, Object> getParams() {
		return params;
	}
	
	public void addParamsToMessage(){
		if(params == null){
			return;
		}
		StringBuilder message = new StringBuilder("{ ");
		int i = params.size();
		for(Entry<String, Object> entry :params.entrySet()){
			message.append(entry.getKey()).append(" : ").append(entry.getValue());
			i--;
			if(i>0){
				message.append(", ");
			}
		}
		message.append(" } , ").append(getMessage());
		this.message = message.toString();
	}
}
