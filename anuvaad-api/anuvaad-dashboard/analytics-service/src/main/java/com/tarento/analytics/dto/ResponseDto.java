package com.tarento.analytics.dto;

public class ResponseDto {

    private int statusCode;
    private String statusMessage;
    private Object response;

    public ResponseDto(int statusCode, String statusMessage, Object response) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.response = response;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public Object getResponse() {
        return response;
    }

    public void setResponse(Object response) {
        this.response = response;
    }
}
