package com.tarento.analytics.dto;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "code", "name", "description", "logoId", "imageId", "domainUrl", "type", "twitterUrl",
		"facebookUrl", "emailId", "OfficeTimings", "city", "address", "contactNumber" })
public class Tenant {

	@JsonProperty("code")
	private String code;
	@JsonProperty("name")
	private String name;
	@JsonProperty("description")
	private String description;
	@JsonProperty("logoId")
	private String logoId;
	@JsonProperty("imageId")
	private Object imageId;
	@JsonProperty("domainUrl")
	private String domainUrl;
	@JsonProperty("type")
	private String type;
	@JsonProperty("twitterUrl")
	private Object twitterUrl;
	@JsonProperty("facebookUrl")
	private Object facebookUrl;
	@JsonProperty("emailId")
	private String emailId;
	@JsonProperty("city")
	private City city;
	@JsonProperty("address")
	private String address;
	@JsonProperty("contactNumber")
	private String contactNumber;
	@JsonIgnore
	private Map<String, Object> additionalProperties = new HashMap<>();

	@JsonProperty("code")
	public String getCode() {
		return code;
	}

	@JsonProperty("code")
	public void setCode(String code) {
		this.code = code;
	}

	@JsonProperty("name")
	public String getName() {
		return name;
	}

	@JsonProperty("name")
	public void setName(String name) {
		this.name = name;
	}

	@JsonProperty("description")
	public String getDescription() {
		return description;
	}

	@JsonProperty("description")
	public void setDescription(String description) {
		this.description = description;
	}

	@JsonProperty("logoId")
	public String getLogoId() {
		return logoId;
	}

	@JsonProperty("logoId")
	public void setLogoId(String logoId) {
		this.logoId = logoId;
	}

	@JsonProperty("imageId")
	public Object getImageId() {
		return imageId;
	}

	@JsonProperty("imageId")
	public void setImageId(Object imageId) {
		this.imageId = imageId;
	}

	@JsonProperty("domainUrl")
	public String getDomainUrl() {
		return domainUrl;
	}

	@JsonProperty("domainUrl")
	public void setDomainUrl(String domainUrl) {
		this.domainUrl = domainUrl;
	}

	@JsonProperty("type")
	public String getType() {
		return type;
	}

	@JsonProperty("type")
	public void setType(String type) {
		this.type = type;
	}

	@JsonProperty("twitterUrl")
	public Object getTwitterUrl() {
		return twitterUrl;
	}

	@JsonProperty("twitterUrl")
	public void setTwitterUrl(Object twitterUrl) {
		this.twitterUrl = twitterUrl;
	}

	@JsonProperty("facebookUrl")
	public Object getFacebookUrl() {
		return facebookUrl;
	}

	@JsonProperty("facebookUrl")
	public void setFacebookUrl(Object facebookUrl) {
		this.facebookUrl = facebookUrl;
	}

	@JsonProperty("emailId")
	public String getEmailId() {
		return emailId;
	}

	@JsonProperty("emailId")
	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	@JsonProperty("city")
	public City getCity() {
		return city;
	}

	@JsonProperty("city")
	public void setCity(City city) {
		this.city = city;
	}

	@JsonProperty("address")
	public String getAddress() {
		return address;
	}

	@JsonProperty("address")
	public void setAddress(String address) {
		this.address = address;
	}

	@JsonProperty("contactNumber")
	public String getContactNumber() {
		return contactNumber;
	}

	@JsonProperty("contactNumber")
	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	@JsonAnyGetter
	public Map<String, Object> getAdditionalProperties() {
		return this.additionalProperties;
	}

	@JsonAnySetter
	public void setAdditionalProperty(String name, Object value) {
		this.additionalProperties.put(name, value);
	}

	@Override
	public String toString() {
		return "Tenant [code=" + code + ", name=" + name + ", description=" + description + ", logoId=" + logoId
				+ ", imageId=" + imageId + ", domainUrl=" + domainUrl + ", type=" + type + ", twitterUrl=" + twitterUrl
				+ ", facebookUrl=" + facebookUrl + ", emailId=" + emailId 
				+ ", city=" + city + ", address=" + address + ", contactNumber=" + contactNumber
				+ ", additionalProperties=" + additionalProperties + ", getCode()=" + getCode() + ", getName()="
				+ getName() + ", getDescription()=" + getDescription() + ", getLogoId()=" + getLogoId()
				+ ", getImageId()=" + getImageId() + ", getDomainUrl()=" + getDomainUrl() + ", getType()=" + getType()
				+ ", getTwitterUrl()=" + getTwitterUrl() + ", getFacebookUrl()=" + getFacebookUrl() + ", getEmailId()="
				+ getEmailId() + ", getCity()=" + getCity()
				+ ", getAddress()=" + getAddress() + ", getContactNumber()=" + getContactNumber()
				+ ", getAdditionalProperties()=" + getAdditionalProperties() + ", getClass()=" + getClass()
				+ ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + "]";
	}

	
	
	
}
