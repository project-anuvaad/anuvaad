import org.anuvaad.filters.pre.AuthFilter;
import org.anuvaad.filters.pre.CorrelationFilter;
import org.anuvaad.filters.pre.RbacFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;


@EnableZuulProxy
@EnableCaching
@SpringBootApplication
public class ZuulGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }

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
        return new RbacFilter();
    }
}