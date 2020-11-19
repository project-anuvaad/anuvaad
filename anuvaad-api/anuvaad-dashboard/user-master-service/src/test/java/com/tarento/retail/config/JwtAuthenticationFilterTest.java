package com.tarento.retail.config;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.security.SignatureException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import io.jsonwebtoken.ExpiredJwtException;

@RunWith(PowerMockRunner.class)
@PrepareForTest({SecurityContextHolder.class})
public class JwtAuthenticationFilterTest {


   @Mock
   private JwtTokenUtil jwtTokenUtil;

   @Mock
   private UserDetailsService userDetailsService;
   
	@InjectMocks
	 JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter();
	
	
	 ServletRequest req;
		ServletResponse res;
		FilterChain filterChain;

		@Before
		public void init() {
			req = mock(HttpServletRequest.class);
			res = mock(HttpServletResponse.class);

		}
	 
	 @Test
	 public void doFilterInternal() throws IOException, ServletException{
		 
			req = Mockito.mock(HttpServletRequest.class);
			res = Mockito.mock(HttpServletResponse.class);
			filterChain =  mock(FilterChain.class);
		 		HttpServletRequest http = (HttpServletRequest)req ;
		 		 Mockito.when(http.getHeader("Authorization")).thenReturn("Bearer eiuroeirj");
				 
				 Mockito.when(http.getHeader("Authorization")).thenReturn("Bearer eiuroeirj");
				
				 PowerMockito.mockStatic(SecurityContextHolder.class);
				// PowerMockito.mock(SecurityContext.class);
				 SecurityContext context = mock(SecurityContext.class);
				 Mockito.when(context.getAuthentication()).thenReturn(null);
				 when(SecurityContextHolder.getContext()).thenReturn(context);
				 
				 
				 UserDetails user = mock(UserDetails.class);
				 Mockito.when(userDetailsService.loadUserByUsername("tesla")).thenReturn(user);
				 
				 Mockito.doNothing().when(filterChain).doFilter(req, res);
				 //JwtTokenUtil jwtToken = mock(JwtTokenUtil.class);
				 Mockito.when(jwtTokenUtil.getUsernameFromToken("eiuroeirj")).thenReturn("tesla");
				 Mockito.when(jwtTokenUtil.validateToken("eiuroeirj", user)).thenReturn(true);

				 jwtFilter.doFilterInternal(http,(HttpServletResponse) res, filterChain);
		 
	 }
	 
	 @Test
	 public void doFilterInternalExceptionIllegal() throws IOException, ServletException{
		 
			req = Mockito.mock(HttpServletRequest.class);
			res = Mockito.mock(HttpServletResponse.class);
			filterChain =  mock(FilterChain.class);
		 		HttpServletRequest http = (HttpServletRequest)req ;
		 		 Mockito.when(http.getHeader("Authorization")).thenReturn("Bearer eiuroeirj");
				 
				 Mockito.when(http.getHeader("Authorization")).thenReturn("Bearer eiuroeirj");
				
				 PowerMockito.mockStatic(SecurityContextHolder.class);
				// PowerMockito.mock(SecurityContext.class);
				 SecurityContext context = mock(SecurityContext.class);
				 Mockito.when(context.getAuthentication()).thenReturn(null);
				 when(SecurityContextHolder.getContext()).thenReturn(context);
				 
				 
				 UserDetails user = mock(UserDetails.class);
				 Mockito.when(userDetailsService.loadUserByUsername("tesla")).thenReturn(user);
				 
				 Mockito.doNothing().when(filterChain).doFilter(req, res);
				 //JwtTokenUtil jwtToken = mock(JwtTokenUtil.class);
				 Mockito.doThrow(IllegalArgumentException.class).when(jwtTokenUtil).getUsernameFromToken("eiuroeirj");
				 Mockito.when(jwtTokenUtil.validateToken("eiuroeirj", user)).thenReturn(true);

				 jwtFilter.doFilterInternal(http,(HttpServletResponse) res, filterChain);
		 
	 }
	 @Test
	 public void doFilterInternalExpiredJwtException() throws IOException, ServletException{
		 
			req = Mockito.mock(HttpServletRequest.class);
			res = Mockito.mock(HttpServletResponse.class);
			filterChain =  mock(FilterChain.class);
		 		HttpServletRequest http = (HttpServletRequest)req ;
		 		 Mockito.when(http.getHeader("Authorization")).thenReturn("Bearer eiuroeirj");
				 
				 Mockito.when(http.getHeader("Authorization")).thenReturn("Bearer eiuroeirj");
				
				 PowerMockito.mockStatic(SecurityContextHolder.class);
				// PowerMockito.mock(SecurityContext.class);
				 SecurityContext context = mock(SecurityContext.class);
				 Mockito.when(context.getAuthentication()).thenReturn(null);
				 when(SecurityContextHolder.getContext()).thenReturn(context);
				 
				 
				 UserDetails user = mock(UserDetails.class);
				 Mockito.when(userDetailsService.loadUserByUsername("tesla")).thenReturn(user);
				 
				 Mockito.doNothing().when(filterChain).doFilter(req, res);
				 //JwtTokenUtil jwtToken = mock(JwtTokenUtil.class);
				 Mockito.doThrow(ExpiredJwtException.class).when(jwtTokenUtil).getUsernameFromToken("eiuroeirj");
				 Mockito.when(jwtTokenUtil.validateToken("eiuroeirj", user)).thenReturn(true);

				 jwtFilter.doFilterInternal(http,(HttpServletResponse) res, filterChain);
		 
	 }
	 
	 @Test(expected = SignatureException.class)
	 public void doFilterInternalSignatureException() throws IOException, ServletException{
		 
			req = Mockito.mock(HttpServletRequest.class);
			res = Mockito.mock(HttpServletResponse.class);
			filterChain =  mock(FilterChain.class);
		 		HttpServletRequest http = (HttpServletRequest)req ;
		 		 Mockito.when(http.getHeader("Authorization")).thenReturn("Bearer eiuroeirj");
				 
				 Mockito.when(http.getHeader("Authorization")).thenReturn("Bearer eiuroeirj");
				
				 PowerMockito.mockStatic(SecurityContextHolder.class);
				// PowerMockito.mock(SecurityContext.class);
				 SecurityContext context = mock(SecurityContext.class);
				 Mockito.when(context.getAuthentication()).thenReturn(null);
				 when(SecurityContextHolder.getContext()).thenReturn(context);
				 
				 
				 UserDetails user = mock(UserDetails.class);
				 Mockito.when(userDetailsService.loadUserByUsername("tesla")).thenReturn(user);
				 
				 Mockito.doNothing().when(filterChain).doFilter(req, res);
				 //JwtTokenUtil jwtToken = mock(JwtTokenUtil.class);
				 Mockito.doThrow(SignatureException.class).when(jwtTokenUtil).getUsernameFromToken("eiuroeirj");
				 Mockito.when(jwtTokenUtil.validateToken("eiuroeirj", user)).thenReturn(true);

				 jwtFilter.doFilterInternal(http,(HttpServletResponse) res, filterChain);
		 
	 }
}
