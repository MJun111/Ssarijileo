package com.ssafy.ssarijileo.sse.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ssafy.ssarijileo.api.friend.dto.FriendInviteEvent;
import com.ssafy.ssarijileo.api.friend.dto.FriendRequestEvent;

public interface SseService {

	SseEmitter connection(String userId);

	void sendFriendRequest(FriendRequestEvent event);

	void sendFriendInvite(FriendInviteEvent event);
}
