package com.ssafy.ssarijileo.api.friend.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// @FeignClient(name = "friend-client", url = "localhost:8080/api/v1/profile")
@FeignClient(name = "friend-client", url = "192.168.49.2:31000/api/v1/profile")
public interface FriendClient {

	@GetMapping("/{nickname}")
	String findIdByNickname(@PathVariable String nickname);
}
