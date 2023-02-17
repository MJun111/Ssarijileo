package com.ssafy.ssarijileo.api.friend.service;

import com.ssafy.ssarijileo.api.friend.dto.FriendDto;

public interface FriendService {

	void requestFriend(FriendDto friendDto);

	void inviteFriend(FriendDto friendDto);
}
