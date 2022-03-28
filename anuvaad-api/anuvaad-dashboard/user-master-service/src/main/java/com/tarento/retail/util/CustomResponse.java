package com.tarento.retail.util;

import java.util.ArrayList;
import java.util.List;

public class CustomResponse {
		private String status;
	    private String success;
	    private List<Object> data = new ArrayList<Object>();

	    public CustomResponse() { 
	    }
	    
	    public CustomResponse(String status, String success, List<Object> data) { 
	    	this.status = status;
	    	this.success = success;
	    	this.data = data; 
	    }
	    
		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public String getSuccess() {
				return success;
			}

	    public void setSuccess(String success) {
	        this.success = success;
	    }

	    public List<Object> getData() {
	        return data;
	    }

	    public void setData(List<Object> data) {
	        this.data = data;
	    }


}
