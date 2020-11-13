/*package org.musti.filters.pre;

import com.netflix.zuul.context.RequestContext;

import org.junit.Before;
import org.junit.Test;
import org.musti.contract.Action;
import org.musti.contract.User;
import org.musti.filters.pre.RbacFilter;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.ArrayList;
import java.util.Arrays;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.musti.constants.RequestContextConstants.ERROR_CODE_KEY;
import static org.musti.constants.RequestContextConstants.USER_INFO_KEY;

public class RbacFilterTest {

    private MockHttpServletRequest request;
    private RbacFilter rbacFilter;

    @Before
    public void init(){
        request = new MockHttpServletRequest();
        rbacFilter = new RbacFilter();
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

    @Test
    public void shouldAbortWhenUserIsRequestingUnauthorizedURI() throws Exception {
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva");
        user.setActions(new ArrayList<>(Arrays.asList(action1)));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);

        request.setRequestURI("/hr-masters/do/something");
        ctx.setRequest(request);
        rbacFilter.run();

        assertForbiddenResponse(ctx);
    }

    @Test
    public void shouldNotAbortWhenUserIsRequestingAuthorizedURI() throws Exception {
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva");
        user.setActions(new ArrayList<>(Arrays.asList(action1)));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);

        request.setRequestURI("/pgr/seva");
        ctx.setRequest(request);
        rbacFilter.run();

        assertEquals(null, ctx.get(ERROR_CODE_KEY));
    }

    @Test
    public void shouldAbortWhenUserDoesNotHaveAnyAuthorizedURI() throws Exception {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("/hr-masters/do/something");
        ctx.setRequest(request);
        User user = new User();
        user.setActions(new ArrayList<>());
        ctx.set(USER_INFO_KEY, user);

        rbacFilter.run();

        assertForbiddenResponse(ctx);
    }

    @Test
    public void shouldNotAbortWhenUserIsRequestingURIAndAuthorizedURIHasDynamicPlaceHolders() throws Exception {
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva/{id}/_update");
        user.setActions(new ArrayList<>(Arrays.asList(action1)));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);
        request.setRequestURI("/pgr/seva/123/_update");
        ctx.setRequest(request);

        rbacFilter.run();

        assertEquals(null, ctx.get(ERROR_CODE_KEY));
    }

    @Test
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

    @Test
    public void shouldAbortWhenUserIsRequestingURIAndAuthorizedURIWithDynamicPlaceHoldersDoesNotMatch() throws Exception {
        User user = new User();
        Action action1  = new Action();
        action1.setUrl("/pgr/seva/{id}/_create");
        user.setActions(new ArrayList<>(Arrays.asList(action1)));
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(USER_INFO_KEY, user);

        request.setRequestURI("/pgr/seva/123/_update");
        ctx.setRequest(request);
        rbacFilter.run();

        assertForbiddenResponse(ctx);
    }

    private void assertForbiddenResponse(RequestContext ctx) {
        assertEquals(403, ctx.get(ERROR_CODE_KEY));
        assertFalse(ctx.sendZuulResponse());
    }

}*/