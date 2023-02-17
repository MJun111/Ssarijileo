package com.ssafy.ssarijileo.api.friend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.api.friend.dto.FriendDto;
import com.ssafy.ssarijileo.api.friend.dto.FriendResponseDto;
import com.ssafy.ssarijileo.api.friend.dto.FriendUpdateDto;
import com.ssafy.ssarijileo.api.friend.dto.MyFriendDto;
import com.ssafy.ssarijileo.api.friend.service.FriendService;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;

@Api(tags = "친구 API")
@RestController
@RequestMapping("/api/v1/friend")
@RequiredArgsConstructor
public class FriendController {

	private final FriendService friendService;

	/**
	 * @title 친구 찾기 목록
	 * @param nickname
	 * @return
	 */
	@ApiOperation(
		value = "친구 찾기 목록",
		notes = "사용자 닉네임을 통해 친구가 아닌 사용자들의 목록을 조회한다."
	)
	@ApiImplicitParam(
		name = "nickname",
		value = "사용자 닉네임"
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "친구 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@GetMapping("/{nickname}")
	public ResponseEntity<List<FriendResponseDto>> findAllFriend(@PathVariable String nickname) {
		return ResponseEntity.status(200).body(friendService.findAllFriend(nickname));
	}

	/**
	 * @title 내 친구 목록
	 * @param nickname
	 * @return
	 */
	@ApiOperation(
		value = "내 친구 목록",
		notes = "사용자 닉네임을 통해 해당 사용자의 친구 목록을 조회한다."
	)
	@ApiImplicitParam(
		name = "nickname",
		value = "사용자 닉네임"
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "친구 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@GetMapping("/my/{nickname}")
	public ResponseEntity<List<MyFriendDto>> findFriendByNickname(@PathVariable String nickname) {
		return ResponseEntity.status(200).body(friendService.findFriendByNickname(nickname));
	}

	/**
	 * @title 친구 요청
	 * @param friendDto
	 */
	@ApiOperation(
		value = "친구 요청",
		notes = "다른 사용자에게 친구를 요청한다."
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@PostMapping
	public ResponseEntity<Long> requestFriend(@RequestBody FriendDto friendDto) {
		return ResponseEntity.status(200).body(friendService.requestFriend(friendDto));
	}

	/**
	 * @title 친구 수락 및 취소
	 * @param friendUpdateDto
	 */
	@ApiOperation(
		value = "친구 수락 및 취소",
		notes = "친구 요청을 수락하거나 취소한다."
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@PutMapping
	public ResponseEntity<? extends BaseResponseBody> updateFriend(@RequestBody FriendUpdateDto friendUpdateDto) {
		friendService.updateFriend(friendUpdateDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
