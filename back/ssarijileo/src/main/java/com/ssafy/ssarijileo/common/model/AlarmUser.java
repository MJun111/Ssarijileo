package com.ssafy.ssarijileo.common.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlarmUser {

	// 보낸사람PK
	private String fromUserId;

	// 받는사람PK
	private String toUserId;
}
