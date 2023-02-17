package com.ssafy.ssarijileo.api.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.api.profile.dto.ProfileDto;
import com.ssafy.ssarijileo.api.profile.dto.ProfileInfoDto;
import com.ssafy.ssarijileo.api.profile.service.ProfileService;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Api(tags = "프로필 API")
@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

	private final ProfileService profileService;

	/**
	 * @title PK 조회
	 * @param nickname
	 * @return
	 */
	@ApiOperation(
		value = "PK 조회",
		notes = "닉네임을 통해 사용자 ID를 조회한다."
	)
	@ApiImplicitParam(
		name = "nickname",
		value = "사용자 닉네임"
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@GetMapping("/{nickname}")
	public ResponseEntity<String> findIdByNickname(@PathVariable String nickname) {
		return ResponseEntity.status(200).body(profileService.findIdByNickname(nickname));
	}

	/**
	 * @title 프로필 등록
	 * @param profileDto
	 */
	@ApiOperation(
		value = "프로필 등록",
		notes = "로그인 후 자동으로 사용자 프로필 정보를 저장한다."
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@PostMapping
	public ResponseEntity<? extends BaseResponseBody> insertProfile(@RequestBody ProfileDto profileDto) {
		profileService.insertProfile(profileDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	/**
	 * @title 프로필 정보
	 * @param userId
	 * @return
	 */
	@ApiOperation(
		value = "프로필 정보",
		notes = "사용자 ID를 통해 해당 사용자의 프로필 정보를 조회한다."
	)
	@ApiImplicitParam(
		name = "userId",
		value = "사용자 PK"
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@GetMapping
	public ResponseEntity<ProfileInfoDto> findProfileById(@RequestHeader String userId) {
		return ResponseEntity.status(200).body(profileService.findProfileById(userId));
	}

	@PutMapping
	public ResponseEntity<? extends BaseResponseBody> updateProfile(@RequestHeader String userId, @RequestBody ProfileInfoDto profileInfoDto) {
		profileInfoDto.setProfileId(userId);
		profileService.updateProfile(profileInfoDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@GetMapping("/check/{nickname}")
	public ResponseEntity<Boolean> checkNickname(@PathVariable String nickname) {
		return ResponseEntity.status(200).body(profileService.checkNickname(nickname));
	}

	@PostMapping("/image")
	public ResponseEntity<? extends BaseResponseBody> updateImage(@RequestBody ProfileDto profileDto) {
		profileService.updateImage(profileDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
