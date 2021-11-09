package org.anuvaad.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.anuvaad.exceptions.CustomException;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@Component
public class ExceptionUtils {
    private static final Logger logger = LoggerFactory.getLogger(ExceptionUtils.class);
    private static final String SEND_ERROR_FILTER_RAN = "sendErrorFilter.ran";

    private static String getObjectJSONString(Object obj) throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(obj);
    }

    private static HashMap<String, Object> getErrorInfoObject(String code, String message) {
        String errorTemplate = "{\n" +
                "    \"Errors\": [\n" +
                "        {\n" +
                "            \"code\": \"Exception\",\n" +
                "            \"message\": null\n" +
                "        }\n" +
                "    ]\n" +
                "}";
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            HashMap<String, Object> errorInfo = objectMapper.readValue(errorTemplate, new TypeReference<HashMap<String, Object>>() {
            });
            HashMap<String, Object> error = (HashMap<String, Object>) ((List<Object>) errorInfo.get("Errors")).get(0);
            error.put("code", code);
            error.put("message", message);
            return errorInfo;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    public static void setCustomException(HttpStatus status, String message)  {
        try {
            _setExceptionBody(status, getErrorInfoObject("CustomException", message));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    private static void _setExceptionBody(HttpStatus status, Object body) throws JsonProcessingException {
        _setExceptionBody(status, getObjectJSONString(body));
    }

    private static void _setExceptionBody(HttpStatus status, String body) {
        RequestContext ctx = RequestContext.getCurrentContext();

        ctx.setSendZuulResponse(false);
        ctx.setResponseStatusCode(status.value());
        ctx.getResponse().setContentType("application/json");
        if (body == null)
            body = "{}";
        ctx.setResponseBody(body);
        ctx.remove("error.status_code");
        ctx.set(SEND_ERROR_FILTER_RAN);
        ctx.remove("throwable");
    }

    public static void RaiseException(Throwable ex) {
        throw new RuntimeException(ex);
    }

    public static void raiseCustomException(HttpStatus status, String message) {
        throw new RuntimeException(new CustomException(message, status.value(), "CustomException"));
    }

    public static void raiseErrorFilterException( RequestContext ctx) {
        logger.info("Building filter exception response....");
        Throwable e = ctx.getThrowable() == null ? (Throwable)ctx.get("error.exception") : ctx.getThrowable();
        try {
            if (e == null) {
                if (ctx.getResponseStatusCode() == HttpStatus.NOT_FOUND.value()) {
                    _setExceptionBody(HttpStatus.NOT_FOUND, getErrorInfoObject("ResourceNotFoundException",
                            "The resource - " + ctx.getRequest().getRequestURI() + " not found"));
                } else if (ctx.getResponseStatusCode() == HttpStatus.BAD_REQUEST.value()) {
                    String existingResponse = getResponseBody(ctx);

                    if (existingResponse != null && existingResponse.contains("InvalidAccessTokenException"))
                        _setExceptionBody(HttpStatus.UNAUTHORIZED, existingResponse);
                }
                return;
            }
            while ((e instanceof ZuulException || e.getClass().equals(RuntimeException.class)) && e.getCause() != null)
                e = e.getCause();
            String exceptionName = e.getClass().getSimpleName();
            String exceptionMessage = ((Throwable) e).getMessage();
            if (exceptionName.equalsIgnoreCase("ZuulRuntimeException")) {
                logger.error("ZuulRuntimeException | Cause: ", e);
                if(exceptionMessage.equalsIgnoreCase(HttpStatus.TOO_MANY_REQUESTS.toString()))
                    _setExceptionBody(HttpStatus.TOO_MANY_REQUESTS, getErrorInfoObject(exceptionName, exceptionMessage));
            }
            if (exceptionName.equalsIgnoreCase("ZuulRuntimeException"))
                logger.error("ZuulRuntimeException | Cause: ", e);
            if (exceptionName.equalsIgnoreCase("HttpHostConnectException") ||
                    exceptionName.equalsIgnoreCase("ResourceAccessException")) {
                _setExceptionBody(HttpStatus.BAD_GATEWAY, getErrorInfoObject(exceptionName, "The backend service is unreachable"));
            } else if (exceptionName.equalsIgnoreCase("NullPointerException")) {
                e.printStackTrace();
                _setExceptionBody(HttpStatus.INTERNAL_SERVER_ERROR, getErrorInfoObject(exceptionName, exceptionMessage));
            } else if (exceptionName.equalsIgnoreCase("HttpClientErrorException")) {
                String existingResponse = ((HttpClientErrorException) e).getResponseBodyAsString();
                if (existingResponse.contains("InvalidAccessTokenException"))
                    _setExceptionBody(HttpStatus.UNAUTHORIZED, existingResponse);
                else
                    _setExceptionBody(((HttpClientErrorException) e).getStatusCode(), existingResponse);
            } else if (exceptionName.equalsIgnoreCase("InvalidAccessTokenException")) {
                _setExceptionBody(HttpStatus.UNAUTHORIZED, getErrorInfoObject(exceptionName, exceptionMessage));
            } else if (exceptionName.equalsIgnoreCase("CustomException")) {
                CustomException ce = (CustomException)e;
                exceptionName = "InvalidAccessException";
                _setExceptionBody(HttpStatus.valueOf(ce.nStatusCode), getErrorInfoObject(exceptionName, exceptionMessage));
            } else {
                _setExceptionBody(HttpStatus.INTERNAL_SERVER_ERROR, getErrorInfoObject(exceptionName, exceptionMessage));
            }
        } catch (Exception e1) {
            logger.error("Exception while building filter exception response: ", e1);
        }
    }

    public static String getResponseBody(RequestContext ctx) throws IOException {
        String body = ctx.getResponseBody();

        if (body == null) {
            body = IOUtils.toString(ctx.getResponseDataStream());
            ctx.setResponseBody(body);
        }
        return body;
    }
}
