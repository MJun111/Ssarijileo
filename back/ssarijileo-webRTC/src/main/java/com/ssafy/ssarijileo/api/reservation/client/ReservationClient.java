package com.ssafy.ssarijileo.api.reservation.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.ssafy.ssarijileo.api.reservation.dto.ReservationDto;
import com.ssafy.ssarijileo.api.singing.dto.SingingDto;

// @FeignClient(name = "reservation-client", url = "localhost:8070/api/v1/reservation")
@FeignClient(name = "reservation-client", url = "session:8070/api/v1/reservation")
public interface ReservationClient {

	@GetMapping("/{sessionId}")
	List<ReservationDto> findReservationBySessionId(@PathVariable String sessionId);

	@PostMapping
	void insertReservation(@RequestBody ReservationDto reservationDto);

	@DeleteMapping
	void deleteReservation(@RequestBody ReservationDto reservationDto);

	@PostMapping("/sing")
	void insertSing(@RequestBody SingingDto singingDto);

	@DeleteMapping("/sing")
	void deleteSing(@RequestBody SingingDto singingDto);

}
