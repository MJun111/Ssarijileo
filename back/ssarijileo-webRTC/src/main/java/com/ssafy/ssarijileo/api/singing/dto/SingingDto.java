package com.ssafy.ssarijileo.api.singing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SingingDto {

	// PK (AUTO_INCREMENT)
	Long singingId;

	// 사용자PK
	String userId;

	// 노래PK
	Long songId;

	// // 모드(N:일반,P:퍼펙트스코어,O:가사순서맞추기,R:이어부르기)
	// char mode;
	//
	// // 점수
	// int score;

	// 부른시간
	String SingingTime;

	// 부른시간 (sec)
	Long time;

	// 예약, 취소 구분
	String state;

	@Builder
	public SingingDto(String userId, Long songId, String state){
		this.userId = userId;
		this.songId = songId;
		this.state = state;
	}

}