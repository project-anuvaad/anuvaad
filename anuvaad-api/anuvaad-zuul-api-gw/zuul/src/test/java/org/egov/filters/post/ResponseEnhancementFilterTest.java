package org.egov.filters.post;

import com.netflix.util.Pair;
import com.netflix.zuul.context.RequestContext;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.List;

import static org.junit.Assert.*;

public class ResponseEnhancementFilterTest {

    private ResponseEnhancementFilter filter;

    @Before
    public void before() {
        filter = new ResponseEnhancementFilter();
        RequestContext.getCurrentContext().clear();
    }

    @Test
    public void test_should_set_response_header() {
        RequestContext.getCurrentContext().set("CORRELATION_ID", "someCorrelationId");
        final MockHttpServletResponse response = new MockHttpServletResponse();
        response.setStatus(400);
        RequestContext.getCurrentContext().setResponse(response);
        final MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("http://host/api/v1");
        RequestContext.getCurrentContext().setRequest(request);

        filter.run();

        final List<Pair<String, String>> zuulResponseHeaders =
            RequestContext.getCurrentContext().getZuulResponseHeaders();

        boolean correlationHeaderPresent = false;
        boolean cacheControlHeadersPresent = false;
        for(Pair<String, String> header : zuulResponseHeaders){

            if(header.first().equalsIgnoreCase("x-correlation-id")){
                correlationHeaderPresent = true;
                assertEquals("someCorrelationId", header.second());
            }

            if(header.first().equalsIgnoreCase("Cache-Control")){
                cacheControlHeadersPresent = true;
                assertEquals("no-cache, no-store, max-age=0, must-revalidate", header.second());
            }
        }
        assert correlationHeaderPresent && cacheControlHeadersPresent;
    }

    @Test
    public void test_should_always_execute_filter() {
        assertTrue( filter.shouldFilter());
    }

    @Test
    public void test_should_execute_as_last_post_filter() {
        assertEquals(0,  filter.filterOrder());
    }

}