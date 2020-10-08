package org.egov.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.context.RequestContext;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.egov.Utils.Utils;
import org.egov.contract.User;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.egov.constants.RequestContextConstants.*;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class EventLogRequest {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    Object requestBody;

    Object responseBody;

    String url;
    String responseContentType;
    String queryParams;

    int statusCode;

    String timestamp;
    Long requestDuration;

    String correlationId;

    String userId;

    String tenantId;

    private static Boolean isJsonResponse(RequestContext ctx) {
        return ctx.getZuulResponseHeaders().stream().anyMatch(p -> {
            if (p.first().toLowerCase().startsWith("content-type")
                && p.second().toLowerCase().startsWith("application/json"))
                return true;
            return false;
        });
    }

    public static EventLogRequest fromRequestContext(RequestContext ctx) {
        Object body = null;
        body = ctx.get(CURRENT_REQUEST_SANITIZED_BODY);
        Long startTime = (Long)ctx.get(CURRENT_REQUEST_START_TIME);
        Long endTime = System.currentTimeMillis();
        ctx.set(CURRENT_REQUEST_END_TIME, endTime);

        Object responseBody = null ;

        if (isJsonResponse(ctx)) {
            try {
                responseBody = Utils.getResponseBody(ctx);
                responseBody = objectMapper.readValue((String)responseBody,
                    new TypeReference<HashMap<String, Object>>() {
                    });
            } catch (Exception e) {
                log.error("Exception while reading body", e);
            }
        }


        User user = (User) ctx.get(USER_INFO_KEY);
        String uuid = "";

        if (user != null) {
            uuid = user.getUuid();
        }

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        Date date = new Date(startTime);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));

        EventLogRequest req = EventLogRequest.builder()
            .requestBody(body)
            .responseBody(responseBody)
            .queryParams(ctx.getRequest().getQueryString())
            .correlationId((String)ctx.get(CORRELATION_ID_KEY))
            .statusCode(ctx.getResponseStatusCode())
            .timestamp(formatter.format(date))
            .requestDuration(endTime - startTime)
            .userId(uuid)
            .tenantId((String)ctx.get(CURRENT_REQUEST_TENANTID))
            .url(ctx.getRequest().getRequestURI()).build();

        return req;
    }
}
