package org.tarento.retail.util;

public class Constants {

    public static final long ACCESS_TOKEN_VALIDITY_SECONDS = 5*60*60;
    public static final String SIGNING_KEY = "devglan123r";
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
    public static String SUCCESS= "success";
    public static String ASC= "asc";
    public static String DESC= "desc";
    public static String TRUE = "true";
    public static String FALSE = "false";
    public static String STRING_BLANK="";
    public static String COMMA_SPACE_SEPARATOR=", ";
    public static final String DATE = "date";
    public static String QUERY_ALERT_SUBJECT =  "Query Alert!!";
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
    public static String UPLOADED_FOLDER = "/home/uploads/";

    public static int UNAUTHORIZED_ID = 401;
    public static int SUCCESS_ID = 200;
    public static int FAILURE_ID = 320;
    public static int SESSION_INVALID_ID = 306; 
    public static int INVALID_AUTH_ID = 400; 
    public static String UNAUTHORIZED = "Invalid credentials. Please try again.";
    public static String INVALID_AUTH = "Invalid Auth Token. Please try again"; 
    public static String PROCESS_FAIL = "Process failed, Please try again.";
    public static String SESSION_INVALID = "Session invalid. Please login again"; 
}
