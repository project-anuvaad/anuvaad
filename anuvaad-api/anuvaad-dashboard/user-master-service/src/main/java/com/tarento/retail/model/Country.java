package com.tarento.retail.model;

/**
 * 
 * @author Darshan Nagesh
 *
 */


public class Country {
	private String key;
	private Long id;
	private String name;
	private String code; 
	private String displayName;
	private Boolean isDefault;
	private String currency;
	private String dailingCode;
	private String logoUrl;
	
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public String getDailingCode() {
		return dailingCode;
	}
	public void setDailingCode(String dailingCode) {
		this.dailingCode = dailingCode;
	}
	public Boolean getIsDefault() {
		return isDefault;
	}
	public void setIsDefault(Boolean isDefault) {
		this.isDefault = isDefault;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getDisplayName() {
		return displayName;
	}
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getLogoUrl() {
		return logoUrl;
	}
	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}
	
	
	
}

