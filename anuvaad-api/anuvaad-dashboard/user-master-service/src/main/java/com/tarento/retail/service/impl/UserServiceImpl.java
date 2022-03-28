package com.tarento.retail.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mysql.fabric.xmlrpc.base.Array;
import com.tarento.retail.dao.RoleDao;
import com.tarento.retail.dao.UserDao;
import com.tarento.retail.dto.CountryDto;
import com.tarento.retail.dto.MasterRoleDto;
import com.tarento.retail.dto.UserCountryDto;
import com.tarento.retail.dto.UserDto;
import com.tarento.retail.dto.UserMasterRoleCountryOrgDto;
import com.tarento.retail.dto.UserRoleDto;
import com.tarento.retail.model.Action;
import com.tarento.retail.model.Country;
import com.tarento.retail.model.Role;
import com.tarento.retail.model.User;
import com.tarento.retail.model.UserAuthentication;
import com.tarento.retail.model.UserDeviceToken;
import com.tarento.retail.model.UserProfile;
import com.tarento.retail.model.mapper.SqlDataMapper.UserProfileMapper;
import com.tarento.retail.model.mapper.SqlDataMapper.UserRoleActionMapper;
import com.tarento.retail.model.mapper.SqlDataMapper.UserRoleMapper;
import com.tarento.retail.service.UserService;
import com.tarento.retail.util.Constants;

@Service(value = Constants.USER_SERVICE)

public class UserServiceImpl implements UserDetailsService, UserService {
	public static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
	public static ConcurrentHashMap<String, UserDto> userRoleActionMap = new ConcurrentHashMap<>(); 

	@Autowired
	private UserDao userDao;

	@Autowired
	RoleDao roleDao;

	@Autowired
	private BCryptPasswordEncoder bcryptEncoder;

	public List<Action> findAllActionsByRoleID(List<Integer> roleID) {
		List<Action> actions = new ArrayList<Action>();
		List<Action> completeActions = new ArrayList<Action>();
		for (int roleid : roleID) {
			actions = userDao.findAllActionsByRoleID(roleid);
			completeActions.addAll(actions);
		}
		return completeActions;
	}

	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userDao.findOnlyUser(username);
		if (user == null) {
			throw new UsernameNotFoundException("Invalid username or password.");
		}
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
				getAuthority());
	}

	private List<SimpleGrantedAuthority> getAuthority() {
		return Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN"));
	}

	public List<UserProfile> findAll(Integer pageNumber, Integer numberOfRecords, Boolean active, String keyword,
			List<Long> roles, String countryCode, Long orgId) {
		List<UserProfile> profileList = new ArrayList<>();

		Integer startIndex = 0;
		if (pageNumber != null && pageNumber >= 0) {
			startIndex = ((pageNumber == 0) ? (pageNumber) : (pageNumber - 1) * numberOfRecords);
		}
		UserProfileMapper mapper = userDao.findAll(active, keyword, roles, countryCode, orgId);
		if (mapper != null) {
			Iterator<Entry<Long, UserProfile>> userItr = mapper.userMap.entrySet().iterator();
			while (userItr.hasNext()) {
				Entry<Long, UserProfile> entry = userItr.next();
				if (null != entry.getValue()) {
					profileList.add(entry.getValue());
				}
			}
		}
		return applyPagignation(startIndex, numberOfRecords, profileList);
	}

	private List<UserProfile> applyPagignation(Integer startIndex, Integer numberOfRecords,
			List<UserProfile> profileList) {
		List<UserProfile> finalProfileList = new ArrayList<>();
		if (numberOfRecords == null) {
			numberOfRecords = profileList.size();
		}
		for (int i = startIndex; i < (startIndex + numberOfRecords) && i < profileList.size(); i++) {
			finalProfileList.add(profileList.get(i));
		}
		return finalProfileList;
	}

	@Override
	public User findOne(String username) {
		return userDao.findByUsername(username);
	}

	@Override
	public UserProfile findById(Long id, Long orgId) {
		List<UserProfile> profileList = new ArrayList<>();
		UserProfileMapper mapper = userDao.findOne(id, orgId);
		if (mapper != null) {
			Iterator<Entry<Long, UserProfile>> userItr = mapper.userMap.entrySet().iterator();
			while (userItr.hasNext()) {
				Entry<Long, UserProfile> entry = userItr.next();
				if (null != entry.getValue()) {
					profileList.add(entry.getValue());
				}
			}

			for (UserProfile profile : profileList) {
				List<Role> roleList = mapper.userRoleMap.get(profile.getId());
				if (roleList != null) {
					profile.setRoles(roleList);
				}
			}
		}
		return (profileList != null && !profileList.isEmpty()) ? profileList.get(0) : null;
	}

	@Override
	public User save(User user) {
		String encryptedPassword = bcryptEncoder.encode(user.getPassword());
		user.setPassword(encryptedPassword);
		return userDao.save(user);
	}

	@Override
	public UserAuthentication save(UserAuthentication user) {
		return userDao.save(user);
	}

	@Override
	public User update(User user) {
		return userDao.update(user);
	}

	@Override
	public List<Role> findAllRolesByUser(Long userId, String orgId) {
		UserRoleMapper mapper = userDao.findAllRolesByUser(userId, orgId);
		List<Role> roleList = new ArrayList<>();
		Iterator<Entry<Long, Role>> itr = mapper.roleMap.entrySet().iterator();
		while (itr.hasNext()) {
			roleList.add(itr.next().getValue());
		}
		return roleList;
	}

	@Override
	public Set<Action> findAllActionsByUser(Long userId, String orgId) {
		Set<Action> actions = new HashSet<Action>();
		UserRoleMapper mapper = userDao.findAllRolesByUser(userId, orgId);
		List<Role> roleList = new ArrayList<>();
		Iterator<Entry<Long, Role>> itr = mapper.roleMap.entrySet().iterator();
		while (itr.hasNext()) {
			roleList.add(itr.next().getValue());
		}
		for (Role role : roleList) {
			actions.addAll(roleDao.findAllActionsByRole(role.getId()));
		}

		return actions;
	}

	@Override
	public User findMobile(String phoneNo) {
		return userDao.findMobile(phoneNo);
	}

	@Override
	public Boolean mapUserToRole(UserRoleDto userRole) {
		return userDao.mapUserToRole(userRole);
	}

	@Override
	public UserProfile saveUserProfile(UserProfile profile) {
		User newUser = new User();
		newUser.setUsername(profile.getUsername());
		newUser.setEmailId(profile.getEmailId());
		newUser.setPassword(profile.getPassword());
		newUser.setPhoneNo(profile.getPhoneNo());
		newUser.setIsActive(profile.getIsActive());
		newUser.setIsDeleted(profile.getIsDeleted());
		newUser.setOrgId(profile.getOrgId());
		newUser.setCountryCode(profile.getCountryCode());
		newUser.setTimeZone(profile.getTimeZone());
		newUser.setAvatarUrl(profile.getAvatarUrl());
		User savedUser = save(newUser);
		profile.setId(savedUser.getId());
		return userDao.saveUserProfile(profile);
	}

	@Override
	public UserProfile updateUserProfileImage(UserProfile profile) {
		return userDao.updateUserProfileImage(profile);
	}

	@Override
	public Long checkUserNameExists(String emailId, String phoneNo) {
		Long userId = userDao.checkUserNameExists(emailId, phoneNo);
		return userId;
	}

	@Override
	public Boolean uploadFile(MultipartFile file, long userId) {
		try {

			// Get the file and save it somewhere
			if (!new File(Constants.UPLOADED_FOLDER).exists()) {
				if (new File(Constants.UPLOADED_FOLDER).mkdir()) {
					LOGGER.info("Directory is created!");
				} else {
					LOGGER.error("Failed to create directory!");
				}
			} else {
				LOGGER.info("Folder exist");
			}

			UserProfile userProfile = new UserProfile();
			byte[] bytes = file.getBytes();
			Path path = Paths.get(Constants.UPLOADED_FOLDER + userId + "_" + file.getOriginalFilename());
			LOGGER.info("Path before write: " + path);
			Path path1 = Files.write(path, bytes);
			LOGGER.info("Path after write : " + path1);
			if (path1 != null) {
				List<UserProfile> profileList = new ArrayList<>();
				UserProfileMapper userProfileMapper = userDao.findOneUser(userId);

				if (userProfileMapper != null) {
					Iterator<Entry<Long, UserProfile>> userItr = userProfileMapper.userMap.entrySet().iterator();
					while (userItr.hasNext()) {
						Entry<Long, UserProfile> entry = userItr.next();
						if (null != entry.getValue()) {
							profileList.add(entry.getValue());
						}
					}

					for (UserProfile profile : profileList) {
						List<Role> roleList = userProfileMapper.userRoleMap.get(profile.getId());
						if (roleList != null) {
							profile.setRoles(roleList);
						}
					}
				}
				userProfile = (profileList != null && !profileList.isEmpty()) ? profileList.get(0) : null;

				userProfile.setAvatarUrl(userId + "_" + file.getOriginalFilename());
				UserProfile profile = this.updateUserProfileImage(userProfile);
				if (profile.getAvatarUrl() == userProfile.getAvatarUrl())
					return true;
				else
					return false;
			} else
				return false;

		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public List<UserProfile> findListOfUsers(List<Long> userIdList) {
		List<UserProfile> profileList = new ArrayList<>();
		UserProfileMapper mapper = userDao.findListOfUsers(userIdList);
		if (mapper != null) {
			Iterator<Entry<Long, UserProfile>> userItr = mapper.userMap.entrySet().iterator();
			while (userItr.hasNext()) {
				Entry<Long, UserProfile> entry = userItr.next();
				if (null != entry.getValue()) {
					profileList.add(entry.getValue());
				}
			}

			for (UserProfile profile : profileList) {
				List<Role> roleList = mapper.userRoleMap.get(profile.getId());
				if (roleList != null) {
					profile.setRoles(roleList);
				}
			}
		}
		return profileList;
	}

	@Override
	public UserProfile updateUserProfile(UserProfile profile) {
		User newUser = new User();
		newUser.setId(profile.getId());
		newUser.setUsername(profile.getUsername());
		newUser.setEmailId(profile.getEmailId());
		newUser.setPassword(profile.getPassword());
		newUser.setPhoneNo(profile.getPhoneNo());
		newUser.setIsActive(profile.getIsActive());
		newUser.setIsDeleted(profile.getIsDeleted());
		newUser.setTimeZone(profile.getTimeZone());
		newUser.setAvatarUrl(profile.getAvatarUrl());
		update(newUser);
		return userDao.updateUserProfile(profile);
	}

	@Override
	public Long getNumberOfUsers(Long role, Boolean active) {
		return userDao.getNumberOfUsers(role, active);
	}

	@Override
	public Long getNumberOfRoles() {
		return userDao.getNumberOfRoles();
	}

	@Override
	public List<Country> getCountryList() {
		return userDao.getCountryList();
	}

	@Override
	public List<Country> getCountryListForUser(Long userId) {
		return userDao.getCountryListForUser(userId);
	}

	@Override
	public List<Country> getCountryListForOrg(Long orgId) {
		return userDao.getCountryListForOrg(orgId);
	}

	@Override
	public Boolean mapUserToCountry(UserCountryDto userCountry) {
		return userDao.mapUserToCountry(userCountry);
	}

	@Override
	public Boolean invalidateToken(String authToken) {
		return userDao.invalidateToken(authToken);
	}

	@Override
	public Boolean findUserByToken(String authToken) {
		return userDao.findUserByToken(authToken);
	}

	@Override
	public Boolean checkUserTokenExists(Long userId, String deviceToken) {
		return userDao.checkUserTokenExists(userId, deviceToken);
	}

	@Override
	public Boolean updateUserDeviceToken(Long userId, String deviceToken, Long authTokenRef) {
		return userDao.insertUserDeviceToken(userId, deviceToken, authTokenRef);
	}

	@Override
	public List<UserDeviceToken> getDeviceTokenForUsers(List<Long> userIdList) {
		return userDao.getDeviceTokenForUserList(userIdList);
	}

	@Override
	public Long fetchAuthTokenReference(String authToken) {
		return userDao.fetchAuthTokenReference(authToken);
	}

	@Override
	public Boolean hasAccess(List<Role> roles) {
		List<Long> roleIds = new ArrayList<>();
		for (Role role : roles) {
			roleIds.add(role.getId());
		}
		List<Action> userActions = userDao.findAllActionsByRoleIDs(roleIds);
		return false;
	}

	@Override
	public Boolean createCountry(CountryDto countryDto) {
		return userDao.saveCountry(countryDto);
	}

	@Override
	public Boolean updateCountry(CountryDto countryDto) {
		return userDao.updateCountry(countryDto);
	}

	@Override
	public Boolean checkCountryAlreadyExists(String code, Long orgId) {
		return userDao.checkCountryExistsWithCode(code, orgId);
	}

	@Override
	public Boolean deleteUserToRole(UserRoleDto userRole) {
		return userDao.deleteUserToRole(userRole);
	}

	@Override
	public Boolean deleteCountryForOrg(CountryDto countryDto) {
		System.out.println("ID: " + countryDto.getId() + " OrgId " + countryDto.getOrgId());
		return userDao.deleteCountryForOrg(countryDto);
	}

	@Override
	public Boolean deleteUser(UserDto userDto) {
		return userDao.deleteUser(userDto);
	}

	@Override
	public List<UserDto> getUsersByMasterRole(String roleCode, Long orgId) {
		return userDao.getUsersByMasterRole(roleCode, orgId);
	}

	@Override
	public Boolean mapUserMasterRoleCountryOrg(UserMasterRoleCountryOrgDto userMasterRoleCountryOrgDto) {
		return userDao.mapUserMasterRoleCountryOrg(userMasterRoleCountryOrgDto);
	}

	@Override
	public List<MasterRoleDto> getMasterRoleByOrgDomainId(Long orgDomainId) {
		return userDao.getMasterRoleByOrgDomainId(orgDomainId);
	}

	@Override
	public UserDto findUserRolesActions(String username) {
		if(userRoleActionMap.contains(username)) {  
			return userRoleActionMap.get(username); 
		} else { 
			UserRoleActionMapper mapper = userDao.findUserRolesActions(username);
			UserDto userDto = getUserFromMapper(mapper);
			userRoleActionMap.put(userDto.getUserName(), userDto); 
			return userDto;
		}
		 
	}
	
	private UserDto getUserFromMapper(UserRoleActionMapper mapper) { 
		UserDto dto = new UserDto(); 
		Iterator<Entry<Long, UserDto>> itr = mapper.userMap.entrySet().iterator();
		List<Role> roleList = new ArrayList<>(); 
		Set<Action> actionSet = new HashSet<Action>(); 
		while(itr.hasNext()) { 
			Entry<Long, UserDto> userEntry = itr.next(); 
			Long userId = userEntry.getKey(); 
			dto = userEntry.getValue(); 
			Map<Long, Role> roleMap = mapper.userRoleMap.get(userId);
			if(roleMap != null) { 
				Iterator<Entry<Long, Role>> roleItr = roleMap.entrySet().iterator(); 
				while(roleItr.hasNext()) { 
					Entry<Long, Role> roleEntry = roleItr.next(); 
					Long roleId = roleEntry.getKey(); 
					Role role = roleEntry.getValue();
					roleList.add(role); 
					Map<Long, Action> roleActionMap = mapper.roleActionMap.get(roleId); 
					if(roleActionMap != null) { 
						Iterator<Entry<Long, Action>> actionItr = roleActionMap.entrySet().iterator();
						while(actionItr.hasNext()) { 
							Entry<Long, Action> actionEntry = actionItr.next();
							Action action = actionEntry.getValue(); 
							actionSet.add(action);
						}
					}
				}
			}
		}
		dto.setRoles(roleList);
		dto.setActions(actionSet);
		return dto; 
	}
}
