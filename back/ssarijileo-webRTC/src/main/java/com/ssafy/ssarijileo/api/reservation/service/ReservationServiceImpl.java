package com.ssafy.ssarijileo.api.reservation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ssarijileo.api.reservation.client.ReservationClient;
import com.ssafy.ssarijileo.api.reservation.dto.ReservationDto;
import com.ssafy.ssarijileo.api.singing.dto.SingingDto;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReservationServiceImpl implements ReservationService {

	private final ReservationClient reservationClient;

	@Override
	public List<ReservationDto> findReservationBySessionId(String sessionId) {
		return reservationClient.findReservationBySessionId(sessionId);
	}

	@Override
	public void insertReservation(ReservationDto reservationDto) {
		reservationClient.insertReservation(reservationDto);
	}

	@Override
	public void deleteReservation(ReservationDto reservationDto) {
		reservationClient.deleteReservation(reservationDto);
	}

	@Override
	public void insertSing(SingingDto singingDto) {
		reservationClient.insertSing(singingDto);
	}

	@Override
	public void deleteSing(SingingDto singingDto) {
		reservationClient.deleteSing(singingDto);
	}
}
