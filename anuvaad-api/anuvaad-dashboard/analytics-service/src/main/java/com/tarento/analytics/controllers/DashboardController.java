package com.tarento.analytics.controllers;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.constant.ErrorCode;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.RequestDto;
import com.tarento.analytics.dto.UserDto;
import com.tarento.analytics.exception.AINException;
import com.tarento.analytics.org.service.ClientServiceFactory;
import com.tarento.analytics.producer.AnalyticsProducer;
import com.tarento.analytics.service.AmazonS3ClientService;
import com.tarento.analytics.service.MetadataService;
import com.tarento.analytics.utils.PathRoutes;
import com.tarento.analytics.utils.ResponseGenerator;

@RestController
@RequestMapping(PathRoutes.DashboardApi.DASHBOARD_ROOT_PATH)
public class DashboardController {

	public static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

	@Autowired
	private MetadataService metadataService;

	@Autowired
	private ClientServiceFactory clientServiceFactory;

	@Autowired
	private AmazonS3ClientService amazonS3ClientService;

	@Autowired
	private AnalyticsProducer analyticsProducer;

	private static final String MESSAGE = "message";

	@GetMapping(value = PathRoutes.DashboardApi.TEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
	public String getTest() throws JsonProcessingException {
		return ResponseGenerator.successResponse("success");

	}

	@PostMapping(value = "/files")
	public Map<String, String> uploadFile(@RequestPart(value = "file") MultipartFile file) {
		Map<String, String> response = new HashMap<>();
		try {
			String imgUrl = this.amazonS3ClientService.uploadFileToS3Bucket(file, true);
			response.put(MESSAGE,
					"file [" + file.getOriginalFilename() + "] uploading request submitted successfully.");
			response.put("url", imgUrl);
		} catch (Exception e) {
			logger.error("S3 file upload : {} ", e.getMessage());
			response.put(MESSAGE, e.getMessage());
			response.put("url", "");
		}

		return response;
	}

	@DeleteMapping("/files")
	public Map<String, String> deleteFile(@RequestParam("file_name") String fileName) {
		Map<String, String> response = new HashMap<>();
		try {
			this.amazonS3ClientService.deleteFileFromS3Bucket(fileName);
			response.put(MESSAGE, "file [" + fileName + "] removing request submitted successfully.");
		} catch (Exception e) {
			logger.error("S3 file upload : {} ", e.getMessage());
			response.put(MESSAGE, e.getMessage());

		}
		return response;

	}

	@GetMapping(value = PathRoutes.DashboardApi.GET_DASHBOARD_CONFIG + "/{profileName}" + "/{dashboardId}")
	public String getDashboardConfiguration(@PathVariable String profileName, @PathVariable String dashboardId,
			@RequestParam(value = "catagory", required = false) String catagory,
			@RequestHeader(value = "x-user-info", required = false) String xUserInfo) throws AINException, IOException {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		UserDto user = gson.fromJson(xUserInfo, UserDto.class);
		/*
		 * user = new UserDto(); RoleDto role = new RoleDto(); role.setId(2068l);
		 * List<RoleDto> roles = new ArrayList<>(); roles.add(role);
		 * user.setRoles(roles);
		 */
		logger.info("user {} ", xUserInfo);
		return ResponseGenerator.successResponse(
				metadataService.getDashboardConfiguration(profileName, dashboardId, catagory, user.getRoles()));
	}

	@GetMapping(value = PathRoutes.DashboardApi.GET_DASHBOARDS_FOR_PROFILE + "/{profileName}")
	public String getDashboardsForProfile(@PathVariable String profileName,
			@RequestHeader(value = "x-user-info", required = false) String xUserInfo) throws AINException, IOException {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		UserDto user = gson.fromJson(xUserInfo, UserDto.class);
		return ResponseGenerator.successResponse(metadataService.getDashboardsForProfile(profileName, user.getRoles()));
	}

	@PostMapping(value = PathRoutes.DashboardApi.GET_CHART_V2 + "/{profileName}")
	public String getVisualizationChartV2(@PathVariable String profileName, @RequestBody RequestDto requestDto,
			@RequestHeader(value = "x-user-info", required = false) String xUserInfo,
			@RequestHeader(value = "Authorization", required = false) String authorization, ServletWebRequest request)
			throws IOException {
		Long requestTime = new Date().getTime();
		logger.info("Request Detail: {} ", requestDto);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		UserDto user = gson.fromJson(xUserInfo, UserDto.class);
		/*
		 * Gson gson = new GsonBuilder().setPrettyPrinting().create(); UserDto user =
		 * new UserDto(); RoleDto role = new RoleDto(); role.setId(2068l); List<RoleDto>
		 * roles = new ArrayList<>(); roles.add(role); user.setRoles(roles);
		 * logger.info("user"+xUserInfo);
		 */

		// Getting the request information only from the Full Request
		AggregateRequestDto requestInfo = requestDto.getAggregationRequestDto();
		Map<String, Object> headers = requestDto.getHeaders();
		// requestInfo.getFilters().putAll(headers);
		String response = "";
		try {
			if (headers.isEmpty()) {
				logger.error("Please provide header details");
				throw new AINException(ErrorCode.ERR320, "header is missing");
			}
			if (headers.get("tenantId") == null) {
				logger.error("Please provide tenant ID details");
				throw new AINException(ErrorCode.ERR320, "tenant is missing");

			}
			if (requestDto.getAggregationRequestDto() == null) {
				logger.error("Please provide requested Visualization Details");
				throw new AINException(ErrorCode.ERR320, "Visualization Request is missing");
			}
			/*
			 * if(requestDto.getAggregationRequestDto().getRequestId() == null) {
			 * logger.error("Please provide Request ID"); throw new
			 * AINException(ErrorCode.ERR320,
			 * "Request ID is missing. Insights will not work"); }
			 */

			// To be removed once the development is complete
			if (StringUtils.isBlank(requestInfo.getModuleLevel())) {
				requestInfo.setModuleLevel(Constants.Modules.HOME_REVENUE);
			}
			Object responseData = clientServiceFactory.get(profileName, requestInfo.getVisualizationCode())
					.getAggregatedData(profileName, requestInfo, user.getRoles());
			// clientService.getAggregatedData(requestInfo, user.getRoles());
			response = ResponseGenerator.successResponse(responseData);
			Long responseTime = new Date().getTime();
			pushRequestsToLoggers(requestDto, user, requestTime, responseTime);
		} catch (AINException e) {
			logger.error("error while executing api getVisualizationChart");
			response = ResponseGenerator.failureResponse(e.getErrorCode(), e.getMessage());
		} catch (Exception e) {
			logger.error("error while executing api getVisualizationChart {} ", e.getMessage());
			// could be bad request or internal server error
			// response =
			// ResponseGenerator.failureResponse(HttpStatus.BAD_REQUEST.toString(),"Bad
			// request");
		}
		return response;
	}

	@PostMapping(value = PathRoutes.DashboardApi.GET_REPORT)
	public String getReport(@PathVariable String profileName, @RequestBody RequestDto requestDto,
			@RequestHeader(value = "x-user-info", required = false) String xUserInfo,
			@RequestHeader(value = "Authorization", required = false) String authorization, ServletWebRequest request)
			throws IOException {

		/*
		 * logger.info("Request Detail:" + requestDto); Gson gson = new
		 * GsonBuilder().setPrettyPrinting().create(); UserDto user =
		 * gson.fromJson(xUserInfo, UserDto.class);
		 */
		UserDto user = new UserDto();
		logger.info("user {} ", xUserInfo);

		// Getting the request information only from the Full Request
		AggregateRequestDto requestInfo = requestDto.getAggregationRequestDto();
		Map<String, Object> headers = requestDto.getHeaders();
		// requestInfo.getFilters().putAll(headers);
		String response = "";
		try {
			if (headers.isEmpty()) {
				logger.error("Please provide header details");
				throw new AINException(ErrorCode.ERR320, "header is missing");
			}
			if (headers.get("tenantId") == null) {
				logger.error("Please provide tenant ID details");
				throw new AINException(ErrorCode.ERR320, "tenant is missing");

			}
			if (requestDto.getAggregationRequestDto() == null) {
				logger.error("Please provide requested Visualization Details");
				throw new AINException(ErrorCode.ERR320, "Visualization Request is missing");
			}

			// To be removed once the development is complete
			if (StringUtils.isBlank(requestInfo.getModuleLevel())) {
				requestInfo.setModuleLevel(Constants.Modules.HOME_REVENUE);
			}
			Object responseData = clientServiceFactory.get(profileName, requestInfo.getVisualizationCode())
					.getAggregatedData(profileName, requestInfo, user.getRoles());
			// clientService.getAggregatedData(requestInfo, user.getRoles());
			response = ResponseGenerator.successResponse(responseData);
		} catch (AINException e) {
			logger.error("error while executing api getVisualizationChart");
			response = ResponseGenerator.failureResponse(e.getErrorCode(), e.getErrorMessage());
		} catch (Exception e) {
			logger.error("error while executing api getVisualizationChart {} ", e.getMessage());
			// could be bad request or internal server error
			// response =
			// ResponseGenerator.failureResponse(HttpStatus.BAD_REQUEST.toString(),"Bad
			// request");
		}
		return response;
	}

	private void pushRequestsToLoggers(RequestDto requestDto, UserDto user, Long requestTime, Long responseTime) {
		new Thread(() -> {
			Map<String, Object> requestMap = new HashMap<>();
			requestMap.put("request", requestDto);
			requestMap.put("user", user);
			requestMap.put("timeOfRequest", requestTime);
			requestMap.put("timeOfResponse", responseTime);
			analyticsProducer.pushToPipeline(requestMap, "userrequestdata", "userrequestdata");
		}).start();
	}

}
