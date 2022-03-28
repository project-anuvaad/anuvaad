package com.tarento.retail.util;

public interface ResponseMessages {

	final String UNAVAILABLE = "UNAVAILABLE";
	final String INVALID = "INVALID";
	final String ALREADY_EXISITS = "ALREADYEXISTS";
	final String INTERNAL_ERROR = "INTERNALERROR";

	public interface ErrorMessages {
		final Integer CUSTOM_ERROR_ID = 9999;
		final String ROLE_NAME_UNAVAILABLE = "Role Name is mandatory. Please add and try again";
		final String ROLE_ID_UNAVAILABLE = "Role ID is mandatory. Please add and try again";
		final String ROLE_DETAILS_UNAVAILABLE = "Role Details are not available. Please check";
		final String ROLE_DETAILS_NOTSAVED = "Unable to save the Role Details. Please try again later";
		final String USER_ROLE_MAPPING_NOTSAVED = "Unable to save the User Role mapping";
		final String USER_ID_UNAVAILABLE = "User ID is mandatory. Please add and try again";
		final String ROLE_ID_INVALID = "Role ID cannot be Zero. Please check and try again!";
		final String FEATURE_NAME_UNAVAILABLE = "Feature Name is mandatory. Please add and try again";
		final String FEATURE_CODE_UNAVAILABLE = "Feature Code is mandatory. Please add and try again";
		final String FEATURE_URL_UNAVAILABLE = "Feature URL is mandatory. Please add and try again";
		final String FEATURE_DETAILS_UNAVAILABLE = "Feature Details are not available. Please check";
		final String FEATURE_DETAILS_NOTSAVED = "Unable to save the Feature Details. Please try again later";
		final String USER_PROFILE_UNAVAILABLE = "User Profile Details are not found. Please check";
		final String USER_NAME_ALREADY_EXISTS = "UserName already exists. Please try with a different input";
		final String USER_PROFILE_ID_MANDATORY = "User Profile ID is mandatory. Please check";
		final String USER_PROFILE_SAVE_FAILURE = "Could not save the User Profile. Please check";
		final String EMAIL_PHONE_ALREADY_EXISTS = "This email or phone number already exists. Please reenter and check ";
		final String EMAIL_MANDATORY = "Email Address is mandatory. Please enter and try again";
		final String COUNTRY_ID_UNAVAILABLE = "Country ID is mandatory. Please add and try again";
		final String COUNTRY_DETAILS_UNAVAILABLE = "Country Details are not available. Please check";
		final String LOGOUT_FAILED = "User Log Out action has failed. Please try again";
		final String UNAUTHORIZED_PERMISSION = "User does not have permision to create User. Please Check";
		final String UNAUTHORIZED_ROLE_MAPPING_PERMISSION = "User does not have role mapping permisoin to  User. Please Check";
		final String ORG_DOMAIN_CODE_UNAVAILABLE = "ORG Domain code is mandatory. Please add and try again";
		final String ORG_ID_UNAVAILABLE = "ORG ID is mandatory. Please add and try again";
	}

	public interface SuccessMessages {
		final String ROLE_CREATED = "Role has been added successfully!";
		final String ROLE_UPDATED = "Role has been updated successfully!";
		final String USER_ROLE_MAPPED = "User has been mapped to Role";
		final String REMOVE_USER_ROLE_MAPPED = "User has been removed to Role";
		final String USER_COUNTRY_MAPPED = "User has been mapped to Country";
		final String ACTION_ADDED = "Feature has been added successfully!";
		final String LOGOUT_SUCCESS = "User Logged out successfully";
	}

}
