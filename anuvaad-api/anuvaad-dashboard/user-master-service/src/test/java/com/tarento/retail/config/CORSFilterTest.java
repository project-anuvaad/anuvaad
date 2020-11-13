package com.tarento.retail.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockFilterChain;

public class CORSFilterTest extends Mockito {

	CORSFilter corsFilter;
	ServletRequest req;
	ServletResponse res;
	FilterChain filterChain;

	@Before
	public void init() {
		req = mock(HttpServletRequest.class);
		res = mock(HttpServletResponse.class);

	}

	@Test
	public void doFilterTest() throws IOException, ServletException {
		filterChain = mock(MockFilterChain.class);

		corsFilter = new CORSFilter();
		Mockito.doNothing().when(filterChain).doFilter(req, res);
		corsFilter.doFilter(req, res, filterChain);

	}

	@Test(expected = ServletException.class)
	public void doFilterTestException() throws IOException, ServletException {
		filterChain = mock(MockFilterChain.class);
		corsFilter = new CORSFilter();
		doThrow(new ServletException()).when(filterChain).doFilter(req, res);
		corsFilter.doFilter(req, res, filterChain);

	}
	
	@Test(expected = IOException.class)
	public void doFilterTestIOException() throws IOException, ServletException {
		filterChain = mock(MockFilterChain.class);
		corsFilter = new CORSFilter();
		doThrow(new IOException()).when(filterChain).doFilter(req, res);
		corsFilter.doFilter(req, res, filterChain);

	}

}
