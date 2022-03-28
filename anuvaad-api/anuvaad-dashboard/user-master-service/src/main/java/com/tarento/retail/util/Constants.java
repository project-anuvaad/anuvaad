package com.tarento.retail.util;

public class Constants {

	/**
	 * Header and Request Parameters
	 */
	public static final long ACCESS_TOKEN_VALIDITY_SECONDS = 30 * 24 * 60 * 60;
	public static final String SIGNING_KEY = "devglan123r";
	public static final String JWT_ISSUER = "http://devglan.com";
	public static final String JWT_GRANTED_AUTHORITY = "ROLE_ADMIN";
	public static final String TOKEN_PREFIX = "Bearer ";
	public static final String HEADER_STRING = "Authorization";
	public static final String HEADER_APPLICATION_JSON = "application/json";
	public static final String ERROR_CODE = "errorCode";
	public static final String ERROR_FIELD = "errorField";
	public static final String ERROR_MESSAGE_CODE = "errorMessageCode";
	public static final String ERROR_MESSAGE_VALUE = "common.error.";
	public static final String SUCCESS_CODE = "successCode";
	public static final String ERROR_MESSAGE = "errorMessage";
	public static final String SUCCESS_MESSAGE = "successMessage";
	public static final String AUTH_HEADER = "Authorization";

	/**
	 * Query Parameters and Response Parameters
	 */
	public static String USER_INFO_HEADER = "x-user-info";
	public static String SUCCESS = "success";
	public static String ASC = "asc";
	public static String DESC = "desc";
	public static String TRUE = "true";
	public static String FALSE = "false";
	public static String STRING_BLANK = "";
	public static String COMMA_SPACE_SEPARATOR = ", ";
	public static final String DATE = "date";
	public static String QUERY_ALERT_SUBJECT = "Query Alert!!";
	public static String SCHEDULER_ALERT_SUBJECT = "Scheduler Alert!!";
	public static String STRING_SPACE = " ";
	public static String STRING_HYPEN = "-";
	public static String NEW_MESSAGE = "New";
	public static String READ_MESSAGE = "Read";
	public static String DELETE_MESSAGE = "Delete";
	public static String SEND_MESSAGE = "Send";
	public static String FILE_TYPE = "PDF,DOC,TXT,JPG,JPEG,PNG,GIF,AAC,MP3,MP4";
	public static String IMAGE_FILE_TYPE = "JPG,JPEG,PNG,GIF";
	public static String FCM_API_URL = "fcm.api.url";
	public static String FCM_API_KEY = "fcm.api.key";

	/**
	 * URLs and Paths
	 */
	public static String UPLOADED_FOLDER = "/home/uploads/";

	/**
	 * Status Code and Messages
	 */
	public static int UNAUTHORIZED_ID = 401;
	public static int SUCCESS_ID = 200;
	public static int FAILURE_ID = 320;
	public static String UNAUTHORIZED = "Invalid credentials. Please try again.";
	public static String PROCESS_FAIL = "Process failed, Please try again.";

	/**
	 * Allowed Origins for CORS Bean
	 */
	public static final String GET = "GET";
	public static final String POST = "POST";
	public static final String PUT = "PUT";
	public static final String DELETE = "DELETE";
	public static final String OPTIONS = "OPTIONS";

	/**
	 * Qualifiers and Services
	 */
	public static final String USER_SERVICE = "userService";
	public static final String USER_DAO = "userDao";
	public static final String ROLE_ACTION_SERVICE = "roleActionService";
	public static final String ROLE_DAO = "roleDao";

	public static enum CountryList {
		SWE(1, "Sweden", "SWEDEN"), NOR(2, "Norway", "NORWAY"), FIN(3, "Finland", "FINLAND"), IND(4, "India", "INDIA");
		private int countryCode;
		private String value;
		private String name;

		CountryList(int statusId, String value, String name) {
			this.countryCode = statusId;
			this.value = value;
			this.name = name;
		}

		public int getStatusId() {
			return countryCode;
		}

		public void setStatusId(int statusId) {
			this.countryCode = statusId;
		}

		public String getValue() {
			return value;
		}

		public void setValue(String value) {
			this.value = value;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	public static enum MasterRoleList {
		COUNTRY_MANAGER(1, "COUNTRY MANAGER", "CNTR_MNGR"), SALES_AREA_MANAGER(2, "SALES AREA MANAGER",
				"SL_AR_MNGR"), STORE_MANAGER(3, "STORE MANAGER", "ST_MNGR");
		private int id;
		private String code;
		private String name;

		public int getId() {
			return id;
		}

		private MasterRoleList(int id, String code, String name) {
			this.id = id;
			this.code = code;
			this.name = name;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

	}
}
