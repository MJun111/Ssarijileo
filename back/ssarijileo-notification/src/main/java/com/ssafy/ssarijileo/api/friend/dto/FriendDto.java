package com.ssafy.ssarijileo.api.friend.dto;

import lombok.Getter;

@Getter
public class FriendDto {

	// 친구PK
	Long friendId;

	// 보낸사람 닉네임
	String fromUserNickname;

	// 받는사람 닉네임
	String toUserNickname;

	// 노래방 세션ID
	String sessionId;
}
