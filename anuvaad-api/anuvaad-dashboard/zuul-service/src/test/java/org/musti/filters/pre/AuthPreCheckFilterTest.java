/*package org.musti.filters.pre;

import com.netflix.zuul.context.RequestContext;
import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.musti.filters.pre.AuthPreCheckFilter;
import org.springframework.mock.web.MockHttpServletRequest;

import java.io.IOException;
import java.util.HashSet;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class AuthPreCheckFilterTest {
    private MockHttpServletRequest request = new MockHttpServletRequest();

    private AuthPreCheckFilter authPreCheckFilter;

    private HashSet<String> openEndpointsWhitelist = new HashSet<>();
    private HashSet<String> anonymousEndpointsWhitelist = new HashSet<>();

    @Before
    public void init() {
        openEndpointsWhitelist.add("open-endpoint1");
        openEndpointsWhitelist.add("open-endpoint2");
        anonymousEndpointsWhitelist.add("anonymous-endpoint1");
        anonymousEndpointsWhitelist.add("anonymous-endpoint2");
        authPreCheckFilter = new AuthPreCheckFilter(openEndpointsWhitelist, anonymousEndpointsWhitelist);
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.clear();
        ctx.setRequest(request);
    }

    @Test
    public void testBasicProperties() {
        assertThat(authPreCheckFilter.filterType(), is("pre"));
        assertThat(authPreCheckFilter.filterOrder(), is(1));
        assertTrue(authPreCheckFilter.shouldFilter());
    }

    @Test
    public void testThatAuthShouldNotHappenForOpenEndpoints() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("open-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));

        request.setRequestURI("open-endpoint2");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousGETEndpointsOnNoAuthToken() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("anonymous-endpoint1");
        request.setMethod("GET");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));

        request.setRequestURI("anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));
    }

    @Test
    public void testThatAuthShouldHappenForAnonymousGETEndpointsOnAuthTokenInHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("GET");
        request.addHeader("auth-token", "token");

        request.setRequestURI("/anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get("shouldDoAuth"));

        request.setRequestURI("/anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get("shouldDoAuth"));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPOSTEndpointsOnNoAuthToken() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("anonymous-endpoint1");
        request.setMethod("POST");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\"}}")));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));

        request.setRequestURI("anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPOSTEndpointsOnNoRequestInfo() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("anonymous-endpoint1");
        request.setMethod("POST");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"ServiceRequest\": {\"fu\": \"bar\"}}")));

        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));

        request.setRequestURI("anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPUTEndpointsOnNoAuthToken() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("anonymous-endpoint1");
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\"}}")));
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));

        request.setRequestURI("anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));
    }

    @Test
    public void testThatAuthShouldNotHappenForAnonymousPUTEndpointsOnNoRequestInfo() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("anonymous-endpoint1");
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"ServiceRequest\": {\"fu\": \"bar\"}}")));

        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));

        request.setRequestURI("anonymous-endpoint1");
        ctx.setRequest(request);
        authPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoAuth"));
    }

    @Test
    public void testThatAuthShouldHappenForOtherGETEndpointsOnAuthTokenInHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader("auth-token", "token");
        request.setMethod("GET");
        request.setRequestURI("other-endpoint");
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get("shouldDoAuth"));
    }

    @Test
    public void testThatAuthShouldHappenForOtherPOSTEndpointsOnAuthTokenInRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader("auth-token", "token");
        request.setMethod("POST");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\"}}")));
        request.setRequestURI("other-endpoint");
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get("shouldDoAuth"));
        assertEquals("authtoken", ctx.get("authToken"));
    }

    @Test
    public void testThatAuthShouldHappenForOtherPUTEndpointsOnAuthTokenInRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader("auth-token", "token");
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\"}}")));
        request.setRequestURI("other-endpoint");
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertTrue((Boolean) ctx.get("shouldDoAuth"));
        assertEquals("authtoken", ctx.get("authToken"));
    }

    @Test
    public void testThatFilterShouldAbortForOtherGETEndpointsOnNoAuthToken() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("GET");
        request.setRequestURI("other-endpoint");
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertFalse(ctx.sendZuulResponse());
        assertThat(ctx.get("error.status_code"), is(401));
    }

    @Test
    public void testThatFilterShouldAbortForOtherPOSTEndpointsOnNoAuthToken() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("POST");
        request.setRequestURI("other-endpoint");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\"}}")));
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertFalse(ctx.sendZuulResponse());
        assertThat(ctx.get("error.status_code"), is(401));
    }

    @Test
    public void testThatFilterShouldAbortForOtherPOSTEndpointsOnNoRequestnInfo() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("POST");
        request.setRequestURI("other-endpoint");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"ServiceRequest\": {\"fu\": \"bar\"}}")));
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertFalse(ctx.sendZuulResponse());
        assertThat(ctx.get("error.status_code"), is(401));
    }

    @Test
    public void testThatFilterShouldAbortForPOSTEndpointsOnNoRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("POST");
        request.setRequestURI("other-endpoint");
        ctx.setRequest(request);

        authPreCheckFilter.run();

        assertFalse(ctx.sendZuulResponse());
        assertThat(ctx.get("error.status_code"), is(500));
    }

    @Test
    public void testThatFilterShouldAbortForOtherPUTEndpointsOnNoAuthToken() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("PUT");
        request.setRequestURI("other-endpoint");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\"}}")));
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertFalse(ctx.sendZuulResponse());
        assertThat(ctx.get("error.status_code"), is(401));
    }

    @Test
    public void testThatFilterShouldAbortForOtherPUTEndpointsOnNoRequestnInfo() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("PUT");
        request.setRequestURI("other-endpoint");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"ServiceRequest\": {\"fu\": \"bar\"}}")));
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertFalse(ctx.sendZuulResponse());
        assertThat(ctx.get("error.status_code"), is(401));
    }

    @Test
    public void testThatFilterShouldAbortForPUTEndpointsOnNoRequestBody() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("PUT");
        request.setRequestURI("other-endpoint");
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertFalse(ctx.sendZuulResponse());
        assertThat(ctx.get("error.status_code"), is(500));
    }

    @Test
    public void testThatAuthTokenIsAlwaysReferredFromHeaderForFileStoreEndpoints() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setMethod("POST");
        request.addHeader("auth-token", "authtoken");
        request.setRequestURI("/filestore/v1/files");
        ctx.setRequest(request);

        authPreCheckFilter.run();
        assertEquals("authtoken", ctx.get("authToken"));
    }

    @Test
    public void testThatRequestInfoIsSanitizedForOtherPUTEndpoints() throws IOException {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.addHeader("auth-token", "token");
        request.setMethod("PUT");
        request.setContent(IOUtils.toByteArray(IOUtils.toInputStream("{\"RequestInfo\": {\"fu\": \"bar\", \"authToken\": \"authtoken\", \"userInfo\": {\"name\": \"fubarred\"}}}")));
        request.setRequestURI("other-endpoint");
        ctx.setRequest(request);

        authPreCheckFilter.run();

        String expectedBody = "{\"RequestInfo\":{\"fu\":\"bar\",\"authToken\":\"authtoken\"}}";
        assertEquals(expectedBody, IOUtils.toString(ctx.getRequest().getInputStream()));
    }
}
*/