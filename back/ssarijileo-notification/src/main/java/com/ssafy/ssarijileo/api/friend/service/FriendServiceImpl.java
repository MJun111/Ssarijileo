package com.ssafy.ssarijileo.api.friend.service;

import org.springframework.stereotype.Service;

import com.ssafy.ssarijileo.api.friend.client.FriendClient;
import com.ssafy.ssarijileo.api.friend.dto.FriendDto;
import com.ssafy.ssarijileo.common.model.AlarmArgs;
import com.ssafy.ssarijileo.api.friend.dto.FriendInviteEvent;
import com.ssafy.ssarijileo.api.friend.dto.FriendRequestEvent;
import com.ssafy.ssarijileo.sse.service.SseService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService{

	private final FriendClient friendClient;

	private final SseService sseService;

	@Override
	public void requestFriend(FriendDto friendDto) {
		String fromUserId = friendClient.findIdByNickname(friendDto.getFromUserNickname());
		String toUserId = friendClient.findIdByNickname(friendDto.getToUserNickname());
		AlarmArgs args = new AlarmArgs("request", fromUserId, toUserId);
		FriendRequestEvent event = FriendRequestEvent.builder()
			.args(args).fromUserNickname(friendDto.getFromUserNickname())
			.friendId(friendDto.getFriendId()).build();

		sseService.sendFriendRequest(event);
	}

	@Override
	public void inviteFriend(FriendDto friendDto) {
		String fromUserId = friendClient.findIdByNickname(friendDto.getFromUserNickname());
		String toUserId = friendClient.findIdByNickname(friendDto.getToUserNickname());
		AlarmArgs args = new AlarmArgs("invite", fromUserId, toUserId);
		FriendInviteEvent event = FriendInviteEvent.builder()
			.args(args).fromUserNickname(friendDto.getFromUserNickname())
			.sessionId(friendDto.getSessionId()).build();

		sseService.sendFriendInvite(event);
	}
}
