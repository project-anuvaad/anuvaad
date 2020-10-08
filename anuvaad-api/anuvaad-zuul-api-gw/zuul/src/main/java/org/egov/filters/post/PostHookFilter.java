package org.egov.filters.post;

import com.google.common.io.CharStreams;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.egov.UrlProvider;
import org.egov.Utils.ExceptionUtils;
import org.egov.model.PostHookFilterRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

@Component
@Slf4j
public class PostHookFilter extends ZuulFilter {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${custom.filter.posthooks:false}")
    private boolean loadPostHookFilters;

    @Override
    public Object run() {

        RequestContext ctx = RequestContext.getCurrentContext();
        String resBody = readResponseBody(ctx);
        if (StringUtils.isEmpty(resBody)) return null;

        DocumentContext resDc = JsonPath.parse(resBody);
        DocumentContext reqDc = parseRequest(ctx);
        String uri = ctx.getRequest().getRequestURI();
        PostHookFilterRequest req = PostHookFilterRequest.builder().Request(reqDc.jsonString()).Response(resDc.jsonString()).build();
        String response = null;
        try {
            log.debug("Executing post-hook filter. Sending request to - " + UrlProvider.getUrlPostHooksMap().get(uri));
            response = restTemplate.postForObject(UrlProvider.getUrlPostHooksMap().get(uri), req,
                String.class);
        } catch (HttpClientErrorException| HttpServerErrorException e) {
            log.error("POST-Hook - Http Exception Occurred", e);
            ExceptionUtils.raiseCustomException(e.getStatusCode(), "POST_HOOK_ERROR - Post-hook url threw an error - " + e.getMessage());
        } catch (Exception e) {
            log.error("POST-Hook - Exception Occurred", e);
            ExceptionUtils.raiseCustomException(HttpStatus.BAD_REQUEST, "POST_HOOK_ERROR - Post-hook url threw an error - " + e.getMessage());
        }

        ctx.setResponseBody(response);
        return null;
    }

    @Override
    public boolean shouldFilter() {
        if (!loadPostHookFilters)
            return false;

        RequestContext ctx = RequestContext.getCurrentContext();
        String uri = ctx.getRequest().getRequestURI();
        return UrlProvider.getUrlPostHooksMap().get(uri) != null;
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public String filterType() {
        return "post";
    }

    private String readResponseBody(RequestContext ctx) {
        String responseBody = null;
        try (final InputStream responseDataStream = ctx.getResponseDataStream()) {
            responseBody = CharStreams.toString(new InputStreamReader(responseDataStream, "UTF-8"));
            //ctx.setResponseBody(responseBody);
        } catch (IOException e) {
            log.info("Error reading body", e);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return responseBody;
    }

    private DocumentContext parseRequest(RequestContext ctx) {

        String payload = null;
        try {
            InputStream is = ctx.getRequest().getInputStream();
            payload = IOUtils.toString(is);
            //request.getRequestURI();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return JsonPath.parse(payload);
    }

}
