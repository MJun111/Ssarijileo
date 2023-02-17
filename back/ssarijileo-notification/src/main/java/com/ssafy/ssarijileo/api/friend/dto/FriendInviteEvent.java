package com.ssafy.ssarijileo.api.friend.dto;

import com.ssafy.ssarijileo.common.model.AlarmArgs;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FriendInviteEvent {

	AlarmArgs args;

	// 보낸사람 닉네임
	String fromUserNickname;

	// 노래방 세션ID
	String sessionId;
}
