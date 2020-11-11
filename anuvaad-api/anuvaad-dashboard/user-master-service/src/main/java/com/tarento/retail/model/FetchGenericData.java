package com.tarento.retail.model;

/**
 * This is a model class which is a generalized model for any kind of fetch. 
 * All the parameters which is a factor for fetch will be passed through this 
 * @author Darshan Nagesh
 *
 */
public class FetchGenericData {
	
	private Integer startIndex; 
	private Integer length;
	private Integer pageNumber; 
	
	public Integer getStartIndex() {
		return startIndex;
	}
	public void setStartIndex(Integer startIndex) {
		this.startIndex = startIndex;
	}
	public Integer getLength() {
		return length;
	}
	public void setLength(Integer length) {
		this.length = length;
	}
	public Integer getPageNumber() {
		return pageNumber;
	}
	public void setPageNumber(Integer pageNumber) {
		this.pageNumber = pageNumber;
	}
}
