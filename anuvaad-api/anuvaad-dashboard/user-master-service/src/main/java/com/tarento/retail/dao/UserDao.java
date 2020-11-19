package com.tarento.retail.dao;

import java.util.List;

import com.tarento.retail.dto.CountryDto;
import com.tarento.retail.dto.MasterRoleDto;
import com.tarento.retail.dto.UserCountryDto;
import com.tarento.retail.dto.UserDto;
import com.tarento.retail.dto.UserMasterRoleCountryOrgDto;
import com.tarento.retail.dto.UserRoleDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.Country;
import com.tarento.retail.model.User;
import com.tarento.retail.model.UserAuthentication;
import com.tarento.retail.model.UserDeviceToken;
import com.tarento.retail.model.UserProfile;
import com.tarento.retail.model.mapper.SqlDataMapper.UserProfileMapper;
import com.tarento.retail.model.mapper.SqlDataMapper.UserRoleActionMapper;
import com.tarento.retail.model.mapper.SqlDataMapper.UserRoleMapper;

public interface UserDao {

	/**
	 * This method is used to fetch the User high level Object from the database
	 * based on the username parameter which is being passed
	 * 
	 * @param username
	 * @return
	 */
	public User findByUsername(String username);
	
	public User findOnlyUser(String username);

	/**
	 * This method is used to fetch the UserProfile Detailed object from the
	 * database based on the User ID which is being passed
	 * 
	 * @param id
	 * @return
	 */
	public UserProfileMapper findOne(Long id, Long orgId);

	/**
	 * This method is used to fetch the UserProfile Detailed object from the
	 * database based on the User ID which is being passed
	 * 
	 * @param id
	 * @return
	 */
	public UserProfileMapper findOneUser(Long id);

	public User findMobile(String phoneNo);

	/**
	 * This method receives the User ID and the List of Roles which are associated
	 * with the user Save the same to database for further Role Based Access
	 * 
	 * @param userRole
	 * @return
	 */
	public Boolean mapUserToRole(UserRoleDto userRole);

	/**
	 * The detailed information about the user profile is received and the same gets
	 * stored into the database against the User ID which is put into the User
	 * table.
	 * 
	 * @param profile
	 * @return
	 */
	public UserProfile saveUserProfile(UserProfile profile);

	/**
	 * This method receives the update on the Profile of the User and updates it
	 * against the data which is already available in the database
	 * 
	 * @param profile
	 * @return
	 */
	public UserProfile updateUserProfile(UserProfile profile);

	/**
	 * This method receives the User Profile Object with updated Image URL and
	 * updates the same against the User ID
	 * 
	 * @param profile
	 * @return
	 */
	public UserProfile updateUserProfileImage(UserProfile profile);

	/**
	 * While adding a new user to the system, this method is called with Email ID
	 * and Phone Number to verify whether there already exists a user with same
	 * username as that of the Email ID and Phone Number This method responds with a
	 * long value of the User ID if exists and returns 0 in the case of negative
	 * scenario
	 * 
	 * @param emailId
	 * @param phoneNo
	 * @return
	 */
	public Long checkUserNameExists(String emailId, String phoneNo);

	/**
	 * On receiving the Role ID, this method fetches the Actions which are mapped to
	 * that role
	 * 
	 * @param roleID
	 * @return
	 */
	public List<Action> findAllActionsByRoleID(Integer roleID);

	/**
	 * In order to show the count of Users available in the system, this method is
	 * invoked The method responds with the count of users available in the system
	 * 
	 * @return
	 */
	public Long getNumberOfUsers(Long role, Boolean active);

	/**
	 * In order to show the count of Roles available in the system, this method is
	 * invoked The method responds with the count of roles available in the system
	 * 
	 * @return
	 */
	public Long getNumberOfRoles();

	/**
	 * This is method used to fetch the Country List from the database. The list of
	 * countries are sent as a response
	 * 
	 * @return
	 */
	public List<Country> getCountryList();

	/**
	 * This method receives the User ID and fetches the List of Country Objects for
	 * the User ID from the mapping table on the Database
	 * 
	 * @param userId
	 * @return
	 */
	public List<Country> getCountryListForUser(Long userId);

	/**
	 * This method receives the List Country Codes and User ID to map the same
	 * against each other On mapping successfully, the boolean response is sent as a
	 * part of acknowledgement
	 * 
	 * @param userCountry
	 * @return
	 */
	public Boolean mapUserToCountry(UserCountryDto userCountry);

	/**
	 * This method receives the JWT Auth Token and invalidates the token from the
	 * Jwt Token Store and also removes the entry of the Token from the Database
	 * 
	 * @param authToken
	 * @return
	 */
	public Boolean invalidateToken(String authToken);

	/**
	 * This method receives the Auth Token and finds out whether there is an active
	 * user for that Authentication Token Auth Token in this method is the JWT Token
	 * 
	 * @param authToken
	 * @return
	 */
	public Boolean findUserByToken(String authToken);

	/**
	 * This method receives the Auth Token of the FCM and verifies whether the token
	 * is already registered against any User ID or not.
	 * 
	 * @param userId
	 * @param deviceToken
	 * @return
	 */
	public Boolean checkUserTokenExists(Long userId, String deviceToken);

	/**
	 * This method receives the Device Token and the User ID and updates it against
	 * the record which is already available in the system database
	 * 
	 * @param userId
	 * @param deviceToken
	 * @return
	 */
	public Boolean updateUserDeviceToken(Long userId, String deviceToken);

	/**
	 * This method receives the Device Token and the User ID in the object and
	 * inserts the same in the Database for further processing
	 * 
	 * @param userId
	 * @param deviceToken
	 * @return
	 */
	public Boolean insertUserDeviceToken(Long userId, String deviceToken, Long authTokenRef);

	/**
	 * This method receives the List of User IDs and fetches the FCM Device Token
	 * IDs for the User IDs and wraps it in the object and sends the list of it
	 * 
	 * @param userIdList
	 * @return
	 */
	public List<UserDeviceToken> getDeviceTokenForUserList(List<Long> userIdList);

	public UserAuthentication findOneUserAuthentication(Long id);

	public UserProfileMapper findListOfUsers(List<Long> userIdList);

	public User save(User user);

	public UserAuthentication save(UserAuthentication user);

	public User update(User user);

	public UserProfileMapper findAll(Boolean active, String keyword, List<Long> roles, String countryCode, Long orgId);

	public UserRoleMapper findAllRolesByUser(Long userId, String orgId);

	public Long fetchAuthTokenReference(String authToken);

	public List<Action> findAllActionsByRoleIDs(List<Long> roles);

	public Boolean saveCountry(CountryDto country);

	public Boolean updateCountry(CountryDto country);

	public List<Country> getCountryListForOrg(Long orgId);

	public Boolean checkCountryExistsWithCode(String code, Long orgId);

	public Boolean deleteUserToRole(UserRoleDto userRole);

	public Boolean deleteCountryForOrg(CountryDto country);

	public Boolean deleteUser(UserDto user);


	Boolean mapUserMasterRoleCountryOrg(UserMasterRoleCountryOrgDto userMasterRoleCountryOrg);

	List<MasterRoleDto> getMasterRoleByOrgDomainId(Long id);
	
	UserRoleActionMapper findUserRolesActions(String username); 

	public List<UserDto> getUsersByMasterRole(String roleCode, Long orgId);

}
