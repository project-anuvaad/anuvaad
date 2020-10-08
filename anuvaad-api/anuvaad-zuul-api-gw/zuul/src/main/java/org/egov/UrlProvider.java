package org.egov;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.core.io.Resource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class UrlProvider {


    @Autowired
    private ResourceLoader resourceLoader;

    private static Map<String, String> urlPostHooksMap;

    @Value("${url.posthook.lists}")
    private String postHookUrls;

    private static Map<String, String> urlPreHooksMap;

    @Value("${url.prehook.lists}")
    private String preHookUrls;


    private Map<String, String> getUrlToUrlMapping(String config) {
        String[] urlArray;
        Map<String, String> map = new HashMap<>();
        if (StringUtils.isEmpty(config))
            return Collections.unmodifiableMap(map);

        if (
            StringUtils.startsWithIgnoreCase(config, "http://")
            || StringUtils.startsWithIgnoreCase(config, "https://")
                || StringUtils.startsWithIgnoreCase(config, "file://")
                || StringUtils.startsWithIgnoreCase(config, "classpath:")
        )
        {
            ObjectMapper mapper = new ObjectMapper(new JsonFactory());

            Resource resource = resourceLoader.getResource(config);
            try {
                map = mapper.readValue(resource.getInputStream(),map.getClass());
            } catch (IOException e) {
                e.printStackTrace();
            }

        } else {
            urlArray = config.split("\\|");

            for (int i = 0; i < urlArray.length; i++) {

                String[] index = urlArray[i].split(":", 2);
                map.put(index[0], index[1]);
            }
            urlPostHooksMap = Collections.unmodifiableMap(map);
        }

        return Collections.unmodifiableMap(map);
    }

    @PostConstruct
    public void loadUrls() {
        urlPostHooksMap = getUrlToUrlMapping(postHookUrls);
        urlPreHooksMap = getUrlToUrlMapping(preHookUrls);

    }

    public static Map<String, String> getUrlPostHooksMap() {
        return urlPostHooksMap;
    }

    public static Map<String, String> getUrlPreHooksMap() {
        return urlPreHooksMap;
    }
}
