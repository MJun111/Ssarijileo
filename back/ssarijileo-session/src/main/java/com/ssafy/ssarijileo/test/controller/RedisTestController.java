package com.ssafy.ssarijileo.test.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.test.client.BaseResponseBody;
import com.ssafy.ssarijileo.test.client.FriendClient;
import com.ssafy.ssarijileo.test.service.RedisTestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RedisTestController {

	private final RedisTestService redisTestService;
	private final FriendClient testClient;

	@GetMapping("/getSessionId")
	public String getSessionId(HttpSession session) {
		return session.getId();
	}

	@PostMapping("/getRedisStringValue")
	public void getRedisStringValue(String key) {
		redisTestService.getRedisStringValue(key);
	}

	@PostMapping("/setRedisStringValue")
	public void setRedisStringValue(String key, String value) {
		redisTestService.setRedisStringValue(key, value);
	}

	@GetMapping("/test2")
	public ResponseEntity<? extends BaseResponseBody> testFriend() {
		return testClient.testFriend2();
	}
}
