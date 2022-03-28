package com.tarento.analytics.helper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tarento.analytics.constant.Constants;

/**
 * Factory Class to supply the right implementation for the Post Aggregation Computation Business Logic 
 * which has to be supplied based on the Configuration written in the Chart API Configuration 
 * @author darshan
 *
 */
@Component
public class ComputeHelperFactory {
	
	@Autowired
    private TargetPerDateComputeHelper targetPerDateComputeHelper;
	
	public ComputeHelper getInstance(String intent) {

        if (intent.equals(Constants.PostAggregationTheories.RESPONSE_DIFF_DATES)) {
            return targetPerDateComputeHelper;
        }
        return null;
    }

}
