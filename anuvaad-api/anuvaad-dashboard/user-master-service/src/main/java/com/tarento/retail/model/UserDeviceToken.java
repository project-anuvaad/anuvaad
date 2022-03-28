package com.tarento.retail.model;

/**
 * 
 * @author Darshan Nagesh
 *
 */

public class UserDeviceToken {
	
	private Long userId;
	private String deviceToken;
	private String deviceId;
	
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getDeviceToken() {
		return deviceToken;
	}
	public void setDeviceToken(String deviceToken) {
		this.deviceToken = deviceToken;
	}
	public String getDeviceId() {
		return deviceId;
	}
	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	} 
	
	
	

}
