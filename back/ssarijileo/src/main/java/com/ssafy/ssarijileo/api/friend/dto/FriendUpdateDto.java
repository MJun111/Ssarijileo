package com.ssafy.ssarijileo.api.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FriendUpdateDto {

	// PK (AUTO_INCREMENT)
	Long friendId;

	// 상태(W:대기,A:수락,X:취소)
	String status;
}
