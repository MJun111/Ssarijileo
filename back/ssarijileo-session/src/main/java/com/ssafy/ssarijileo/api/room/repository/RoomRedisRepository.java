package com.ssafy.ssarijileo.api.room.repository;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.ssarijileo.api.room.dto.RoomDto;
import com.ssafy.ssarijileo.common.redis.RedisBase;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RoomRedisRepository {

	private final RedisBase redisBase;

	private static final Duration TTL = Duration.ofDays(1);

	private String category = "room_";

	private Class classType = RoomDto.class;

	public List<RoomDto> getList() {
		return redisBase.getList(category, classType);
	}

	public Optional<RoomDto> get(String key) {
		return redisBase.get(getKey(key), classType);
	}

	public void set(String key, RoomDto value) {
		redisBase.set(getKey(key), value, TTL);
	}

	public void remove(String key) {
		redisBase.remove(getKey(key));
	}

	public String getKey(String sessionId) {
		return category + sessionId;
	}
}
