package com.ssafy.ssarijileo.api.reservation.service;

import java.util.List;

import com.ssafy.ssarijileo.api.reservation.dto.ReservationDto;
import com.ssafy.ssarijileo.api.singing.dto.SingingDto;

public interface ReservationService {

	List<ReservationDto> findReservationBySessionId(String sessionId);

	void createReservation(String sessionId);

	void insertReservation(ReservationDto reservationDto);

	void deleteReservation(ReservationDto reservationDto);

	void insertSing(SingingDto singingDto);

	void deleteSing(SingingDto singingDto);
}
