package org.egov.filters.pre;

import com.netflix.zuul.context.RequestContext;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.HashSet;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class RbacPreCheckFilterTest {
    private MockHttpServletRequest request = new MockHttpServletRequest();

    private HashSet<String> openEndpointsWhitelist = new HashSet<>();
    private HashSet<String> anonymousEndpointsWhitelist = new HashSet<>();

    private RbacPreCheckFilter rbacPreCheckFilter;

    @Before
    public void init(){
        openEndpointsWhitelist.add("/user/_details");
        openEndpointsWhitelist.add("open-endpoint2");
        anonymousEndpointsWhitelist.add("/pgr/complaintTypeCategories");
        anonymousEndpointsWhitelist.add("anonymous-endpoint2");
        rbacPreCheckFilter = new RbacPreCheckFilter(openEndpointsWhitelist, anonymousEndpointsWhitelist);
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.clear();
        ctx.setRequest(request);

    }

    @Test
    public void testBasicProperties() {
        assertThat(rbacPreCheckFilter.filterType(), is("pre"));
        assertThat(rbacPreCheckFilter.filterOrder(), is(2));
    }

    @Test
    public void testThatRbacCheckShouldNotHappenForOpenEndpoints() {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("/user/_details");
        ctx.setRequest(request);
        rbacPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoRbac"));
    }

    @Test
    public void test_That_Rbac_Check_Sould_Not_Happen_For_AnonymousEndPoints(){
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("/pgr/complaintTypeCategories");
        ctx.setRequest(request);
        rbacPreCheckFilter.run();
        assertFalse((Boolean) ctx.get("shouldDoRbac"));
    }

    @Test
    public void test_should_return_true_when_uri_is_not_in_open_or_anonymous_endpoint_and_uri_is_present_in_rbacwhitelist() throws Exception {
        RequestContext ctx = RequestContext.getCurrentContext();
        request.setRequestURI("/pgr/seva/_create");
        ctx.setRequest(request);
        rbacPreCheckFilter.run();
        assertTrue((Boolean) ctx.get("shouldDoRbac"));
    }

}