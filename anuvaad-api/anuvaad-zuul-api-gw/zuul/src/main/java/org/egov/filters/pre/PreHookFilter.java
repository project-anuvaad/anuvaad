package org.egov.filters.pre;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.egov.UrlProvider;
import org.egov.Utils.ExceptionUtils;
import org.egov.model.PreHookFilterRequest;
import org.egov.tracer.model.CustomException;
import org.egov.wrapper.CustomRequestWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;

@Component
@Slf4j
public class PreHookFilter extends ZuulFilter {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${custom.filter.prehooks:false}")
    private boolean loadPreHookFilters;

    @Override
    public Object run() {

        RequestContext ctx = RequestContext.getCurrentContext();

        DocumentContext reqDc = parseRequest(ctx);
        String uri = ctx.getRequest().getRequestURI();
        PreHookFilterRequest req = PreHookFilterRequest.builder().Request(reqDc.jsonString()).build();
        String response = null;
        try {
            log.debug("Executing pre-hook filter. Sending request to - " + UrlProvider.getUrlPreHooksMap().get(uri));
            response = restTemplate.postForObject(UrlProvider.getUrlPreHooksMap().get(uri), req,
                String.class);

            CustomRequestWrapper requestWrapper = new CustomRequestWrapper(ctx.getRequest());
            requestWrapper.setPayload(response);
            ctx.setRequest(requestWrapper);
        } catch (HttpClientErrorException|HttpServerErrorException e) {
            log.error("Pre-Hook - Http Exception Occurred", e);
            ExceptionUtils.raiseCustomException(e.getStatusCode(), "PRE_HOOK_ERROR - Pre-hook url threw an error - " + e.getMessage());
        } catch (Exception e) {
            log.error("Pre-Hook - Exception Occurred", e);
            ExceptionUtils.raiseCustomException(HttpStatus.BAD_REQUEST, "PRE_HOOK_ERROR - Pre-hook url threw an error - " + e.getMessage());
        }

        return null;
    }

    @Override
    public boolean shouldFilter() {
        if (!loadPreHookFilters)
            return false;

        RequestContext ctx = RequestContext.getCurrentContext();
        String uri = ctx.getRequest().getRequestURI();
        return UrlProvider.getUrlPreHooksMap().get(uri) != null;
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public String filterType() {
        return "pre";
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
