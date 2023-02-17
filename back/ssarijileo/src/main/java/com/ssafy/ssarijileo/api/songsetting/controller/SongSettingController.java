package com.ssafy.ssarijileo.api.songsetting.controller;

import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.api.songsetting.dto.SongSettingDto;
import com.ssafy.ssarijileo.api.songsetting.service.SongSettingService;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;

@Api(tags = "사용자 노래 설정 API")
@RestController
@RequestMapping("/api/v1/song-setting")
@AllArgsConstructor
public class SongSettingController {

	private final SongSettingService songSettingService;


	/**
	 * @title 내 노래 설정
	 * @param userId
	 * @return
	 */
	@ApiOperation(
		value = "내 노래 설정",
		notes = "사용자 ID를 통해 해당 사용자의 노래 설정을 조회한다."
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
	@GetMapping("/my")
	ResponseEntity<SongSettingDto> findSongSettingByUserId(@RequestHeader String userId) {
		return ResponseEntity.status(200).body(songSettingService.findSongSettingByUserId(userId));
	}

	/**
	 * @title 노래 설정 수정
	 * @param songSettingDto
	 * @return
	 */
	@ApiOperation(
		value = "노래 설정 수정",
		notes = "사용자의 에코와 볼륨을 조정한다."
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@PutMapping
	ResponseEntity<? extends BaseResponseBody> updateSongSetting(@RequestHeader String userId, @RequestBody SongSettingDto songSettingDto) {
		songSettingDto.setSongSettingId(userId);
		songSettingService.updateSongSetting(songSettingDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
