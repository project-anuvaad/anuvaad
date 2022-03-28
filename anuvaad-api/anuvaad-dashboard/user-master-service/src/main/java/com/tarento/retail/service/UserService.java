package com.tarento.retail.service;

import java.util.List;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.tarento.retail.dto.CountryDto;
import com.tarento.retail.dto.MasterRoleDto;
import com.tarento.retail.dto.UserCountryDto;
import com.tarento.retail.dto.UserDto;
import com.tarento.retail.dto.UserMasterRoleCountryOrgDto;
import com.tarento.retail.dto.UserMasterRoleDto;
import com.tarento.retail.dto.UserRoleDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.Country;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.model.UserAuthentication;
import com.tarento.retail.model.UserDeviceToken;
import com.tarento.retail.model.UserProfile;

public interface UserService {

	/**
	 * This method receives the List of Role IDs from the controller and passes the
	 * same to DAO to fetch the List of Actions allowed and configured for the Role
	 * ID
	 * 
	 * @param roleID
	 * @return
	 */
	public List<Action> findAllActionsByRoleID(List<Integer> roleID);

	/**
	 * This method receives the User high level object. This is passed to DAO after
	 * Password encryption to save the same into Database
	 * 
	 * @param user
	 * @return
	 */
	User save(User user);

	/**
	 * This method receives the existing User object to update the details in the
	 * Database for the respective User
	 * 
	 * @param user
	 * @return
	 */
	User update(User user);

	/**
	 * This method receives the User Authentication Details on every login to save
	 * the Auth Token for the sake of further validations while accessing other
	 * features in the application
	 * 
	 * @param user
	 * @return
	 */
	UserAuthentication save(UserAuthentication user);

	/**
	 * This method supports pagination and fetches the User Profiles for the
	 * respective search criteria Search can happen based on Page Number, Number of
	 * Records, Active status of the user Keyword to search the user and also based
	 * on the Roles Assigned to the User
	 * 
	 * @param pageNumber
	 * @param numberOfRecords
	 * @param active
	 * @param keyword
	 * @param roles
	 * @return
	 */
	List<UserProfile> findAll(Integer pageNumber, Integer numberOfRecords, Boolean active, String keyword,
			List<Long> roles, String countryCode, Long orgId);

	/**
	 * This method receives the String Username to fetch the respective User record
	 * from the Database
	 * 
	 * @param username
	 * @return
	 */
	User findOne(String username);
	
	UserDto findUserRolesActions(String username); 

	/**
	 * This method receives the Long ID to fetch the respective User Profile from
	 * the database
	 * 
	 * @param id
	 * @return
	 */
	UserProfile findById(Long id, Long orgId);

	/**
	 * This method receives the list of Users IDs and passes the same to Data layer
	 * to get and fetch the User Profiles for that User ID List
	 * 
	 * @param userIdList
	 * @return
	 */
	List<UserProfile> findListOfUsers(List<Long> userIdList);

	/**
	 * This method receives the User ID and find the corresponding roles for the
	 * User ID and lists out the Roles as a response
	 * 
	 * @param userId
	 * @return
	 */
	public List<Role> findAllRolesByUser(Long userId, String orgId);

	/**
	 * This method receives the User ID and then fetches the Role ID for the same
	 * With the help of Role ID, it fetches the corresponding Actions which are
	 * allowed and mapped. As a result, this responds Action object
	 * 
	 * @param userId
	 * @return
	 */
	public Set<Action> findAllActionsByUser(Long userId, String orgId);

	/**
	 * This method carries the Phone Number and fetches the corresponding User high
	 * level object for the Phone Number
	 * 
	 * @param phoneNo
	 * @return
	 */
	User findMobile(String phoneNo);

	/**
	 * This method receives the User Role Object. For a User ID and each Role ID in
	 * the list, this method creates a mapping so that User Role Mapping is added
	 * 
	 * @param userRole
	 * @return
	 */

	Boolean mapUserToRole(UserRoleDto userRole);

	/**
	 * This method receives the User Profile which contains the secondary details of
	 * the User. Method is invoked internally on creating User
	 * 
	 * @param profile
	 * @return
	 */
	UserProfile saveUserProfile(UserProfile profile);

	/**
	 * This method receives an already existing User Profile object which is passed
	 * on to Data Layer Method ensures that the update is successful.
	 * 
	 * @param profile
	 * @return
	 */
	UserProfile updateUserProfile(UserProfile profile);

	/**
	 * This method receives the User Profile object which carries the Profile Image
	 * Updates the same and responds with the same object
	 * 
	 * @param profile
	 * @return
	 */
	UserProfile updateUserProfileImage(UserProfile profile);

	Long checkUserNameExists(String emailId, String phoneNo);

	Boolean uploadFile(MultipartFile file, long userId);

	Long getNumberOfUsers(Long role, Boolean active);

	Long getNumberOfRoles();

	List<Country> getCountryList();

	List<Country> getCountryListForUser(Long userId);

	Boolean mapUserToCountry(UserCountryDto userCountry);

	Boolean invalidateToken(String authToken);

	Boolean findUserByToken(String authToken);

	Boolean checkUserTokenExists(Long userId, String deviceToken);

	Boolean updateUserDeviceToken(Long userId, String deviceToken, Long authTokenRef);

	/**
	 * This method receives the list of Users IDs and passes the same to Data layer
	 * to get and fetch the User Device Tokens which are registered by Mobile
	 * Application
	 * 
	 * @param userIdList
	 * @return
	 */
	List<UserDeviceToken> getDeviceTokenForUsers(List<Long> userIdList);

	Long fetchAuthTokenReference(String authToken);

	Boolean hasAccess(List<Role> roles);

	Boolean createCountry(CountryDto countryDto);

	Boolean updateCountry(CountryDto countryDto);

	public List<Country> getCountryListForOrg(Long orgId);

	public Boolean checkCountryAlreadyExists(String code, Long orgId);

	Boolean deleteUserToRole(UserRoleDto userRole);

	Boolean deleteCountryForOrg(CountryDto countryDto);

	Boolean deleteUser(UserDto userDto);

	List<UserDto> getUsersByMasterRole(String roleCode, Long orgId);

	Boolean mapUserMasterRoleCountryOrg(UserMasterRoleCountryOrgDto userMasterRoleCountryOrgDto);

	List<MasterRoleDto> getMasterRoleByOrgDomainId(Long orgDomainId);
}