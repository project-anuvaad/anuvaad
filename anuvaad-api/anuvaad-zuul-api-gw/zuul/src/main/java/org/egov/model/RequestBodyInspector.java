package org.egov.model;

import java.util.HashMap;

import static org.egov.constants.RequestContextConstants.REQUEST_INFO_FIELD_NAME_CAMEL_CASE;
import static org.egov.constants.RequestContextConstants.REQUEST_INFO_FIELD_NAME_PASCAL_CASE;

public class RequestBodyInspector {
    private HashMap<String, Object> requestBody;

    public RequestBodyInspector(HashMap<String, Object> requestBody) {
        this.requestBody = requestBody;
    }

    public boolean isRequestInfoPresent() {
        return requestBody != null && isRequestInfoContainerFieldPresent();
    }

    public HashMap<String, Object> getRequestBody() {
        return requestBody;
    }

    public void updateRequestInfo(HashMap<String, Object> requestInfo) {
        if (!isRequestInfoPresent()) {
            return;
        }
        requestBody.put(getRequestInfoFieldNamePresent(), requestInfo);
    }

    @SuppressWarnings("unchecked")
    public HashMap<String, Object> getRequestInfo() {
        if (isRequestInfoPresent()) {
            return (HashMap<String, Object>) requestBody.get(getRequestInfoFieldNamePresent());
        }
        return null;
    }

    private String getRequestInfoFieldNamePresent() {
        if (isPascalCasePresent()) {
            return REQUEST_INFO_FIELD_NAME_PASCAL_CASE;
        } else {
            return REQUEST_INFO_FIELD_NAME_CAMEL_CASE;
        }
    }

    private boolean isRequestInfoContainerFieldPresent() {
        return isPascalCasePresent() || isCamelCasePresent();
    }

    private boolean isCamelCasePresent() {
        return requestBody.containsKey(REQUEST_INFO_FIELD_NAME_CAMEL_CASE);
    }

    private boolean isPascalCasePresent() {
        return requestBody.containsKey(REQUEST_INFO_FIELD_NAME_PASCAL_CASE);
    }

}
