package org.tarento.retail;

import java.util.Arrays;
import java.util.HashSet;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.tarento.retail.filters.pre.AuthFilter;
import org.tarento.retail.filters.pre.AuthPreCheckFilter;
import org.tarento.retail.filters.pre.RbacFilter;
import org.tarento.retail.filters.pre.RbacPreCheckFilter;

@EnableZuulProxy
@SpringBootApplication
public class ZuulGatewayApplication{
	
	 
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }

    @Value("${retail.user-info-header}")
    private String userInfoHeader;

    @Value("#{'${retail.open-endpoints-whitelist}'.split(',')}")
    private String[] openEndpointsWhitelist;

    @Value("#{'${retail.mixed-mode-endpoints-whitelist}'.split(',')}")
    private String[] mixedModeEndpointsWhitelist;

    @Value("${retail.auth-service-host}")
    private String authServiceHost;

    @Value("${retail.auth-service-uri}")
    private String authServiceUri;

    @Bean
    public AuthPreCheckFilter authCheckFilter() {
        return new AuthPreCheckFilter(new HashSet<>(Arrays.asList(openEndpointsWhitelist)),
            new HashSet<>(Arrays.asList(mixedModeEndpointsWhitelist)));
    }

    @Bean
    public AuthFilter authFilter() {
        RestTemplate restTemplate = new RestTemplate();
        final ProxyRequestHelper proxyRequestHelper = new ProxyRequestHelper();
        return new AuthFilter(proxyRequestHelper, restTemplate, authServiceHost, authServiceUri);
    }

    @Bean
    public RbacFilter rbacFilter() {
        return new RbacFilter();
    }

    @Bean
    public RbacPreCheckFilter rbacCheckFilter() {
        return new RbacPreCheckFilter(new HashSet<>(Arrays.asList(openEndpointsWhitelist)),
            new HashSet<>(Arrays.asList(mixedModeEndpointsWhitelist))
        );
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedMethods("GET", "POST", "PUT", "DELETE","OPTIONS").allowedOrigins("*")
                        .allowedHeaders("*");
            }
        };
    }
    
   
}