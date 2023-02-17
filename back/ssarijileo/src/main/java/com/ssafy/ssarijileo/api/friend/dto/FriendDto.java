package com.ssafy.ssarijileo.api.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FriendDto {

	// PK (AUTO_INCREMENT)
	Long friendId;

	// 보낸 사용자 닉네임
	String fromUserNickname;

	// 받는 사용자 닉네임
	String toUserNickname;

	// 상태(W:대기,A:수락,X:취소)
	String status;
}
