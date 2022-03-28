package com.tarento.analytics.helper;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;

/**
 * This implementation of Compute Helper is used to compute the difference of dates between the Request Date
 * The difference is then multiplied against the Per Day Unit of Target which has been obtained from Elastic Search
 * @author darshan
 *
 */
@Component
public class TargetPerDateComputeHelper implements ComputeHelper {
	private static final Long ROUND_OFF= 19801000l; 
	private static final Long NUMBER_OF_DAYS = 365l; 
	private static final Long LAST_HOUR = 23l;
	private static final Long LAST_MINUTE = 59l; 
	public static final Logger logger = LoggerFactory.getLogger(TargetPerDateComputeHelper.class);
	@Override
	public List<Data> compute(AggregateRequestDto request, List<Data> data) {
		if(request.getRequestDate()!= null && request.getRequestDate().getStartDate() != null && request.getRequestDate().getEndDate() !=null) {
			try { 
				Long sDate = Long.parseLong(request.getRequestDate().getStartDate());
				logger.info("Start Date : " + String.valueOf(sDate));
				Long eDate = Long.parseLong(request.getRequestDate().getEndDate());
				logger.info("End Date : " + String.valueOf(eDate));
				Calendar cal = Calendar.getInstance(); 
				cal.setTime(new Date(eDate));
				if(cal.get(Calendar.HOUR_OF_DAY) == LAST_HOUR && cal.get(Calendar.MINUTE) == LAST_MINUTE) { 
					eDate = eDate + ROUND_OFF; 
				}
				logger.info("End Date after Round Off: " + String.valueOf(eDate));
		        Long dateDifference = TimeUnit.DAYS.convert((eDate - sDate), TimeUnit.MILLISECONDS);
		        if(dateDifference == 0l) dateDifference = dateDifference + 1l ;
				for(Data eachData : data) { 
						Double value = (Double) eachData.getHeaderValue();
						logger.info("Value is : " + value + " :: Date Difference is : " + dateDifference);
						value = (value / NUMBER_OF_DAYS) * dateDifference; 
						eachData.setHeaderValue(value);
				}
			} catch (Exception ex) { 
				logger.error("Encountered an error while computing the logic in Target Date Computer : " + ex.getMessage());
			}
		}
		return data;
	}

	public Double compute(AggregateRequestDto request, double value){

		if(request.getRequestDate()!= null && request.getRequestDate().getStartDate() != null && request.getRequestDate().getEndDate() !=null) {
			try {
				Long sDate = Long.parseLong(request.getRequestDate().getStartDate());
				logger.info("Start Date : " + String.valueOf(sDate));
				Long eDate = Long.parseLong(request.getRequestDate().getEndDate());
				logger.info("End Date : " + String.valueOf(eDate));
				Calendar cal = Calendar.getInstance();
				cal.setTime(new Date(eDate));
				if(cal.get(Calendar.HOUR_OF_DAY) == LAST_HOUR && cal.get(Calendar.MINUTE) == LAST_MINUTE) {
					eDate = eDate + ROUND_OFF;
				}
				logger.info("End Date after Round Off: " + String.valueOf(eDate));
				Long dateDifference = TimeUnit.DAYS.convert((eDate - sDate), TimeUnit.MILLISECONDS);
				if(dateDifference == 0l) dateDifference = dateDifference + 1l ;

				value = (value / NUMBER_OF_DAYS) * dateDifference;
				logger.info("Value is : " + value + " :: Date Difference is : " + dateDifference);

			} catch (Exception ex) {
				logger.error("Encountered an error while computing the logic in Target Date Computer : " + ex.getMessage());
			}
		}

		return value;



	}


}
