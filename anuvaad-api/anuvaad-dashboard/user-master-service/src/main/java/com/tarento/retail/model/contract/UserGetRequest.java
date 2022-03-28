package com.tarento.retail.model.contract;

import java.util.List;

/**
 * 
 * @author Darshan Nagesh
 *
 */

public class UserGetRequest {
	
	private List<Long> userIdList;

	public List<Long> getUserIdList() {
		return userIdList;
	}

	public void setUserIdList(List<Long> userIdList) {
		this.userIdList = userIdList;
	} 
	
	

}
