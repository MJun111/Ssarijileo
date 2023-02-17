package com.ssafy.ssarijileo.api.test;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RedisSampleService {

	private final StringRedisTemplate stringRedisTemplate;

	public void getRedisStringValue(String key) {

		ValueOperations<String, String> stringValueOperations = stringRedisTemplate.opsForValue();
		System.out.println("Redis key : " + key);
		System.out.println("Redis value : " + stringValueOperations.get(key));
	}

	public void setRedisStringValue(String key, String value) {
		ValueOperations<String, String> stringValueOperations = stringRedisTemplate.opsForValue();
		stringValueOperations.set(key, value);
		System.out.println("Redis key : " + key);
		System.out.println("Redis value : " + stringValueOperations.get(key));
	}
}