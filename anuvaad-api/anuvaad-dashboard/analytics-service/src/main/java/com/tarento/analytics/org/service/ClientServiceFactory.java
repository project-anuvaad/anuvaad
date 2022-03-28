package com.tarento.analytics.org.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;

@Component
public class ClientServiceFactory {

    @Autowired
    TarentoServiceImpl tarentoServiceImpl;
    
    @Autowired
    ReportServiceImpl reportServiceImpl;

    @Autowired
    MdmsServiceImpl mdmsServiceImpl;

    @Autowired
    ConfigurationLoader configurationLoader;

    public ClientService getInstance(Constants.ClienServiceType clientServiceName){

        if(clientServiceName.equals(Constants.ClienServiceType.DEFAULT_CLIENT))
            return tarentoServiceImpl;
        else if(clientServiceName.equals(Constants.ClienServiceType.MDMS_CLIENT))
            return mdmsServiceImpl;

        else
            throw new RuntimeException(clientServiceName + "not found");

    }

    public ClientService get(String profileName, String chartId){
        ObjectNode node = configurationLoader.getConfigForProfile(profileName, Constants.ConfigurationFiles.CHART_API_CONFIG);
        ObjectNode chartNode = (ObjectNode) node.get(chartId);
        return tarentoServiceImpl;
    }
    
    public ClientService getReport(String profileName, String chartId){
        ObjectNode node = configurationLoader.getConfigForProfile(profileName, Constants.ConfigurationFiles.REPORT_API_CONFIG);
        ObjectNode chartNode = (ObjectNode) node.get(chartId);
        return reportServiceImpl;
    }

}
