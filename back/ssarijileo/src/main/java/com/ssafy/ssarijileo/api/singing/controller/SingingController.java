package com.ssafy.ssarijileo.api.singing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.api.singing.dto.SingingDto;
import com.ssafy.ssarijileo.api.singing.service.SingingService;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;

@Api(tags = "사용자 노래 API")
@RestController
@RequestMapping("/api/v1/singing")
@RequiredArgsConstructor
public class SingingController {

	private final SingingService singingService;

	/**
	 * @title 사용자 노래 정보 저장
	 * @param singingDto
	 */
	@ApiOperation(
		value = "사용자 노래 정보 저장",
		notes = "사용자가 노래 부른 정보를 저장한다."
	)
	@ApiResponses({
		@ApiResponse(code = 200, message = "성공"),
		@ApiResponse(code = 401, message = "인증 실패"),
		@ApiResponse(code = 404, message = "정보 없음"),
		@ApiResponse(code = 500, message = "서버 오류")
	})
	@PostMapping
	public ResponseEntity<? extends BaseResponseBody> insertSinging(@RequestBody SingingDto singingDto) {
		singingService.insertSinging(singingDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
	@DeleteMapping
	public ResponseEntity<? extends BaseResponseBody> deleteSinging(@RequestBody SingingDto singingDto) {
		singingService.deleteSinging(singingDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
