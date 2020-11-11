package com.tarento.retail.util;


import java.util.HashMap;
import java.util.List;

public class CustomSuccess {
	 protected Integer successCode;
	    protected String successMessage;
	    protected Object data;
	    protected List<Object> dataList;
	    protected CustomResponse customResponse=null;
	    
	    public CustomSuccess(int successCode, String successMessage){
	        this.successCode=successCode;
	        this.successMessage=successMessage;
	    }

	    public CustomSuccess(Object data){
	        if(data instanceof List){
	            this.dataList=(List)data;
	        } else{
	            this.data=data;
	        }
	    }


	    public Integer getSuccessCode() {
	        return successCode;
	    }

	    public void setSuccessCode(Integer successCode) {
	        this.successCode = successCode;
	    }

	    public String getSuccessMessage() {
	        return successMessage;
	    }

	    public void setSuccessMessage(String successMessage) {
	        this.successMessage = successMessage;
	    }

	    public Object getData() {
	        return data;
	    }

	    public void setData(Object data) {
	        this.data = data;
	    }

	    public List<Object> getDataList() {
	        return dataList;
	    }

	    public void setDataList(List<Object> dataList) {
	        this.dataList = dataList;
	    }

	    public CustomResponse getCustomResponse() {
	        if(customResponse != null){
	            return customResponse;
	        }
	        customResponse=new CustomResponse();
	        customResponse.setSuccess(Constants.SUCCESS);
	        if(data != null){
	            customResponse.getData().add(data);
	        }else if(dataList != null){
	            customResponse.getData().addAll(dataList);
	        }else if(successCode != null){
	            HashMap<String,Object> responseData=new HashMap<String,Object>();
	            responseData.put(Constants.SUCCESS_CODE,successCode);
	            responseData.put(Constants.SUCCESS_MESSAGE,successMessage);
	            customResponse.getData().add(responseData);
	        }
	        return customResponse;
	    }
	    
	    public CustomResponse getCustomResponse(Object object) {
	        if(customResponse != null){
	            return customResponse;
	        }
	        customResponse=new CustomResponse();
	        customResponse.setSuccess(Constants.SUCCESS);
	        customResponse.setStatus("200");
	        if(data != null){
	            customResponse.getData().add(data);
	        }else if(dataList != null){
	            customResponse.getData().addAll(dataList);
	        }else if(successCode != null){
	            HashMap<String,Object> responseData=new HashMap<String,Object>();
	            responseData.put(Constants.SUCCESS_CODE,successCode);
	            responseData.put(Constants.SUCCESS_MESSAGE,successMessage);
	            responseData.put("responseData",object);
	            customResponse.getData().add(responseData);
	        }
	        return customResponse;
	    }

	    public void setCustomResponse(CustomResponse customResponse) {
	        this.customResponse = customResponse;
	    }

}
