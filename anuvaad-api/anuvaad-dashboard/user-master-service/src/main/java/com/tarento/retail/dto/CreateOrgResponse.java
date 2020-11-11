package com.tarento.retail.dto;

public class CreateOrgResponse {

	private Long id;
	private String logoUrl;
	private String orgCode;
	private String orgPin;
	private String orgDomain;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getLogoUrl() {
		return logoUrl;
	}
	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}
	public String getOrgCode() {
		return orgCode;
	}
	public void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}
	public String getOrgPin() {
		return orgPin;
	}
	public void setOrgPin(String orgPin) {
		this.orgPin = orgPin;
	}
	public String getOrgDomain() {
		return orgDomain;
	}
	public void setOrgDomain(String orgDomain) {
		this.orgDomain = orgDomain;
	}
	
	
}
