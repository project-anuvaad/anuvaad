package org.egov.model;

import org.junit.Test;

import java.util.HashMap;
import java.util.Set;

import static org.junit.Assert.*;

public class RequestBodyInspectorTest {

    @Test
    public void test_should_return_request_info_when_request_info_container_field_name_has_pascal_case() {
        final HashMap<String, Object> requestBody = new HashMap<>();
        final HashMap<Object, Object> requestInfoBody = new HashMap<>();
        requestBody.put("RequestInfo", requestInfoBody);

        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);

        assertEquals(requestInfoBody, requestBodyInspector.getRequestInfo());
    }

    @Test
    public void test_should_return_request_info_when_request_info_container_field_name_has_camel_case() {
        final HashMap<String, Object> requestBody = new HashMap<>();
        final HashMap<Object, Object> requestInfoBody = new HashMap<>();
        requestBody.put("requestInfo", requestInfoBody);

        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);

        assertEquals(requestInfoBody, requestBodyInspector.getRequestInfo());
    }

    @Test
    public void test_should_return_null_when_request_body_is_empty() {
        final HashMap<String, Object> requestBody = new HashMap<>();
        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);

        assertNull(requestBodyInspector.getRequestInfo());
    }

    @Test
    public void test_should_return_null_when_request_body_does_not_have_request_info() {
        final HashMap<String, Object> requestBody = new HashMap<>();
        requestBody.put("someField", new HashMap<>());
        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);

        assertNull(requestBodyInspector.getRequestInfo());
    }

    @Test
    public void test_should_update_request_info() {
        final HashMap<String, Object> requestBody = new HashMap<>();
        final HashMap<Object, Object> originalRequestInfoBody = new HashMap<>();
        requestBody.put("requestInfo", originalRequestInfoBody);

        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);

        final HashMap<String, Object> updatedRequestInfo = new HashMap<>();
        updatedRequestInfo.put("foo", "bar");

        requestBodyInspector.updateRequestInfo(updatedRequestInfo);

        final HashMap<String, Object> actualRequestBody = requestBodyInspector.getRequestBody();
        final HashMap<String, Object> actualRequestInfo =
            (HashMap<String, Object>) actualRequestBody.get("requestInfo");
        assertNotNull(actualRequestInfo);
        assertTrue(actualRequestInfo.containsKey("foo"));
    }

    @Test
    public void test_should_not_update_request_body_with_new_request_info_when_original_request_body_does_not_have_request_info_field() {
        final HashMap<String, Object> requestBody = new HashMap<>();
        requestBody.put("foo", new HashMap<>());

        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);

        final HashMap<String, Object> updatedRequestInfo = new HashMap<>();
        updatedRequestInfo.put("userInfo", "user");

        requestBodyInspector.updateRequestInfo(updatedRequestInfo);

        final HashMap<String, Object> actualRequestBody = requestBodyInspector.getRequestBody();
        final Set<String> keys = actualRequestBody.keySet();
        assertEquals(1, keys.size());
        assertTrue(keys.contains("foo"));
    }

}