package com.ssafy.ssarijileo.api.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {

	// PK
	String profileId;

	// 닉네임
	String nickname;

	// 프로필이미지
	String image;
}
