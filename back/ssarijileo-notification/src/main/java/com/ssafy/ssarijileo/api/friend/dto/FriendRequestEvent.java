package com.ssafy.ssarijileo.api.friend.dto;

import com.ssafy.ssarijileo.common.model.AlarmArgs;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FriendRequestEvent {

	AlarmArgs args;

	// 보낸사람 닉네임
	String fromUserNickname;

	// 친구PK
	Long friendId;
}
