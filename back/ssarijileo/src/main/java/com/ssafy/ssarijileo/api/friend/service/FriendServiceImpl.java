package com.ssafy.ssarijileo.api.friend.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.ssafy.ssarijileo.api.friend.dto.FriendResponseDto;
import com.ssafy.ssarijileo.api.profile.entitiy.Profile;
import com.ssafy.ssarijileo.api.profile.repository.ProfileJpaRepository;
import com.ssafy.ssarijileo.common.exception.NotFoundException;
import com.ssafy.ssarijileo.api.friend.dto.FriendDto;
import com.ssafy.ssarijileo.api.friend.dto.FriendUpdateDto;
import com.ssafy.ssarijileo.api.friend.dto.MyFriendDto;
import com.ssafy.ssarijileo.api.friend.entity.Friend;
import com.ssafy.ssarijileo.api.friend.repository.FriendJpaRepository;
import com.ssafy.ssarijileo.api.friend.repository.FriendRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {

	private final FriendJpaRepository friendJpaRepository;
	private final FriendRepository friendRepository;
	private final ProfileJpaRepository profileJpaRepository;

	@Override
	public List<FriendResponseDto> findAllFriend(String nickname) {
		return friendRepository.findAllFriend(nickname).orElseThrow(NotFoundException::new);
	}

	@Override
	public List<MyFriendDto> findFriendByNickname(String nickname) {
		return friendRepository.findFriendByNickname(nickname).orElseThrow(NotFoundException::new);
	}

	@Override
	public Long requestFriend(FriendDto friendDto) {
		Profile fromProfile = profileJpaRepository.findByNickname(friendDto.getFromUserNickname()).orElseThrow(NotFoundException::new);
		Profile toProfile = profileJpaRepository.findByNickname(friendDto.getToUserNickname()).orElseThrow(NotFoundException::new);
		Friend friend = Friend.builder().friendDto(friendDto).fromProfile(fromProfile).toProfile(toProfile).build();
		friendJpaRepository.save(friend);

		return friend.getFriendId();
	}

	@Override
	public void updateFriend(FriendUpdateDto friendUpdateDto) {
		Friend friend = friendJpaRepository.findById(friendUpdateDto.getFriendId()).orElseThrow(NotFoundException::new);
		friend.updateFriend(friendUpdateDto.getStatus());
	}
}
