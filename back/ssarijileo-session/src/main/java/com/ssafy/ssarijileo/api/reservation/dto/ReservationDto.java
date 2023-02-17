package com.ssafy.ssarijileo.api.reservation.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto implements Serializable {

	// 세션PK
	String sessionId;

	// 사용자PK
	String userId;

	// 노래PK
	Long songId;

	// 우선예약여부 (Y:우선예약, N:일반예약)
	String isPriority;
}
