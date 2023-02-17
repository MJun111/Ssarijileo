package com.ssafy.ssarijileo.api.reservation.controller;

import java.util.List;

import org.springframework.http.MediaType;
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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/api/v1/reservation")
@RequiredArgsConstructor
public class ReservationController {

	private final ReservationService reservationService;

	@GetMapping("/{sessionId}")
	List<ReservationDto> findReservationBySessionId(@PathVariable String sessionId) {
		return reservationService.findReservationBySessionId(sessionId);
	}

	@PostMapping
	void insertReservation(@RequestBody ReservationDto reservationDto) {
		reservationService.insertReservation(reservationDto);
	}

	@DeleteMapping
	void deleteReservation(@RequestBody ReservationDto reservationDto) {
		reservationService.deleteReservation(reservationDto);
	}

	@PostMapping("/sing")
	void insertSing(@RequestBody SingingDto singingDto) {
		reservationService.insertSing(singingDto);
	}

	@DeleteMapping("/sing")
	void deleteSing(@RequestBody SingingDto singingDto) {
		reservationService.deleteSing(singingDto);
	}
}
