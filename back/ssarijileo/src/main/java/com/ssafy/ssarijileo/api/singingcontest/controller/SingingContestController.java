package com.ssafy.ssarijileo.api.singingcontest.controller;

import java.util.List;

import com.ssafy.ssarijileo.api.singingcontest.dto.LikeDto;
import com.ssafy.ssarijileo.api.singingcontest.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ssafy.ssarijileo.api.singingcontest.dto.SingingContestResponseDto;
import com.ssafy.ssarijileo.api.singingcontest.dto.SingingContestUpdateDto;
import com.ssafy.ssarijileo.api.singingcontest.service.SingingContestService;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;

@Api(tags = "노래자랑 API")
@RestController
@RequestMapping("api/v1/singing-contest")
@RequiredArgsConstructor
public class SingingContestController {

	private final SingingContestService singingContestService;

	/**
	 * @title 노래자랑 목록
	 * @return
	 */
	@ApiOperation(
		value = "노래자랑 목록",
		notes = "노래자랑 전체 목록을 조회한다."
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "노래자랑 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@GetMapping
	ResponseEntity<List<SingingContestResponseDto>> findAllSingingContest(@RequestHeader String userId) {
		return ResponseEntity.status(200).body(singingContestService.findAllSingingContest(userId));
	}

	/**
	 * @title 내 노래자랑 목록
	 * @param userId
	 * @return
	 */
	@ApiOperation(
		value = "내 노래자랑 목록",
		notes = "사용자 ID를 통해 해당 사용자의 노래자랑랑목록을 조회한다."
	)
	@ApiImplicitParam(
		name = "userId",
		value = "사용자 PK"
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "노래자랑 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@GetMapping("/my")
	ResponseEntity<List<SingingContestResponseDto>> findSingingContestByUserId(@RequestHeader String userId) {
		return ResponseEntity.status(200).body(singingContestService.findSingingContestByUserId(userId));
	}

	/**
	 * @title 노래자랑 등록
	 * @param recordingId
	 * @return
	 */
	@ApiOperation(
			value = "노래자랑 등록",
			notes = "녹화 ID를 통해 해당 녹화 파일을 노래자랑에 등록한다."
		)
		@ApiImplicitParam(
		name = "recordingId",
		value = "녹화 PK"
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@PostMapping("/{recordingId}")
	ResponseEntity<? extends BaseResponseBody> insertSingingContest(@PathVariable Long recordingId) {
		singingContestService.insertSingingContest(recordingId);
		return  ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	/**
	 * @title 노래자랑 삭제/신고
	 * @param singingContestUpdateDto
	 * @return
	 */
	@ApiOperation(
		value = "노래자랑 삭제/신고",
		notes = "노래자랑 게시물을 삭제하거나 신고한다."
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@PutMapping
	ResponseEntity<? extends BaseResponseBody> updateSingingContest(@RequestBody SingingContestUpdateDto singingContestUpdateDto) {
		singingContestService.updateSingingContest(singingContestUpdateDto);
		return  ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@ApiOperation(
			value = "노래자랑 좋아요",
			notes = "노래자랑 게시물에 좋아요를 누른다."
	)
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "정보 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	@PostMapping("/like")
	ResponseEntity<Long> setLike(@RequestHeader String userId, @RequestBody LikeDto likeDto) {
		likeDto.setUserId(userId);
		return  ResponseEntity.status(200).body(singingContestService.setLike(likeDto));
	}
}
