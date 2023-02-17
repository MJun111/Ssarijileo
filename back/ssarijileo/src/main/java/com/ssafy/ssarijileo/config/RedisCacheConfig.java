package com.ssafy.ssarijileo.config;// package com.ssafy.ssarijileo.config;
//
// import java.time.Duration;
// import java.util.HashMap;
// import java.util.Map;
//
// import org.springframework.cache.annotation.EnableCaching;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.data.redis.cache.CacheKeyPrefix;
// import org.springframework.data.redis.cache.RedisCacheConfiguration;
// import org.springframework.data.redis.cache.RedisCacheManager;
// import org.springframework.data.redis.connection.RedisConnectionFactory;
// import org.springframework.data.redis.serializer.RedisSerializationContext;
// import org.springframework.data.redis.serializer.StringRedisSerializer;
//
// @EnableCaching
// @Configuration
// public class RedisCacheConfig {
//
// 	private static final int DEFAULT_EXPIRE_SEC = 60;
//
// 	@Bean(name = "cacheManager")
// 	public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
// 		RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig()
// 			.disableCachingNullValues()
// 			.entryTtl(Duration.ofSeconds(DEFAULT_EXPIRE_SEC))
// 			.computePrefixWith(CacheKeyPrefix.simple())
// 			.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()));
// 		Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
//
// 		return RedisCacheManager.RedisCacheManagerBuilder.fromConnectionFactory(connectionFactory)
// 			.cacheDefaults(configuration)
// 			.withInitialCacheConfigurations(cacheConfigurations)
// 			.build();
// 	}
// }
