package com.tarento.retail.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tarento.retail.config.JwtTokenUtil;
import com.tarento.retail.dao.impl.UserDaoImpl;
import com.tarento.retail.dto.UserDto;
import com.tarento.retail.model.LoginDto;
import com.tarento.retail.model.LoginUser;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.model.UserAuthentication;
import com.tarento.retail.service.UserService;
import com.tarento.retail.util.Constants;
import com.tarento.retail.util.PathRoutes;
import com.tarento.retail.util.ResponseGenerator;

@RestController
public class AuthenticationController {

	public static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private UserService userService;

	@Autowired
	private UserDetailsService userDetailsService;

	@RequestMapping(value = PathRoutes.AuthenticationRoutes.AUTH_LOGIN_POST, method = RequestMethod.POST)
	public String register(@RequestBody LoginUser loginUser) throws JsonProcessingException {
		User user = null;
		LOGGER.info(" Starting the Authentication Check on LOGIN ");
		if (loginUser.getUsername() != null && loginUser.getPassword() != null)// && loginUser.getPhoneNo() == null)
		{
			final Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword()));
			SecurityContextHolder.getContext().setAuthentication(authentication);
			user = userService.findOne(loginUser.getUsername());
			LOGGER.info("Fetched a User for the Username ");
		} else if (loginUser.getUsername() == null && loginUser.getPassword() == null
				&& loginUser.getPhoneNo() != null) {
			user = userService.findMobile(loginUser.getPhoneNo());
		} else
			return ResponseGenerator.failureResponse("Request Parameter mismatched");

		if (user != null) {
			final String token = jwtTokenUtil.generateToken(user);
			UserAuthentication userAuthentication = new UserAuthentication();

			userAuthentication.setUserId(user.getId());
			userAuthentication.setAuthToken(token);
			userAuthentication = userService.save(userAuthentication);
			LOGGER.info("Saving the User Authentication on Auth Records Log");
			List<Role> userRoles = userService.findAllRolesByUser(user.getId(), user.getOrgId());
			LOGGER.info("Fetched Roles Assigned for the User");
			LoginDto loginDto = new LoginDto();
			loginDto.setUserAvatarUrl(user.getAvatarUrl());
			loginDto.setAuthToken(token);
			loginDto.setUsername(user.getUsername());
			loginDto.setUserId(user.getId());
			loginDto.setOrgId(user.getOrgId());
			loginDto.setCountryCode(user.getCountryCode());
			loginDto.setRoles(userRoles);
			return ResponseGenerator.successResponse(loginDto);
		}
		return ResponseGenerator.failureResponse("Invalid credentials. Please retry");
	}

	@RequestMapping(value = PathRoutes.AuthenticationRoutes.AUTH_TOKEN_VALIDATE_POST, method = RequestMethod.POST)
	public Object validateToken(@RequestBody LoginDto token,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) {
		String username = "";
		String authTokenInfo = null;
		if (token != null && StringUtils.isNotBlank(token.getAuthToken())) {
			authTokenInfo = token.getAuthToken();
			username = jwtTokenUtil.getUsernameFromToken(token.getAuthToken());
		} else if (StringUtils.isNotBlank(authToken)) {
			authTokenInfo = authToken;
			username = jwtTokenUtil.getUsernameFromToken(authToken);
		}
		if(StringUtils.isNotBlank(username)) { 
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			if (jwtTokenUtil.validateToken(authTokenInfo, userDetails)) {
				UserDto userDto = userService.findUserRolesActions(username);
				LOGGER.info(userDto.toString());
				return userDto;
			}
		}
		
		return null;
	}

}
