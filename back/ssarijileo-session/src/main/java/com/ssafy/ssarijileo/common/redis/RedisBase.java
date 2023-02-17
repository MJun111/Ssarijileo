package com.ssafy.ssarijileo.common.redis;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ssarijileo.api.room.dto.RoomDto;
import com.ssafy.ssarijileo.api.room.repository.RoomRedisRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisBase {

	private final RedisTemplate redisTemplate;

	private final ObjectMapper objectMapper;

	public <T> List<T> getList(String key, Class<T> classType) {

		List<T> result = new ArrayList<>();

		redisTemplate.execute(new RedisCallback() {
			@Override
			public Object doInRedis(RedisConnection connection) throws DataAccessException {

				ScanOptions options = ScanOptions.scanOptions().match(key + "*").count(20).build();

				Cursor<byte[]> entries = connection.scan(options);

				while (entries.hasNext()) {
					String key = new String(entries.next());
					result.add(get(key, classType).orElseThrow());
				}

				return result;
			}
		});

		return result;
	}

	public <T> Optional<T> get(String key, Class<T> classType) {
		Object result = redisTemplate.opsForValue().get(key);
		return result == null ? Optional.empty()
			: Optional.of(objectMapper.convertValue(result, classType));
	}

	public <T> void set(String key, T value, Duration expireTime) {
		redisTemplate.opsForValue().set(key, value, expireTime);
	}

	public void remove(String key) {
		redisTemplate.delete(key);
	}
}
