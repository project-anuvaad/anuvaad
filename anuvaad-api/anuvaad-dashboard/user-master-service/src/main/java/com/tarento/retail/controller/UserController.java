package com.tarento.retail.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.util.StreamUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tarento.retail.config.JwtTokenUtil;
import com.tarento.retail.dto.CountryDto;
import com.tarento.retail.dto.UserCountryDto;
import com.tarento.retail.dto.UserDto;
import com.tarento.retail.dto.UserMasterRoleCountryOrgDto;
import com.tarento.retail.dto.UserMasterRoleDto;
import com.tarento.retail.dto.UserRoleDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.Country;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.model.UserDeviceToken;
import com.tarento.retail.model.UserProfile;
import com.tarento.retail.model.contract.OTPValidationRequest;
import com.tarento.retail.model.contract.OrderConfirmationRequest;
import com.tarento.retail.model.contract.RoleActionRequest;
import com.tarento.retail.model.enums.EmploymentType;
import com.tarento.retail.service.UserService;
import com.tarento.retail.util.Constants;
import com.tarento.retail.util.PathRoutes;
import com.tarento.retail.util.ResponseGenerator;
import com.tarento.retail.util.ResponseMessages;

@RestController
@RequestMapping(PathRoutes.USER_ACTIONS_URL)
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private UserDetailsService userDetailsService;

	public static final org.slf4j.Logger logger = LoggerFactory.getLogger(UserController.class);

	@PostMapping(PathRoutes.UserRoutes.USER_ACTIONS_POST)
	public String getActions(@RequestBody RoleActionRequest roleActionRequest) throws JsonProcessingException {
		List<Action> actions = userService.findAllActionsByRoleID(roleActionRequest.getRoleRequest().getRoles());
		return ResponseGenerator.successResponse(actions);
	}

	@RequestMapping(value = PathRoutes.UserRoutes.COUNTRY_LIST_GET, method = RequestMethod.GET)
	public String getUserCountryList(@RequestParam(value = "userId", required = false) Long userId,
			ServletWebRequest request) throws JsonProcessingException {
		if (userId != null)
			return ResponseGenerator.successResponse(userService.getCountryListForUser(userId));
		else
			return ResponseGenerator.successResponse(userService.getCountryList());
	}

	@RequestMapping(value = PathRoutes.UserRoutes.ORG_COUNTRY_LIST_GET, method = RequestMethod.GET)
	public String getOrgCountryList(@RequestParam(value = "orgId", required = false) Long orgId,
			ServletWebRequest request) throws JsonProcessingException {
		if (orgId != null)
			return ResponseGenerator.successResponse(userService.getCountryListForOrg(orgId));
		else
			return ResponseGenerator.failureResponse("OrgId is empty");

	}

	@RequestMapping(value = PathRoutes.UserRoutes.USER_COUNTRY_MAPPING_POST, method = RequestMethod.POST)
	public String mapUserToCountry(@RequestBody UserCountryDto userCountry, BindingResult result)
			throws JsonProcessingException {
		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}

		if (userCountry != null && userCountry.getCountries() != null) {
			if (userCountry.getCountries().isEmpty()) {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.COUNTRY_ID_UNAVAILABLE);
			}
			if (userCountry.getUserId() == null) {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.USER_ID_UNAVAILABLE);
			}
		} else {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.COUNTRY_DETAILS_UNAVAILABLE);
		}

		Boolean mappingStatus = userService.mapUserToCountry(userCountry);
		if (mappingStatus) {
			return ResponseGenerator.successResponse(ResponseMessages.SuccessMessages.USER_COUNTRY_MAPPED);
		} else {
			return ResponseGenerator.failureResponse(HttpStatus.SERVICE_UNAVAILABLE.toString());
		}
	}

	@RequestMapping(value = PathRoutes.UserRoutes.EMPLOYMENT_TYPES_GET, method = RequestMethod.GET)
	public String getEmploymentTypeEnum() throws JsonProcessingException {
		final List<Country> modelList = new ArrayList<>();
		for (final EmploymentType key : EmploymentType.values()) {
			Country data = new Country();
			data.setKey(key.name());
			modelList.add(data);
		}
		return ResponseGenerator.successResponse(modelList);
	}

	@RequestMapping(value = PathRoutes.UserRoutes.NUMBER_OF_USERS_GET, method = RequestMethod.GET)
	public String getNumberOfUsers(@RequestParam(value = "role", required = false) Long role,
			@RequestParam(value = "active", required = false) Boolean active) throws JsonProcessingException {
		return ResponseGenerator.successResponse(userService.getNumberOfUsers(role, active));
	}

	@RequestMapping(value = PathRoutes.UserRoutes.NUMBER_OF_ROLES_GET, method = RequestMethod.GET)
	public String getNumberOfRoles() throws JsonProcessingException {
		return ResponseGenerator.successResponse(userService.getNumberOfRoles());
	}

	@RequestMapping(value = PathRoutes.UserRoutes.USER_BY_ID_GET, method = RequestMethod.GET)
	public String getOne(@PathVariable(value = "id") Long id,
			@RequestParam(value = "orgId", required = true) Long orgId) throws JsonProcessingException {
		return ResponseGenerator.successResponse(userService.findById(id, orgId));
	}

	@RequestMapping(value = PathRoutes.UserRoutes.CREATE_UPDATE_USER_POST, method = RequestMethod.POST)
	public String saveUser(@RequestBody UserProfile profile,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) throws JsonProcessingException {

		Boolean userTokenAvailable = userService.findUserByToken(authToken);
		String username = "";

		if (userTokenAvailable) {
			username = jwtTokenUtil.getUsernameFromToken(authToken);

			User user = userService.findOne(username);

			if (profile != null) {
				if (StringUtils.isNotBlank(profile.getEmailId())) {
					profile.setUsername(profile.getEmailId());
				} else {
					ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.EMAIL_MANDATORY);
				}
				Long userId = userService.checkUserNameExists(profile.getEmailId(), profile.getPhoneNo());
				if (profile.getId() != null && profile.getId() > 0) {
					if (userId.equals(profile.getId())) {
						return ResponseGenerator.successResponse(userService.updateUserProfile(profile));
					} else {
						return ResponseGenerator
								.failureResponse(ResponseMessages.ErrorMessages.EMAIL_PHONE_ALREADY_EXISTS);
					}
				} else {
					if (userId != null && userId > 0) {
						return ResponseGenerator
								.failureResponse(ResponseMessages.ErrorMessages.EMAIL_PHONE_ALREADY_EXISTS);
					}
				}
				profile.setCreatedBy(user.getId());
				profile.setUpdatedBy(user.getId());
				profile = userService.saveUserProfile(profile);
				UserCountryDto userCountryDto = new UserCountryDto();
				userCountryDto.setUserId(profile.getId());
				List<Country> country = new ArrayList<>();
				Country c = new Country();
				c.setId(profile.getCountryId());
				country.add(c);
				userCountryDto.setCountries(country);
				return ResponseGenerator.successResponse(userService.mapUserToCountry(userCountryDto));
			}
		}
		return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
	}

	@RequestMapping(value = PathRoutes.UserRoutes.USER_DEVICE_TOKEN_POST, method = RequestMethod.POST)
	public String updateDeviceToken(@RequestBody UserDeviceToken deviceToken,
			@RequestHeader(value = "x-user-info", required = false) String xUserInfo) throws JsonProcessingException {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		User thisUser = gson.fromJson(xUserInfo, User.class);
		if (userService.checkUserTokenExists(thisUser.getId(), deviceToken.getDeviceToken())) {
			return ResponseGenerator.successResponse("Success");
		}
		Long authTokenRef = userService.fetchAuthTokenReference(thisUser.getAuthToken());
		Boolean updateStatus = userService.updateUserDeviceToken(thisUser.getId(), deviceToken.getDeviceToken(),
				authTokenRef);
		if (updateStatus)
			return ResponseGenerator.successResponse("Success");

		return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
	}

	@RequestMapping(value = PathRoutes.UserRoutes.LIST_USER_GET, method = RequestMethod.GET)
	public String listUser(@RequestParam(value = "pageNumber", required = false) Integer pageNumber,
			@RequestParam(value = "numberOfRecords", required = false) Integer numberOfRecords,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "active", required = false) Boolean active,
			@RequestParam(value = "roles", required = false) List<Long> roles,
			@RequestParam(value = "countryCode", required = false) String countryCode,
			@RequestParam(value = "orgId", required = true) Long orgId) throws JsonProcessingException {
		return ResponseGenerator.successResponse(
				userService.findAll(pageNumber, numberOfRecords, active, keyword, roles, countryCode, orgId));
	}

	@RequestMapping(value = PathRoutes.UserRoutes.REMOVE_ROLE_MAPPING, method = RequestMethod.POST)
	public String deleteUserToRole(@RequestBody UserRoleDto userRole,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken, BindingResult result)
			throws JsonProcessingException {

		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}
		Boolean userTokenAvailable = userService.findUserByToken(authToken);
		String username = "";

		if (userTokenAvailable) {
			username = jwtTokenUtil.getUsernameFromToken(authToken);

			User user = userService.findOne(username);
			if (userRole != null && userRole.getRoles() != null) {
				if (userRole.getRoles().isEmpty()) {
					return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
				}
				if (userRole.getUserId() == null) {
					return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.USER_ID_UNAVAILABLE);
				}
			} else {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_DETAILS_UNAVAILABLE);
			}

			Boolean mappingStatus = userService.deleteUserToRole(userRole);
			if (mappingStatus) {
				return ResponseGenerator.successResponse(ResponseMessages.SuccessMessages.REMOVE_USER_ROLE_MAPPED);
			} else {
				return ResponseGenerator.failureResponse(HttpStatus.SERVICE_UNAVAILABLE.toString());
			}
		}
		return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.UNAUTHORIZED_ROLE_MAPPING_PERMISSION);

	}

	@RequestMapping(value = PathRoutes.UserRoutes.USER_ROLE_MAPPING_POST, method = RequestMethod.POST)
	public String mapUserToRole(@RequestBody UserRoleDto userRole,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken, BindingResult result)
			throws JsonProcessingException {
		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}

		Boolean userTokenAvailable = userService.findUserByToken(authToken);
		String username = "";

		if (userTokenAvailable) {
			username = jwtTokenUtil.getUsernameFromToken(authToken);

			User user = userService.findOne(username);

			if (userRole != null && userRole.getRoles() != null) {
				// if (userRole.getRoles().isEmpty()) {
				// return
				// ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
				// }
				if (userRole.getUserId() == null) {
					return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.USER_ID_UNAVAILABLE);
				}
			} else {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_DETAILS_UNAVAILABLE);
			}

			Boolean mappingStatus = userService.mapUserToRole(userRole);
			if (mappingStatus) {
				return ResponseGenerator.successResponse(ResponseMessages.SuccessMessages.USER_ROLE_MAPPED);
			} else {
				return ResponseGenerator.failureResponse(HttpStatus.SERVICE_UNAVAILABLE.toString());
			}
		}
		return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.UNAUTHORIZED_ROLE_MAPPING_PERMISSION);

	}

	@RequestMapping(value = PathRoutes.UserRoutes.USER_DETAILS_GET, method = RequestMethod.GET)
	public String getUserDetails(@RequestParam(value = "userIdList") List<Long> userIdList)
			throws JsonProcessingException {
		List<UserProfile> profileList = new ArrayList<>();
		if (userIdList != null && !userIdList.isEmpty()) {
			profileList = userService.findListOfUsers(userIdList);
		}
		return ResponseGenerator.successResponse(profileList);
	}

	@PostMapping(PathRoutes.UserRoutes.SINGLE_FILE_UPLOAD_POST)
	public String singleFileUpload(@RequestParam("file") MultipartFile file,
			@RequestParam(value = "userId", required = true) long userId) throws IOException {
		return ResponseGenerator.successResponse(userService.uploadFile(file, userId));
	}

	@RequestMapping(value = PathRoutes.UserRoutes.IMAGE_GET, method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<byte[]> getImage(@RequestParam String url) throws IOException {
		File file = new File(Constants.UPLOADED_FOLDER + url);
		InputStream targetStream = new FileInputStream(file);
		byte[] bytes = StreamUtils.copyToByteArray(targetStream);
		return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(bytes);
	}

	@RequestMapping(value = PathRoutes.UserRoutes.LOGOUT_GET, method = RequestMethod.GET)
	public String invalidateToken(@RequestHeader(value = Constants.AUTH_HEADER) String authToken)
			throws JsonProcessingException {
		Boolean status = false;
		if (authToken != null) {
			authToken = authToken.replace("Bearer ", "");
			status = userService.invalidateToken(authToken);
		}
		if (status)
			return ResponseGenerator.successResponse(ResponseMessages.SuccessMessages.LOGOUT_SUCCESS);
		return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.LOGOUT_FAILED);
	}

	/*
	 * -----------------------------------------------------STUBS---------------
	 * -----------------------------------------------------
	 */
	/*
	 * ------------------------------- Once the B17 Integration is added, these
	 * stubs will be removed -------------------------------
	 */

	@RequestMapping(value = "orderConfirmation", method = RequestMethod.POST)
	public String orderConfirmation(@RequestBody OrderConfirmationRequest orderConfirmation)
			throws JsonProcessingException {
		return ResponseGenerator.successResponse("Success");
	}

	@RequestMapping(value = "otpvalidation", method = RequestMethod.POST)
	public String otpValidation(@RequestBody OTPValidationRequest otpValidation) throws JsonProcessingException {
		String otp = otpValidation.getOtp();
		if (otpValidation.isBypassFlag()) {
			return ResponseGenerator.successResponse("Success");
		}
		if (otp.equals("54321") || otp.equals("8088") || otp.equals("465842") || otp.equals("95000")
				|| otp.equals("96971")) {
			return ResponseGenerator.successResponse("Success");
		}
		return ResponseGenerator.failureResponse("Failed");
	}

	@RequestMapping(value = "getDeviceTokenForUserIds", method = RequestMethod.GET)
	public List<UserDeviceToken> getUsersForAStore(
			@RequestParam(value = "userIds", required = false) List<Long> userIdList) throws JsonProcessingException {
		if (userIdList != null) {
			List<UserDeviceToken> tokenList = userService.getDeviceTokenForUsers(userIdList);
			if (tokenList != null) {
				return tokenList;
			}
			return null;
		}
		return null;
	}

	@RequestMapping(value = PathRoutes.UserRoutes.CREATE_UPDATE_COUNTRY, method = RequestMethod.POST)
	public String createOrUpdateCountry(@RequestBody CountryDto country) throws JsonProcessingException {
		if (country.getId() != null) {
			return ResponseGenerator.successResponse(userService.updateCountry(country));
		}
		// Check if country already exist
		if (userService.checkCountryAlreadyExists(country.getCode(), country.getOrgId())) {
			ResponseGenerator.failureResponse("Country With Same Code Exists");
		}
		return ResponseGenerator.successResponse(userService.createCountry(country));
	}

	@RequestMapping(value = PathRoutes.AuthenticationRoutes.AUTH_TOKEN_VALIDATE_GET, method = RequestMethod.GET)
	public Object validateUserToken(@RequestHeader(value = Constants.AUTH_HEADER) String authToken)
			throws JsonProcessingException {
		String username = "";
		String authTokenInfo = null;
		if (StringUtils.isNotBlank(authToken)) {
			authTokenInfo = authToken;
			Boolean userTokenAvailable = userService.findUserByToken(authTokenInfo);
			if (userTokenAvailable)
				username = jwtTokenUtil.getUsernameFromToken(authTokenInfo);
		}
		UserDetails userDetails = userDetailsService.loadUserByUsername(username);

		if (jwtTokenUtil.validateToken(authTokenInfo, userDetails)) {
			UserDto userDto = new UserDto();
			User user = userService.findOne(username);
			userDto.setId(user.getId());
			userDto.setUserName(user.getUsername());
			userDto.setEmailId(user.getEmailId());
			userDto.setRoles(userService.findAllRolesByUser(user.getId(), user.getOrgId()));
			userDto.setActions(userService.findAllActionsByUser(user.getId(), user.getOrgId()));
			userDto.setOrgId(user.getOrgId());
			userDto.setTimeZone(user.getTimeZone());
//			System.out.println("--------time zone------"+userDto.getTimeZone());
			return ResponseGenerator.successResponse(userDto);
		}
		return ResponseGenerator.failureResponse("Invalid Token");
	}

	// DELETE country by orgId and country ID
	@RequestMapping(value = PathRoutes.UserRoutes.DELETE_COUNTRY, method = RequestMethod.POST)
	public Object deleteCountryForOrg(@RequestBody CountryDto countryDto,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken, BindingResult result)
			throws JsonProcessingException {
		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}
		Boolean userTokenAvailable = userService.findUserByToken(authToken);
		String username = "";

		if (userTokenAvailable) {
			username = jwtTokenUtil.getUsernameFromToken(authToken);
			User user = userService.findOne(username);
			return ResponseGenerator.successResponse(userService.deleteCountryForOrg(countryDto));
		}
		return ResponseGenerator.failureResponse("Invalid Token");
	}

	// DELETE user
	@RequestMapping(value = PathRoutes.UserRoutes.DELETE_USER, method = RequestMethod.POST)
	public Object deleteUser(@RequestBody UserDto userDto,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken, BindingResult result)
			throws JsonProcessingException {
		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}
		Boolean userTokenAvailable = userService.findUserByToken(authToken);
		String username = "";

		if (userTokenAvailable) {
			username = jwtTokenUtil.getUsernameFromToken(authToken);
			User user = userService.findOne(username);
			return ResponseGenerator.successResponse(userService.deleteUser(userDto));
		}
		return ResponseGenerator.failureResponse("Invalid Token");
	}

	// User List based on ROLE and Org Domain
	@RequestMapping(value = PathRoutes.UserRoutes.GET_USERS_BY_MASTER_ROLE, method = RequestMethod.GET)
	public Object getUsersBasedOnManagerRole(@RequestParam(value = "role", required = true) String roleCode,
			@RequestParam(value = "orgId", required = true) long orgId,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) throws JsonProcessingException {

		Boolean userTokenAvailable = userService.findUserByToken(authToken);
		String username = "";

		if (userTokenAvailable) {
			username = jwtTokenUtil.getUsernameFromToken(authToken);
			User user = userService.findOne(username);
			return ResponseGenerator.successResponse(userService.getUsersByMasterRole(roleCode, orgId));
		}
		return ResponseGenerator.failureResponse("Invalid Token");
	}

	// Map user to country by master role id
	@RequestMapping(value = PathRoutes.UserRoutes.MAP_USER_MASTER_ROLE_COUNTRY_ORG, method = RequestMethod.POST)
	public Object mapUserMasterRoleCountryOrg(@RequestBody UserMasterRoleCountryOrgDto userMasterRoleCountryOrgDto,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken, BindingResult result)
			throws JsonProcessingException {
		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}
		Boolean userTokenAvailable = userService.findUserByToken(authToken);
		String username = "";

		if (userTokenAvailable) {
			username = jwtTokenUtil.getUsernameFromToken(authToken);
			User user = userService.findOne(username);
			return ResponseGenerator
					.successResponse(userService.mapUserMasterRoleCountryOrg(userMasterRoleCountryOrgDto));
		}
		return ResponseGenerator.failureResponse("Invalid Token");
	}

	// GET MASTER ROLE
	@RequestMapping(value = PathRoutes.RoleActionRoutes.GET_MASTER_ROLE_BY_ORG_DOMAIN, method = RequestMethod.GET)
	public Object getMasterRoleBasedOnOrgDomain(@RequestParam Long org_domain_id,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) throws JsonProcessingException {
		Boolean userTokenAvailable = userService.findUserByToken(authToken);
		String username = "";

		if (userTokenAvailable) {
			username = jwtTokenUtil.getUsernameFromToken(authToken);
			User user = userService.findOne(username);
			return ResponseGenerator.successResponse(userService.getMasterRoleByOrgDomainId(org_domain_id));
		}
		return ResponseGenerator.failureResponse("Invalid Token");
	}

}
