package com.ssafy.ssarijileo.api.singingcontest.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class LikeDto {
	// 유저 ID
	String userId;
	
	// 노래자랑 게시글 ID 
	Long singingContestId;
	
	// 좋아요 여부
	String isLike;
}
