package com.ssafy.ssarijileo.api.recording.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ssafy.ssarijileo.api.recording.dto.RecordingDto;
import com.ssafy.ssarijileo.api.recording.dto.RecordingResponseDto;
import com.ssafy.ssarijileo.api.recording.service.RecordingService;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;

@Api(tags = "녹화 API")
@RestController
@RequestMapping("/api/v1/recording")
@RequiredArgsConstructor
public class RecordingController {

	private final RecordingService recordingService;

	/**
	 * @title 내 녹화 목록
	 * @param userId
	 * @return
	 */
	@ApiOperation(
		value = "내 녹화 목록",
		notes = "사용자 ID를 통해 해당 사용자의 녹화 목록을 조회한다."
	)
	@ApiImplicitParam(
		name = "userId",
		value = "사용자 PK"
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "녹화 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@GetMapping("/my")
	public ResponseEntity<List<RecordingResponseDto>> findRecordingByUserId(@RequestHeader String userId) {
		return ResponseEntity.status(200).body(recordingService.findRecordingByUserId(userId));
	}

	/**
	 * @title 녹화 저장
	 * @param recordingDto
	 * @param file
	 */
	@ApiOperation(
		value = "녹화 저장",
		notes = "녹화 정보를 저장한다."
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<? extends BaseResponseBody> insertRecording(@RequestHeader String userId,
		@RequestPart RecordingDto recordingDto, @RequestPart MultipartFile  file) {
		recordingDto.setUserId(userId);
		recordingService.insertRecording(recordingDto, file);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	/**
	 * @title 녹화 삭제
	 * @param recordingId
	 * @return
	 */
	@ApiOperation(
		value = "녹화 삭제",
		notes = "녹화 ID를 통해 해당 녹화 정보를 삭제한다."
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
	@DeleteMapping("/{recordingId}")
	public ResponseEntity<? extends BaseResponseBody> deleteRecording(@PathVariable Long recordingId) {
		recordingService.deleteRecording(recordingId);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
