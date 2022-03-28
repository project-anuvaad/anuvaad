package com.tarento.analytics.handler;

import java.text.DecimalFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.InsightsWidget;
import com.tarento.analytics.model.InsightsConfiguration;
import com.tarento.analytics.utils.ResponseRecorder;

@Component
public class MetricsInsightsHandler implements InsightsHandler {
	
	@Autowired
	private ResponseRecorder responseRecorder; 

	@Override
	public AggregateDto getInsights(AggregateDto aggregateDto, String visualizationCode, String moduleLevel, InsightsConfiguration insightsConfig) {
		String internalVisualizationCode = visualizationCode.substring(1);  
		Data currentData = (Data) responseRecorder.get(internalVisualizationCode, moduleLevel);
		Data pastData = (Data) responseRecorder.get(visualizationCode, moduleLevel);
		String textToDisplay = insightsConfig.getTextMessage();
		String insightIndicator = ""; 
		if(INSIGHT_NUMBER_DIFFERENCE.equals(insightsConfig.getAction())) {
			Double difference = (Double)currentData.getHeaderValue() - (Double) pastData.getHeaderValue();
			if(difference > 0) { 
				Double insightValue = (difference / (Double)pastData.getHeaderValue()) * 100;
				if(insightValue.isInfinite()) 
					return aggregateDto; 
				textToDisplay = textToDisplay.replace(INDICATOR_PLACEHOLDER, POSITIVE);
				textToDisplay = textToDisplay.replace(VALUE_PLACEHOLDER, String.valueOf(new DecimalFormat("#").format(insightValue)));
				insightIndicator = INSIGHT_INDICATOR_POSITIVE; 
			} else { 
				difference = (Double) pastData.getHeaderValue() - (Double) currentData.getHeaderValue();
				Double insightValue = (difference / (Double)pastData.getHeaderValue()) * 100;
				if(insightValue.isInfinite()) 
					return aggregateDto; 
				if(difference.equals(0.0) && insightValue.equals(0.0)) 
					return aggregateDto;
				textToDisplay = textToDisplay.replace(INDICATOR_PLACEHOLDER, NEGATIVE);
				textToDisplay = textToDisplay.replace(VALUE_PLACEHOLDER, String.valueOf(new DecimalFormat("#").format(insightValue)));
				insightIndicator = INSIGHT_INDICATOR_NEGATIVE; 
			}
			textToDisplay = textToDisplay.replace(INSIGHT_INTERVAL_PLACEHOLDER, insightsConfig.getInsightInterval());
			InsightsWidget insightsWidget = new InsightsWidget(INSIGHT_WIDGET_NAME, textToDisplay, insightIndicator, insightIndicator);
			List<Data> dataList = aggregateDto.getData(); 
			for(Data data : dataList) { 
				data.setInsight(insightsWidget);
			}
		}
		return aggregateDto;
	}

}
