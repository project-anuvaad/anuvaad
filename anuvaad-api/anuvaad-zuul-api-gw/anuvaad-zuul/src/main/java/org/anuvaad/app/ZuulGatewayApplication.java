package org.anuvaad.app;

import org.anuvaad.cache.ZuulConfigCache;
import org.anuvaad.filters.error.ErrorFilterFilter;
import org.anuvaad.filters.post.ResponseFilter;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


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

    @Bean
    public ErrorFilterFilter errorFilterFilter(){
        return new ErrorFilterFilter();
    }

    @Bean
    public ResponseFilter responseFilter() {return new ResponseFilter();}

/*    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("*")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT");
            }
        };
    }*/
}