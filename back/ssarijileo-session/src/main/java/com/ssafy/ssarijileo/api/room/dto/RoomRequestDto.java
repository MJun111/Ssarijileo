package com.ssafy.ssarijileo.api.room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDto {

	// 세션PK
	String sessionId;

	// 방장 사용자PK
	String userId;
}
