package com.tarento.retail.util;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

/**
 * Created by Abhishek on 10/5/2017.
 */
@Service(value = "jsonObjectUtil")
public class JSONObjectUtil {
    @Autowired
    public ObjectMapper mapper;
    @Autowired
    public Gson gson;

    private static Logger logger = Logger.getLogger(JSONObjectUtil.class);


    /**
     * @return
     */
    public static String getJsonString(ObjectMapper objectMapper,Object object) throws JsonProcessingException {
        //initialize();
        if(objectMapper != null){
            return  objectMapper.writeValueAsString(object);
        }
        return null;
    }

    public String getJsonString(Object object) throws JsonProcessingException {
        //initialize();
        if(mapper != null){
            return  mapper.writeValueAsString(object);
        }
        if(gson != null){
            return gson.toJson(object);
        }
        return null;
    }


    public ObjectMapper getMapper() {
        return mapper;
    }

    public void setObjectMapper(ObjectMapper objectMapper){
        mapper=objectMapper;
    }

    public Gson getGson() {
        return gson;
    }

    public void setGson(Gson gsonn)
    {
        gson = gsonn;
    }
}
