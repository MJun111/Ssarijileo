package com.ssafy.ssarijileo.api.friend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MyFriendDto {

	// PK (AUTO_INCREMENT)
	Long friendId;

	// 친구 닉네임
	String nickname;

	// 친구 프로필이미지
	String image;

	// 상태(W:대기,A:수락,X:취소)
	String status;
}
