package org.egov.filters.pre;

import com.netflix.zuul.context.RequestContext;
import org.egov.Resources;
import org.egov.contract.User;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class AuthFilterTest {
    private MockHttpServletRequest request = new MockHttpServletRequest();
    private Resources resources = new Resources();

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ProxyRequestHelper proxyRequestHelper;

    private AuthFilter authFilter;

    private String authServiceHost = "http://localhost:8082/";
    private String authUri = "user/_details?access_token=";
    private String userInfoHeader = "x-user-info";

    @Before
    public void init() {
        MockitoAnnotations.initMocks(this);
        authFilter = new AuthFilter(proxyRequestHelper, restTemplate, authServiceHost, authUri);
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.clear();
        ctx.setRequest(request);
    }

    @Test
    public void testBasicProperties() {
        assertThat(authFilter.filterType(), is("pre"));
        assertThat(authFilter.filterOrder(), is(3));
    }

    @Test
    public void testThatFilterShouldBeAppliedBasedOnContext() {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set("shouldDoAuth", false);
        assertFalse(authFilter.shouldFilter());

        ctx.set("shouldDoAuth", true);
        assertTrue(authFilter.shouldFilter());
    }

    @Test
    public void testThatFilterShouldAbortIfValidatingAuthTokenFails() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        String authToken = "dummy-auth-token";
        ctx.set("authToken", authToken);
        request.setMethod("POST");
        ctx.setRequest(request);
        ctx.setResponse(new MockHttpServletResponse());
        String authUrl = String.format("%s%s%s", authServiceHost, authUri, authToken);
        when(restTemplate.postForObject(eq(authUrl), any(), eq(User.class)))
            .thenThrow(new HttpClientErrorException(HttpStatus.UNAUTHORIZED));

        try {
            authFilter.run();
            assertFalse("Shouldn't reach here", true );
        } catch (RuntimeException ex) {
            assertThat(((HttpClientErrorException)ex.getCause()).getStatusCode().value(), is(401));
        }
    }

}