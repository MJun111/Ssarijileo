package com.ssafy.ssarijileo.api.singingcontest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SingingContestUpdateDto {

	// PK (AUTO_INCREMENT)
	private Long singingContestId;

	// 상태(V:노출,D:삭제,B:신고)
	private String status;
}
