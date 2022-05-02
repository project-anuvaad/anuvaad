package org.anuvaad.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.context.RequestContext;
import org.anuvaad.models.UMSResponse;
import org.anuvaad.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.anuvaad.constants.RequestContextConstants.CORRELATION_ID_HEADER_NAME;
import static org.anuvaad.constants.RequestContextConstants.CORRELATION_ID_KEY;

public class UserUtils {

    @Value("${anuvaad.ums.host}")
    private String umsHost;

    @Value("${anuvaad.ums.token.search}")
    private String umsSearchWithToken;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public UserUtils(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        objectMapper = new ObjectMapper();
    }

    /**
     * Fetches user from the UMS via API.
     * @param authToken
     * @param ctx
     * @return
     */
    public User getUser(String authToken, RequestContext ctx) {
        String authURL = String.format("%s%s", umsHost, umsSearchWithToken);
        Map<String, String> req_body = new HashMap<>();
        req_body.put("token", authToken);
        final HttpHeaders headers = new HttpHeaders();
        headers.add(CORRELATION_ID_HEADER_NAME, (String) ctx.get(CORRELATION_ID_KEY));
        final HttpEntity<Object> httpEntity = new HttpEntity<>(req_body, headers);
        try{
            UMSResponse userServiceRes = restTemplate.postForObject(authURL, httpEntity, UMSResponse.class);
            if (null != userServiceRes){
                return userServiceRes.getData();
            }
            else{
                logger.info("The UMS service is down.");
                return null;
            }
        }catch (Exception e){
            logger.error("Auth Token invalid!");
            return null;
        }
    }
}
