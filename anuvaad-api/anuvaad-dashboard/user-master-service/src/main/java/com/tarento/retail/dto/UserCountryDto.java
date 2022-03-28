package com.tarento.retail.dto;

import java.util.List;

import com.tarento.retail.model.Country;

/**
 * This Data Transfer Object which receives the User ID and List of Countries which is mapped against each other. 
 * @author Darshan Nagesh
 *
 */

public class UserCountryDto {
	
	private Long userId; 
	private List<Country> countries;
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public List<Country> getCountries() {
		return countries;
	}
	public void setCountries(List<Country> countries) {
		this.countries = countries;
	} 
	
	
	
	
	

}
