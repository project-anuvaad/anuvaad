package com.tarento.retail.config;

import static org.mockito.Mockito.mock;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.security.core.userdetails.UserDetails;

import com.tarento.retail.model.User;

import junit.framework.Assert;

public class JwtTokenUtilTest {
	
	
	User user;
	
	@Before
	public void init(){
		user = new User();
		user.setEmailId("test@gmail.com");
		user.setUsername("teslae");
		
	}
	
	@SuppressWarnings("deprecation")
	@Test
	public void getToken(){
		JwtTokenUtil jwtToken = new JwtTokenUtil();
		 String authToken =jwtToken.generateToken(user);
		 String name = jwtToken.getUsernameFromToken(authToken);
		 Assert.assertEquals("teslae", name);
		 UserDetails userDetails = mock(UserDetails.class);
		 Mockito.when(userDetails.getUsername()).thenReturn("teslae");
		 
		 
		 Boolean val = jwtToken.validateToken(authToken, userDetails);
		 Assert.assertTrue(val);
	}

}
