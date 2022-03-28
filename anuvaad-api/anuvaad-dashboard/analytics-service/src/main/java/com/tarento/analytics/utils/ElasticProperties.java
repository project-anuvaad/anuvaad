package com.tarento.analytics.utils;

public interface ElasticProperties {

    public interface Property {
        final String TRANSACTION_TRANSDATE = "TransDate";
        final String TRANSACTION_STOREID = "StoreId";
        final String TRANSACTION_NETAMOUNT = "NetAmt";
        final String TARGET_TARGETDATE = "targetDate";
        final String TARGET_STORECODE = "storeCode";
        final String TARGET_VERSION = "version";
        final String TARGET_SALESVALUE = "salesValue";
        final String TARGET_AVGVALUE = "avgValue";
        final String TARGET_RECEIPTVALUE = "receiptsValue";
        final String ITEM_DETAILS_CATEGORY_ID = "itemDetails.categoryId";
        final String ITEM_DETAILS_PRICE = "itemDetails.price" ; 
        final String AVERAGE_RATING = "AvgRating"; 
        final String SORT_ORDER_DESCENDING = "desc"; 
        final String SORT_ORDER_ASCENDING = "asc"; 
        final String COUNTS = "counts"; 
        final String COUNTS_RATING = "CountsRating"; 
        final String FEEDBACK_VALUE_RESPONSE = "feedback_value"; 
    }

    public interface SuccessMessages {
        final String STORE_USER = "User and  Store successfully mapped" ;
        final String STORE_TIMING = "Store Times entered successfully" ;
    }
    
    public interface Query { 
    	final String NESTED = "NESTED";
    	final String MATCH_CONDITION = "MATCH";
    	final String RANGE_CONDITION = "RANGE"; 
    	final String AGGREGATION_CONDITION = "AGGREGATION";
    	final String TRANSACTION_DATE_FIELD = "transDate"; 
    	final String FEEDBACK_DATE_TIME = "serverDateTime";
    	final String COUNT_STORE_CODE = "storeId"; 
    	final String COUNT_RATING_VALUE = "value";
    	final String COUNT_REASON_KEYWORD = "reasons.keyword"; 
    	final String COUNT_GENDER_KEYWORD = "gender.keyword";
    	final String COUNT_AGEGROUP_KEYWORD = "ageGroup.keyword"; 
    	final String SUM = "SUM";
    	final String VALUE_COUNT="value_count";
    	final String AVG = "AVG";
    	final String CUMMULATIVE_SUM="cumulative_sum";
    	final String FIELD = "FIELD";
    	final String COUNT = "COUNT"; 
    	final String BUCKETS_PATH = "BUCKETS_PATH";
    	final String DATE_HISTOGRAM = "DATE_HISTOGRAM";
    	final String EXTENDED_BOUNDS = "EXTENDED_BOUNDS";
    	final String PATH ="PATH";
    	final String MIN = "MIN";
    	final String MAX = "MAX";
    	final String INTERVAL = "INTERVAL";
    	final String HOUR ="HOUR";
    	final String DAY ="DAY";
    	final String DAY_OF_WEEK ="dayOfWeek";
    	final String ASC="ASC";
    	final String DESC ="DESC";

    	final String MINUTE ="MINUTE";
    	final String MONTH ="MONTH";
    	final String TERM ="TERMS";
    	final String SIZE="SIZE";
    	final String ORDER="ORDER";
    	final Integer TOP_CSAT_STORE_COUNT = 5;
    	final String LABEL="label";



    }

}