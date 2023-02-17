package com.ssafy.ssarijileo.api.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FriendResponseDto {

	// 친구 닉네임
	String nickname;

	// 친구 프로필이미지
	String image;
}
