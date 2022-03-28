package com.tarento.retail.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tarento.retail.dto.CountryDto;
import com.tarento.retail.dto.CreateOrgResponse;
import com.tarento.retail.dto.RoleActionDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.service.RoleActionService;
import com.tarento.retail.util.Constants;
import com.tarento.retail.util.CustomException;
import com.tarento.retail.util.CustomResponse;
import com.tarento.retail.util.PathRoutes;
import com.tarento.retail.util.ResponseGenerator;
import com.tarento.retail.util.ResponseMessages;
import com.tarento.retail.util.Sql.RoleAction;

@RestController
@RequestMapping(PathRoutes.USER_ACTIONS_URL)
public class RoleActionController {

	@Autowired
	private RoleActionService roleActionService;

	@RequestMapping(value = PathRoutes.RoleActionRoutes.LIST_ROLES_GET, method = RequestMethod.GET)
	public List<Role> listRoles(@PathVariable(value = "orgId") Long orgCode) {
		return roleActionService.getAllRoles(orgCode);
	}

	@RequestMapping(value = PathRoutes.RoleActionRoutes.GET_DEFAULT_ROLES_BY_DOMAIN, method = RequestMethod.GET)
	public Object listRolesByDomain(@RequestParam(value = "orgDomain") String orgDomain)
			throws JsonProcessingException {
		try {
			return ResponseGenerator.successResponse(roleActionService.getAllRolesByDomain(orgDomain));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ORG_DOMAIN_CODE_UNAVAILABLE);
	}

	@RequestMapping(value = PathRoutes.RoleActionRoutes.ADD_ROLE_POST, method = RequestMethod.POST)
	public String saveRole(@RequestBody Role role, BindingResult result)
			throws AuthenticationException, JsonProcessingException {
		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}

		if (role != null) {
			if (StringUtils.isBlank(role.getName())) {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_NAME_UNAVAILABLE);
			}
		} else {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_DETAILS_UNAVAILABLE);
		}

		Role savedRole = roleActionService.saveRole(role);
		if (savedRole != null) {
			List<Role> savedRoles = new ArrayList<>();
			savedRoles.add(savedRole);
			return ResponseGenerator.successResponse(savedRoles);
		} else {
			return ResponseGenerator.failureResponse(HttpStatus.SERVICE_UNAVAILABLE.toString());
		}
	}

	@RequestMapping(value = PathRoutes.RoleActionRoutes.ROLE_BY_ID_GET, method = RequestMethod.GET)
	public String getOne(@PathVariable(value = "id") Long id) throws JsonProcessingException {
		return ResponseGenerator.successResponse(roleActionService.findById(id));
	}

	@RequestMapping(value = PathRoutes.RoleActionRoutes.UPDATE_ROLE_POST, method = RequestMethod.PUT)
	public String update(@RequestBody Role role, BindingResult result)
			throws AuthenticationException, JsonProcessingException {
		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}

		if (role != null) {
			if (role.getId() == null) {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
			}
			if (StringUtils.isBlank(role.getName())) {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_NAME_UNAVAILABLE);
			}
			if (role.getId() <= 0) {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_INVALID);
			}
		} else {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_DETAILS_UNAVAILABLE);
		}

		Role savedRole = roleActionService.updateRole(role);
		if (savedRole != null) {
			List<Object> savedRoles = new ArrayList<>();
			savedRoles.add(savedRole);
			return ResponseGenerator.successResponse(savedRoles);
		} else {
			return ResponseGenerator.failureResponse(HttpStatus.SERVICE_UNAVAILABLE.toString());
		}
	}

	// This API is not in use and needs to be rewritten ..... !

	@RequestMapping(value = PathRoutes.RoleActionRoutes.NEW_ACTION_POST, method = RequestMethod.POST)
	public ResponseEntity<?> saveAction(@RequestBody Action action, BindingResult result)
			throws AuthenticationException {
		if (result.hasErrors()) {
			return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
		}

		List<CustomException> validationExceptions = new ArrayList<>();
		if (action != null) {
			if (StringUtils.isBlank("")) {
				CustomException exception = new CustomException(ResponseMessages.ErrorMessages.CUSTOM_ERROR_ID,
						ResponseMessages.ErrorMessages.FEATURE_NAME_UNAVAILABLE, ResponseMessages.UNAVAILABLE, null);
				validationExceptions.add(exception);
			}
			if (StringUtils.isBlank("")) {
				CustomException exception = new CustomException(ResponseMessages.ErrorMessages.CUSTOM_ERROR_ID,
						ResponseMessages.ErrorMessages.FEATURE_CODE_UNAVAILABLE, ResponseMessages.UNAVAILABLE, null);
				validationExceptions.add(exception);
			}
			// if(StringUtils.isBlank(action.getUrl())) {
			// CustomException exception = new
			// CustomException(ResponseMessages.ErrorMessages.CUSTOM_ERROR_ID,
			// ResponseMessages.ErrorMessages.FEATURE_URL_UNAVAILABLE,
			// ResponseMessages.UNAVAILABLE, null);
			// validationExceptions.add(exception);
			// }
		} else {
			CustomException exception = new CustomException(ResponseMessages.ErrorMessages.CUSTOM_ERROR_ID,
					ResponseMessages.ErrorMessages.FEATURE_DETAILS_UNAVAILABLE, ResponseMessages.UNAVAILABLE, null);
			validationExceptions.add(exception);
		}

		if (!validationExceptions.isEmpty()) {
			return new ResponseEntity<>(validationExceptions, HttpStatus.BAD_REQUEST);
		}
		Action savedAction = roleActionService.saveAction(action);
		if (savedAction != null) {
			List<Object> savedActions = new ArrayList<>();
			savedActions.add(savedAction);
			return new ResponseEntity<>(new CustomResponse(HttpStatus.OK.toString(),
					ResponseMessages.SuccessMessages.ACTION_ADDED, savedActions), HttpStatus.OK);
		} else {
			CustomException exception = new CustomException(ResponseMessages.ErrorMessages.CUSTOM_ERROR_ID,
					ResponseMessages.ErrorMessages.FEATURE_DETAILS_NOTSAVED, ResponseMessages.INTERNAL_ERROR, null);
			validationExceptions.add(exception);
			return new ResponseEntity<>(validationExceptions, HttpStatus.SERVICE_UNAVAILABLE);
		}
	}

	// DELETE Role API by orgId and country ID
	@RequestMapping(value = PathRoutes.RoleActionRoutes.DELETE_ROLE_POST, method = RequestMethod.POST)
	public Object deleteRole(@RequestBody Role role, @RequestHeader(value = Constants.AUTH_HEADER) String authToken,
			BindingResult result) throws JsonProcessingException {
		if (result.hasErrors()) {
			return ResponseGenerator.failureResponse(HttpStatus.UNPROCESSABLE_ENTITY.toString());
		}
		if (role != null) {
			if (StringUtils.isBlank(role.getId().toString())) {
				return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
			}
		}
		return ResponseGenerator.successResponse(roleActionService.deleteRole(role));
	}

	// GET MAPPED ACTION LIST
	@RequestMapping(value = PathRoutes.RoleActionRoutes.GET_MAP_ACTION_LIST, method = RequestMethod.GET)
	public Object getMappedActionToRole(@RequestParam(value = "role_id", required = false) Long role_id,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) throws JsonProcessingException {
		if (StringUtils.isBlank(role_id.toString())) {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
		}
		return ResponseGenerator.successResponse(roleActionService.getMappedActionToRole(role_id));
	}

	// GET UNMAPPED ACTION LIST
	@RequestMapping(value = PathRoutes.RoleActionRoutes.GET_UNMAP_ACTION_LIST, method = RequestMethod.GET)
	public Object getUnmappedActionToRole(@RequestParam(value = "role_id", required = false) Long role_id,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) throws JsonProcessingException {
		if (StringUtils.isBlank(role_id.toString())) {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
		}
		return ResponseGenerator.successResponse(roleActionService.getUnmappedActionToRole(role_id));
	}

	// Map Action to Role
	@RequestMapping(value = PathRoutes.RoleActionRoutes.MAP_ACTION_TO_ROLE, method = RequestMethod.POST)
	public Object mapActionToRole(@RequestBody RoleActionDto role,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) throws JsonProcessingException {
		if (StringUtils.isBlank(role.getRoleId().toString())) {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
		}
		return ResponseGenerator.successResponse(roleActionService.mapActionToRole(role));
	}

	// Unmap Action From Role
	@RequestMapping(value = PathRoutes.RoleActionRoutes.UNMAP_ACTION_TO_ROLE, method = RequestMethod.POST)
	public Object unmapActionToRole(@RequestBody RoleActionDto role,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) throws JsonProcessingException {
		if (StringUtils.isBlank(role.getRoleId().toString())) {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
		}
		return ResponseGenerator.successResponse(roleActionService.unmapActionFromRole(role));
	}

	// GET USER LIST By ROLE_ID AND ORG_ID
	@RequestMapping(value = PathRoutes.RoleActionRoutes.GET_USER_BY_ROLE_POST, method = RequestMethod.POST)
	public Object getUsersByRoleIdAndOrgId(@RequestBody Role role,
			@RequestHeader(value = Constants.AUTH_HEADER) String authToken) throws JsonProcessingException {
		if (StringUtils.isBlank(role.getId().toString())) {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ROLE_ID_UNAVAILABLE);
		}
		if (StringUtils.isBlank(role.getOrgId().toString())) {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ORG_ID_UNAVAILABLE);
		}
		return ResponseGenerator.successResponse(roleActionService.getUsersByRoleId(role));
	}

	// Role Creation from Org Domain
	@RequestMapping(value = PathRoutes.RoleActionRoutes.ADD_ORG_DOMAIN_ROLES, method = RequestMethod.POST)
	public Object createRolesFromDomainRoleList(@RequestBody CreateOrgResponse res) throws JsonProcessingException {

		if (StringUtils.isBlank(res.getId().toString())) {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ORG_ID_UNAVAILABLE);
		}
		if (StringUtils.isBlank(res.getOrgDomain().toString())) {
			return ResponseGenerator.failureResponse(ResponseMessages.ErrorMessages.ORG_DOMAIN_CODE_UNAVAILABLE);
		}
		return ResponseGenerator.successResponse(roleActionService.addRolesFromOrgDomain(res));
	}

}