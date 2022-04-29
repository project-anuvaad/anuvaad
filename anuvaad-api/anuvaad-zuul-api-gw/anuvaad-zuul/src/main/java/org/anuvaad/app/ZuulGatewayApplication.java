package org.anuvaad.app;


import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.anuvaad.cache.ZuulConfigCache;
import org.anuvaad.filters.error.ErrorFilterFilter;
import org.anuvaad.filters.post.ResponseFilter;
import org.anuvaad.filters.pre.AuthFilter;
import org.anuvaad.filters.pre.CorrelationFilter;
import org.anuvaad.filters.pre.RbacFilter;
import org.anuvaad.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }

    @Value(value = "${redis.url}")
    private String host;

    @Value(value = "${redis.port}")
    private String port;

    @Value(value = "${redis.pass}")
    private String pass;

    @Value(value = "${redis.ratelimit.db}")
    private Integer ratelimitDb;

    @Value(value = "${zuul.ratelimit.enabledl}")
    private Boolean ratelimitEnabled;

    @Bean
    public JedisConnectionFactory connectionFactory() {
        if (ratelimitEnabled) {
            RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
            logger.info("host: {}, port: {}, pass: {}", host, port, pass);
            configuration.setHostName(host);
            configuration.setPort(Integer.parseInt(port));
            configuration.setPassword(pass);
            configuration.setDatabase(ratelimitDb);
            return new JedisConnectionFactory(configuration);
        }
        return new JedisConnectionFactory();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        final RedisTemplate<String, Object> redisTemplate = new RedisTemplate<String, Object>();
        if (ratelimitEnabled) {
            redisTemplate.setConnectionFactory(connectionFactory());
            redisTemplate.setKeySerializer(new StringRedisSerializer());
            redisTemplate.setValueSerializer(new StringRedisSerializer());
            redisTemplate.setHashKeySerializer(new StringRedisSerializer());
            redisTemplate.setHashValueSerializer(new StringRedisSerializer());
        }
        return redisTemplate;
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

    @Bean
    RedisClient redisClient() {
        logger.info("host: {}, port: {}, pass: {}", this.host, this.port, this.pass);
        RedisURI uri = RedisURI.Builder.redis(this.host, Integer.parseInt(this.port))
                .withPassword(this.pass)
                .build();
        return RedisClient.create(uri);
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) { this.host = host; }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public Integer getRatelimitDb() {
        return ratelimitDb;
    }

    public void setRatelimitDb(Integer ratelimitDb) {
        this.ratelimitDb = ratelimitDb;
    }

    public Boolean getRatelimitEnabled() {
        return ratelimitEnabled;
    }

    public void setRatelimitEnabled(Boolean ratelimitEnabled) {
        this.ratelimitEnabled = ratelimitEnabled;
    }
}