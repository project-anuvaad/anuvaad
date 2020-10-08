package org.egov.filters.pre;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.monitoring.MonitoringHelper;
import org.egov.contract.Action;
import org.egov.contract.Role;
import org.egov.contract.User;
import org.egov.exceptions.CustomException;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import static org.egov.constants.RequestContextConstants.ERROR_CODE_KEY;
import static org.egov.constants.RequestContextConstants.USER_INFO_KEY;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withUnauthorizedRequest;


public class RbacFilterTest {

    private MockHttpServletRequest request;

    private RestTemplate restTemplate = new RestTemplate();

    private RbacFilter rbacFilter;

    private MockRestServiceServer mockServer = MockRestServiceServer.bindTo(restTemplate).build();


    @Before
    public void init(){
        MockitoAnnotations.initMocks(this);
        request = new MockHttpServletRequest();
        rbacFilter = new RbacFilter(restTemplate, "http://localhost:8091/access/v1/actions/_authorize", new ObjectMapper());

        RequestContext.getCurrentContext().clear();
    }

    @Test
    public void testThatFilterOrderIs3() throws Exception {
        assertThat(rbacFilter.filterOrder(), is(4));
    }

    @Test
    public void testThatFilterShouldNotRunWhenRbacIsNotRequired() throws Exception {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set("shouldDoRbac", false);
        assertFalse(rbacFilter.shouldFilter());
    }

    @Test(expected = CustomException.class)
    public void shouldAbortWhenUserIsRequestingUnauthorizedURI() throws Throwable {
        MonitoringHelper.initMocks();
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva");
        user.setActions(new ArrayList<>(Collections.singletonList(action1)));
        user.setRoles(Collections.singletonList(new Role(10L, "CITIZEN", "CITIZEN", "default")));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);

        mockServer.expect(requestTo("http://localhost:8091/access/v1/actions/_authorize"))
            .andRespond(withUnauthorizedRequest());

        request.setRequestURI("/hr-masters/do/something");
        ctx.setRequest(request);
        try {
            rbacFilter.run();
        } catch (RuntimeException ex) {
            CustomException e = (CustomException)ex.getCause();
            assertThat(e.nStatusCode, is(403));
            throw ex.getCause();
        }

        assertForbiddenResponse(ctx);
    }

    @Test
    public void shouldNotAbortWhenUserIsRequestingAuthorizedURI() throws Exception {
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva");
        user.setActions(new ArrayList<>(Arrays.asList(action1)));
        user.setRoles(Collections.singletonList(new Role(10L, "CITIZEN", "CITIZEN", "default")));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);

        request.setRequestURI("/pgr/seva");
        ctx.setRequest(request);

        mockServer.expect(requestTo("http://localhost:8091/access/v1/actions/_authorize"))
            .andRespond(withSuccess());

        rbacFilter.run();

        assertEquals(null, ctx.get(ERROR_CODE_KEY));
    }

    @Test(expected = CustomException.class)
    public void shouldAbortWhenUserDoesNotHaveAnyAuthorizedURI() throws Throwable {
        MonitoringHelper.initMocks();
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("/hr-masters/do/something");
        ctx.setRequest(request);
        User user = new User();
        user.setActions(new ArrayList<>());
        user.setRoles(Collections.singletonList(new Role(10L, "CITIZEN", "CITIZEN", "default")));
        ctx.set(USER_INFO_KEY, user);

        mockServer.expect(requestTo("http://localhost:8091/access/v1/actions/_authorize"))
            .andRespond(withUnauthorizedRequest());

        try {
            rbacFilter.run();
        } catch (RuntimeException ex) {
            CustomException e = (CustomException)ex.getCause();
            assertThat(e.nStatusCode, is(403));
            throw ex.getCause();
        }

        assertForbiddenResponse(ctx);
    }

    @Test
    @Ignore
    public void shouldNotAbortWhenUserIsRequestingURIAndAuthorizedURIHasDynamicPlaceHolders() throws Exception {
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva/{id}/_update");
        user.setActions(new ArrayList<>(Arrays.asList(action1)));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);
        request.setRequestURI("/pgr/seva/123/_update");
        ctx.setRequest(request);

        System.out.println(action1.getRegexUrl());
        System.out.println("/pgr/seva/123/_update".matches(action1.getRegexUrl()));

        rbacFilter.run();

        assertEquals(null, ctx.get(ERROR_CODE_KEY));
    }

    @Test
    @Ignore
    public void shouldNotAbortWhenUserIsRequestingURIAndAuthorizedURIHasMultipleDynamicPlaceHolders() throws Exception {
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva/{tenantCode}/{id}/_update");
        user.setActions(new ArrayList<>(Arrays.asList(action1)));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);
        request.setRequestURI("/pgr/seva/default/123/_update");
        ctx.setRequest(request);
        rbacFilter.run();

        assertEquals(null, ctx.get(ERROR_CODE_KEY));
    }

    @Test(expected = CustomException.class)
    @Ignore
    public void shouldAbortWhenUserIsRequestingURIAndAuthorizedURIWithDynamicPlaceHoldersDoesNotMatch() throws Throwable {
        MonitoringHelper.initMocks();
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva/{id}/_create");
        user.setActions(new ArrayList<>(Arrays.asList(action1)));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);

        request.setRequestURI("/pgr/seva/123/_update");
        ctx.setRequest(request);
        try {
            rbacFilter.run();
        } catch (RuntimeException ex) {
            CustomException e = (CustomException)ex.getCause();
            assertThat(e.nStatusCode, is(403));
            throw ex.getCause();
        }

        assertForbiddenResponse(ctx);
    }

    private void assertForbiddenResponse(RequestContext ctx) {
        assertEquals(403, ctx.get(ERROR_CODE_KEY));
        assertFalse(ctx.sendZuulResponse());
    }

}