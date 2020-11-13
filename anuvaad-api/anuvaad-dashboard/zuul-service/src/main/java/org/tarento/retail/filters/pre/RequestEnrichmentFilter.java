package org.tarento.retail.filters.pre;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.tarento.retail.contract.User;
import org.tarento.retail.model.RequestBodyInspector;
import org.tarento.retail.wrapper.CustomRequestWrapper;

import javax.servlet.http.HttpServletRequest;

import static org.tarento.retail.constants.RequestContextConstants.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Optional;

/**
 *  6th pre filter to get executed.
 *  Enriches the request body and header with 1) correlation id 2) user info
 */
@Component
public class RequestEnrichmentFilter extends ZuulFilter {

    private static final String FAILED_TO_ENRICH_REQUEST_BODY_MESSAGE = "Failed to enrich request body";
    private static final String USER_SERIALIZATION_MESSAGE = "Failed to serialize user";
    private static final String SKIPPED_BODY_ENRICHMENT_DUE_TO_NO_KNOWN_FIELD_MESSAGE =
        "Skipped enriching request body since request info field is not present.";
    private static final String BODY_ENRICHED_MESSAGE = "Enriched request payload.";
    private static final String ADDED_USER_INFO_TO_HEADER_MESSAGE = "Adding user info to header.";
    private static final String EMPTY_STRING = "";
    private static final String JSON_TYPE = "json";
    private final ObjectMapper objectMapper;
    private static final String USER_INFO_HEADER_NAME = "x-user-info";
    private static final String PASS_THROUGH_GATEWAY_HEADER_NAME = "x-pass-through-gateway";
    private static final String PASS_THROUGH_GATEWAY_HEADER_VALUE = "true";
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    public RequestEnrichmentFilter() {
        this.objectMapper = new ObjectMapper();
        objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);

    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 5;
    }

    @Override
    public boolean shouldFilter() {
    	if("OPTIONS".equals(RequestContext.getCurrentContext().getRequest().getMethod())) { 
    		return false; 
    	}
        return true;
    }

    @Override
    public Object run() {
         // modifyRequestBody();
        addRequestHeaders();
        return null;
    }

    private void addRequestHeaders() {
        RequestContext ctx = RequestContext.getCurrentContext();
        addCorrelationIdHeader(ctx);
        addUserInfoHeader(ctx);
        addPassThroughGatewayHeader(ctx);
    }

    private void addUserInfoHeader(RequestContext ctx) {
        if (isUserInfoPresent()) {
            User user = getUser();
            user.setAuthToken(ctx.get(AUTH_TOKEN_KEY).toString());
            try {
                ctx.addZuulRequestHeader(USER_INFO_HEADER_NAME, objectMapper.writeValueAsString(user));
                logger.info(ADDED_USER_INFO_TO_HEADER_MESSAGE);
            } catch (JsonProcessingException e) {
                logger.error(USER_SERIALIZATION_MESSAGE, e);
                throw new RuntimeException(e);
            }

        }
    }

    private void addCorrelationIdHeader(RequestContext ctx) {
        ctx.addZuulRequestHeader(CORRELATION_ID_HEADER_NAME, getCorrelationId());
    }

    private void addPassThroughGatewayHeader(RequestContext ctx) {
        ctx.addZuulRequestHeader(PASS_THROUGH_GATEWAY_HEADER_NAME, PASS_THROUGH_GATEWAY_HEADER_VALUE);
    }

    private void modifyRequestBody() {
        if (!isRequestBodyCompatible()) {
            return;
        }
        try {
            enrichRequestBody();
        } catch (IOException e) {
            logger.error(FAILED_TO_ENRICH_REQUEST_BODY_MESSAGE, e);
            throw new RuntimeException(e);
        }
    }

    private boolean isRequestBodyCompatible() {
        return POST.equalsIgnoreCase(getRequestMethod())
            && !getRequestURI().matches(FILESTORE_REGEX)
            && getRequestContentType().contains(JSON_TYPE);
    }

    private HttpServletRequest getRequest() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest();
    }

    private String getRequestMethod() {
        return getRequest().getMethod();
    }

    private String getRequestContentType() {
        return Optional.ofNullable(getRequest().getContentType()).orElse(EMPTY_STRING).toLowerCase();
    }

    private String getRequestURI() {
        return getRequest().getRequestURI();
    }

    @SuppressWarnings("unchecked")
    private void enrichRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        final RequestBodyInspector requestBodyInspector = getRequestBodyInspector(ctx);
        HashMap<String, Object> requestInfo = requestBodyInspector.getRequestInfo();
        if (requestInfo == null) {
            logger.info(SKIPPED_BODY_ENRICHMENT_DUE_TO_NO_KNOWN_FIELD_MESSAGE);
            return;
        }
        setUserInfo(requestInfo);
        setCorrelationId(requestInfo);
        requestBodyInspector.updateRequestInfo(requestInfo);
        CustomRequestWrapper requestWrapper = new CustomRequestWrapper(ctx.getRequest());
        requestWrapper.setPayload(objectMapper.writeValueAsString(requestBodyInspector.getRequestBody()));
        logger.info(BODY_ENRICHED_MESSAGE);
        ctx.setRequest(requestWrapper);
    }

    private RequestBodyInspector getRequestBodyInspector(RequestContext ctx) throws IOException {
        HashMap<String, Object> requestBody = getRequestBody(ctx);
        return new RequestBodyInspector(requestBody);
    }

    private void setCorrelationId(HashMap<String, Object> requestInfo) {
        requestInfo.put(CORRELATION_ID_FIELD_NAME, getCorrelationId());
    }

    private String getCorrelationId() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return (String) ctx.get(CORRELATION_ID_KEY);
    }

    private void setUserInfo(HashMap<String, Object> requestInfo) {
        if (isUserInfoPresent()) {
            requestInfo.put(USER_INFO_FIELD_NAME, getUser());
        }
    }

    private User getUser() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return (User) ctx.get(USER_INFO_KEY);
    }

    private boolean isUserInfoPresent() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.get(USER_INFO_KEY) != null;
    }

    private HashMap<String, Object> getRequestBody(RequestContext ctx) throws IOException {
        String payload = IOUtils.toString(ctx.getRequest().getInputStream());
        return objectMapper.readValue(payload, new TypeReference<HashMap<String, Object>>() { });
    }

}
