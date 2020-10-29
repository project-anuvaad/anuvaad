package org.anuvaad.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.anuvaad.cache.ZuulConfigCache;
import org.anuvaad.filters.pre.AuthFilter;
import org.anuvaad.filters.pre.CorrelationFilter;
import org.anuvaad.filters.pre.RbacFilter;
import org.anuvaad.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.client.RestTemplate;


@EnableZuulProxy
@EnableCaching
@SpringBootApplication
public class ZuulGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }

    @Autowired
    public ResourceLoader resourceLoader;

    @Autowired
    public RestTemplate restTemplate;

    @Bean
    public RestTemplate restTemplate() {return new RestTemplate();}

    @Bean
    public UserUtils userUtils() {return new UserUtils(restTemplate);}

    @Bean
    public ZuulConfigCache zuulConfigCache() {return new ZuulConfigCache(resourceLoader); }

    @Bean
    public CorrelationFilter correlationFilter(){
        return new CorrelationFilter();
    }

    @Bean
    public AuthFilter authFilter(){
        return new AuthFilter();
    }

    @Bean
    public RbacFilter rbacFilter(){
        return new RbacFilter(resourceLoader);
    }
}