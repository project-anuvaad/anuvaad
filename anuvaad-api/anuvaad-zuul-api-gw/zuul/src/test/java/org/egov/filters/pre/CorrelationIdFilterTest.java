package org.egov.filters.pre;

import com.netflix.zuul.context.RequestContext;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.MDC;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;

public class CorrelationIdFilterTest {

	private CorrelationIdFilter correlationIdFilter;

	@Before
	public void before() {
		correlationIdFilter = new CorrelationIdFilter();
	}

	@Test
	public void test_should_set_context_with_correlation_id() {
		MockHttpServletRequest request = new MockHttpServletRequest();
		RequestContext.getCurrentContext().setRequest(request);

		correlationIdFilter.run();

		assertNotNull(RequestContext.getCurrentContext().get("CORRELATION_ID"));
	}

    @Test
    public void test_should_set_mdc_with_correlation_id() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContext.getCurrentContext().setRequest(request);

        correlationIdFilter.run();

        assertNotNull(MDC.get("CORRELATION_ID"));
    }

	@Test
	public void test_should_set_filter_order_to_beginning() {
		assertEquals(0, correlationIdFilter.filterOrder());
	}

	@Test
	public void test_should_execute_as_pre_filter() {
		assertEquals("pre", correlationIdFilter.filterType());
	}

	@Test
	public void test_should_always_execute_filter() {
		assertTrue( correlationIdFilter.shouldFilter());
	}

}