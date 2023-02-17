package com.ssafy.ssarijileo.api.friend.service;

import java.util.List;

import com.ssafy.ssarijileo.api.friend.dto.FriendDto;
import com.ssafy.ssarijileo.api.friend.dto.FriendResponseDto;
import com.ssafy.ssarijileo.api.friend.dto.FriendUpdateDto;
import com.ssafy.ssarijileo.api.friend.dto.MyFriendDto;

public interface FriendService {

	List<FriendResponseDto> findAllFriend(String nickname);

	List<MyFriendDto> findFriendByNickname(String nickname);

	Long requestFriend(FriendDto friendDto);

	void updateFriend(FriendUpdateDto friendUpdateDto);
}
