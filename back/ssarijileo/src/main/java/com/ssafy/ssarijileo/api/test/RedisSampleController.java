package com.ssafy.ssarijileo.api.test;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class RedisSampleController {

	private final RedisSampleService redisSampleService;

	@GetMapping("/getSessionId")
	public String getSessionId(HttpSession session) {
		return session.getId();
	}

	@PostMapping(value = "/getRedisStringValue")
	public void getRedisStringValue(String key) {
		redisSampleService.getRedisStringValue(key);
	}

	@PostMapping(value = "/setRedisStringValue")
	public void setRedisStringValue(String key, String value) {
		redisSampleService.setRedisStringValue(key, value);
	}
}