package com.tarento.analytics.service;

import java.io.IOException;
import java.util.List;

import com.tarento.analytics.dto.RoleDto;
import com.tarento.analytics.exception.AINException;

public interface MetadataService {

	public Object getDashboardConfiguration(String profileName, String dashboardId, String catagory, List<RoleDto> roleIds) throws AINException, IOException;
	public Object getDashboardsForProfile(String profileName, List<RoleDto> roleIds) throws AINException, IOException; 

}
