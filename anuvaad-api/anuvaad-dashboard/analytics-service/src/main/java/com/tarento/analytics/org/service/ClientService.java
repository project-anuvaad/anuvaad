package com.tarento.analytics.org.service;

import java.io.IOException;
import java.util.List;

import com.tarento.analytics.dto.*;
import com.tarento.analytics.exception.AINException;

public interface ClientService {

	public AggregateDto getAggregatedData(String profileName, AggregateRequestDto req, List<RoleDto> roles) throws AINException, IOException;
	public List<DashboardHeaderDto> getHeaderData(CummulativeDataRequestDto requestDto, List<RoleDto> roles) throws AINException;

}
