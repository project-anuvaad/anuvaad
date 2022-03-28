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
@JsonPropertyOrder({ "name", "localName", "districtCode", "districtName", "regionName", "ulbGrade", "longitude",
		"latitude", "shapeFileLocation", "captcha", "code", "regionCode", "municipalityName" })
public class City {

	@JsonProperty("name")
	private String name;
	@JsonProperty("localName")
	private String localName;
	@JsonProperty("districtCode")
	private String districtCode;
	@JsonProperty("districtName")
	private String districtName;
	@JsonProperty("regionName")
	private String regionName;
	@JsonProperty("ulbGrade")
	private String ulbGrade;
	@JsonProperty("longitude")
	private Double longitude;
	@JsonProperty("latitude")
	private Double latitude;
	@JsonProperty("shapeFileLocation")
	private Object shapeFileLocation;
	@JsonProperty("captcha")
	private Object captcha;
	@JsonProperty("code")
	private String code;
	@JsonProperty("regionCode")
	private String regionCode;
	@JsonProperty("municipalityName")
	private String municipalityName;
	@JsonIgnore
	private Map<String, Object> additionalProperties = new HashMap<>();

	@JsonProperty("name")
	public String getName() {
		return name;
	}

	@JsonProperty("name")
	public void setName(String name) {
		this.name = name;
	}

	@JsonProperty("localName")
	public String getLocalName() {
		return localName;
	}

	@JsonProperty("localName")
	public void setLocalName(String localName) {
		this.localName = localName;
	}

	@JsonProperty("districtCode")
	public String getDistrictCode() {
		return districtCode;
	}

	@JsonProperty("districtCode")
	public void setDistrictCode(String districtCode) {
		this.districtCode = districtCode;
	}

	@JsonProperty("districtName")
	public String getDistrictName() {
		return districtName;
	}

	@JsonProperty("districtName")
	public void setDistrictName(String districtName) {
		this.districtName = districtName;
	}

	@JsonProperty("regionName")
	public String getRegionName() {
		return regionName;
	}

	@JsonProperty("regionName")
	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	@JsonProperty("ulbGrade")
	public String getUlbGrade() {
		return ulbGrade;
	}

	@JsonProperty("ulbGrade")
	public void setUlbGrade(String ulbGrade) {
		this.ulbGrade = ulbGrade;
	}

	@JsonProperty("longitude")
	public Double getLongitude() {
		return longitude;
	}

	@JsonProperty("longitude")
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	@JsonProperty("latitude")
	public Double getLatitude() {
		return latitude;
	}

	@JsonProperty("latitude")
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	@JsonProperty("shapeFileLocation")
	public Object getShapeFileLocation() {
		return shapeFileLocation;
	}

	@JsonProperty("shapeFileLocation")
	public void setShapeFileLocation(Object shapeFileLocation) {
		this.shapeFileLocation = shapeFileLocation;
	}

	@JsonProperty("captcha")
	public Object getCaptcha() {
		return captcha;
	}

	@JsonProperty("captcha")
	public void setCaptcha(Object captcha) {
		this.captcha = captcha;
	}

	@JsonProperty("code")
	public String getCode() {
		return code;
	}

	@JsonProperty("code")
	public void setCode(String code) {
		this.code = code;
	}

	@JsonProperty("regionCode")
	public String getRegionCode() {
		return regionCode;
	}

	@JsonProperty("regionCode")
	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	@JsonProperty("municipalityName")
	public String getMunicipalityName() {
		return municipalityName;
	}

	@JsonProperty("municipalityName")
	public void setMunicipalityName(String municipalityName) {
		this.municipalityName = municipalityName;
	}

	@JsonAnyGetter
	public Map<String, Object> getAdditionalProperties() {
		return this.additionalProperties;
	}

	@JsonAnySetter
	public void setAdditionalProperty(String name, Object value) {
		this.additionalProperties.put(name, value);
	}

}