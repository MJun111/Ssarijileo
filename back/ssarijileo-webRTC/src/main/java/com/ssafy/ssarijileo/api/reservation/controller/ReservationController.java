package com.ssafy.ssarijileo.api.reservation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssarijileo.api.reservation.dto.ReservationDto;
import com.ssafy.ssarijileo.api.reservation.service.ReservationService;
import com.ssafy.ssarijileo.api.singing.dto.SingingDto;
import com.ssafy.ssarijileo.common.model.BaseResponseBody;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/reservation")
@RequiredArgsConstructor
@Slf4j
public class ReservationController {

	private final ReservationService reservationService;

	/**
	 * @title 노래 예약 목록
	 * @param sessionId
	 *
	 * @return
	 */
	@GetMapping("/{sessionId}")
	ResponseEntity<List<ReservationDto>> findReservationBySessionId(@PathVariable String sessionId) {
		return ResponseEntity.status(200).body(reservationService.findReservationBySessionId(sessionId));
	}

	/**
	 * @title 노래 예약
	 * @param reservationDto
	 * @return
	 */
	@PostMapping
	ResponseEntity<? extends BaseResponseBody> insertReservation(@RequestHeader String userId, @RequestBody ReservationDto reservationDto) {
		reservationDto.setUserId(userId);
		reservationService.insertReservation(reservationDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	/**
	 * @title 예약 취소
	 * @param reservationDto
	 * @return
	 */
	@DeleteMapping
	ResponseEntity<? extends BaseResponseBody> deleteReservation(@RequestHeader String userId, @RequestBody ReservationDto reservationDto) {
		reservationDto.setUserId(userId);
		reservationService.deleteReservation(reservationDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@PostMapping("/sing")
	ResponseEntity<? extends BaseResponseBody> insertSing(@RequestHeader String userId, @RequestBody SingingDto singingDto) {
		singingDto.setUserId(userId);
		reservationService.insertSing(singingDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	@DeleteMapping("/sing")
	ResponseEntity<? extends BaseResponseBody> deleteSing(@RequestHeader String userId, @RequestBody SingingDto singingDto) {
		singingDto.setUserId(userId);
		reservationService.deleteSing(singingDto);
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}
}
