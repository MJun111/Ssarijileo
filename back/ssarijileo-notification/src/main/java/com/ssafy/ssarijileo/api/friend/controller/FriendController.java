package com.ssafy.ssarijileo.api.friend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.api.friend.dto.FriendDto;
import com.ssafy.ssarijileo.api.friend.service.FriendService;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/friend")
@RequiredArgsConstructor
public class FriendController {

	private final FriendService friendService;

	/**
	 * @title 친구 요청
	 * @param friendDto
	 */
	@PostMapping("/request")
	public ResponseEntity<? extends BaseResponseBody> requestFriend(@RequestBody FriendDto friendDto) {
		friendService.requestFriend(friendDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	/**
	 * @title 친구 초대
	 * @param friendDto
	 */
	@PostMapping("/invite")
	public ResponseEntity<? extends BaseResponseBody> inviteFriend(@RequestBody FriendDto friendDto) {
		friendService.inviteFriend(friendDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
