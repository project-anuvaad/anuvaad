package com.tarento.retail.dto;

/**
 * This is a Data Transfer Object which receives the pagination information based on which the 
 * data is filtered out and sorted to fetch
 * @author Darshan Nagesh
 *
 */

public class PaginationDto {

	private int startIndex;
	private int countOfRecords;
	
	public int getStartIndex() {
		return startIndex;
	}
	public void setStartIndex(int startIndex) {
		this.startIndex = startIndex;
	}
	public int getCountOfRecords() {
		return countOfRecords;
	}
	public void setCountOfRecords(int countOfRecords) {
		this.countOfRecords = countOfRecords;
	} 
	
	
}
